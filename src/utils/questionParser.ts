import type { TestQuestion } from "../data/testModel";

// Rule-based parser that turns pasted term-paper text into draft TestQuestions. It is a
// best-effort classifier — the Teacher Studio review step is where a teacher fixes the
// answer key, keywords, model answers and any mis-classification. It handles:
//   • MCQs written as "(5) prompt" followed by "(1)…(2)…(3)…(4)…" options (inline or on
//     their own lines), optionally with a "*" marking the correct option;
//   • short-answer / fill-in questions (default for brief prompts);
//   • essay / structured questions (prompts asking to explain / describe / discuss, or
//     worth more than 2 marks).

let idCounter = 0;
function makeId(): string {
  idCounter += 1;
  return `q-${Date.now().toString(36)}-${idCounter}`;
}

// The marker that opens a question block: "1.", "1)", "(1)", "Q1)", "(i)", "(A)".
const LEADING_MARKER =
  /^\s*(?:Q(?:uestion)?\s*)?(?:\((?:\d+|[ivxIVX]+|[A-Za-z])\)|\d+[).])\s*/;

// A line opening a numbered question, e.g. "1.", "1)", "(1)", "Q1".
const QUESTION_START = /^\s*(?:Q(?:uestion)?\s*)?\(?(\d+)[).]/i;

// A structured sub-part, e.g. "(i)", "(ii)", "(iv)". Papers never use roman numerals for
// MCQ options, so these reliably start a new question.
const ROMAN_START = /^\s*\((?:i{1,3}|iv|vi{0,3}|ix|xi{0,3}|x)\)/i;

function leadingNumber(line: string): number | null {
  const match = line.match(QUESTION_START);
  return match ? Number(match[1]) : null;
}

// The highest "(n)" marker on a line — handles two inline options such as
// "(1) Biomass (2) Geothermal energy".
function lastNumberMarker(line: string): number {
  const all = [...line.matchAll(/\((\d+)\)/g)].map((match) => Number(match[1]));
  return all.length > 0 ? all[all.length - 1] : (leadingNumber(line) ?? 0);
}

// Option markers: "(1)".."(5)", "(a)".."(e)", or line-leading "a)" / "1." etc.
const OPTION_MARKER = /\(([a-eA-E]|[1-5])\)|(?:^|\n)[ \t]*([a-eA-E]|[1-5])[).][ \t]+/g;

const ESSAY_HINT = /\b(explain|describe|discuss|why|account for|state the reason|reasons?|justify|compare|suggest why|how (does|do|can))\b/i;

// Pull a marks value out of the various notations a paper uses, and return the cleaned
// text with the marks tokens removed. Notations: ^1&, ^1x3&, (2 marks), [3], (1/2 x 4 = 2).
function extractMarks(text: string): { marks: number; clean: string } {
  let marks = 0;

  const caret = text.match(/\^\s*([0-9]+)(?:\s*[x×]\s*([0-9]+))?[^&]*&/);
  if (caret) {
    const base = Number(caret[1]);
    const mult = caret[2] ? Number(caret[2]) : 1;
    marks = Math.max(marks, base * mult);
  }
  const bracket = text.match(/\(\s*([0-9]+)\s*marks?\s*\)/i) || text.match(/\[\s*([0-9]+)\s*\]/);
  if (bracket) {
    marks = Math.max(marks, Number(bracket[1]));
  }

  // Newlines are preserved: line-leading option markers ("a)", "b)") depend on them.
  const clean = text
    .replace(/\^[^&]*&/g, " ")
    .replace(/\(\s*[0-9]+\s*marks?\s*\)/gi, " ")
    .replace(/\([0-9/x×\s=.]*\)[ \t]*$/gm, " ")
    .replace(/\[[0-9]+\]/g, " ")
    .replace(/[ \t]+/g, " ")
    .split("\n")
    .map((line) => line.trim())
    .join("\n")
    .trim();

  return { marks: marks || 1, clean };
}

// Split a chunk of text into (prompt, options[]) if it looks like an MCQ, else null.
function splitOptions(text: string): { prompt: string; options: string[]; answer: number } | null {
  OPTION_MARKER.lastIndex = 0;
  const markers: number[] = [];
  let match: RegExpExecArray | null;
  while ((match = OPTION_MARKER.exec(text)) !== null) {
    markers.push(match.index + (match[0].startsWith("(") ? 0 : match[0].search(/\S/)));
  }
  if (markers.length < 3) {
    return null;
  }

  const prompt = text.slice(0, markers[0]).trim();
  const options: string[] = [];
  let answer = 0;
  for (let i = 0; i < markers.length; i++) {
    const start = markers[i];
    const end = i + 1 < markers.length ? markers[i + 1] : text.length;
    // drop the leading marker itself, e.g. "(1)" or "a)"
    let optText = text
      .slice(start, end)
      .replace(/^\s*(?:\([a-eA-E1-5]\)|[a-eA-E1-5][).])\s*/, "")
      .trim();
    if (/[*✓]|\(correct\)/i.test(optText)) {
      answer = options.length;
      optText = optText.replace(/[*✓]|\(correct\)/gi, "").trim();
    }
    if (optText) {
      options.push(optText);
    }
  }

  if (options.length < 3 || !prompt) {
    return null;
  }
  return { prompt, options, answer };
}

// Break raw pasted text into question blocks. Blank lines separate questions when the
// teacher provides them. Otherwise we walk the lines and use an "option run" heuristic,
// because a paper writes both question numbers and MCQ options as "(n)":
//   • after a prompt, a "(1)" opens an option run, and (2)(3)(4) continue it;
//   • a numbered line that does NOT continue the run starts the next question.
// Roman sub-part markers "(i)" always start a new question.
function toBlocks(raw: string): string[] {
  const text = raw.replace(/\r\n?/g, "\n").trim();
  if (!text) {
    return [];
  }

  const byBlank = text
    .split(/\n\s*\n+/)
    .map((block) => block.trim())
    .filter(Boolean);
  if (byBlank.length > 1) {
    return byBlank;
  }

  const blocks: string[] = [];
  let current: string[] = [];
  let run = { active: false, last: 0 };

  const flush = () => {
    const block = current.join("\n").trim();
    if (block) {
      blocks.push(block);
    }
    current = [];
  };

  for (const line of text.split("\n")) {
    if (!line.trim()) {
      continue;
    }

    if (ROMAN_START.test(line)) {
      flush();
      run = { active: false, last: 0 };
      current = [line];
      continue;
    }

    const number = leadingNumber(line);
    if (number === null) {
      current.push(line); // prompt continuation or a lettered option
      continue;
    }

    if (current.length === 0) {
      current = [line];
      run = { active: false, last: 0 };
      continue;
    }

    if (run.active && number === run.last + 1) {
      current.push(line); // next option in the run
      run.last = lastNumberMarker(line);
      continue;
    }

    if (!run.active && number === 1) {
      current.push(line); // first option after the prompt
      run = { active: true, last: lastNumberMarker(line) };
      continue;
    }

    flush();
    run = { active: false, last: 0 };
    current = [line];
  }
  flush();

  return blocks;
}

export function parseQuestions(raw: string): TestQuestion[] {
  const questions: TestQuestion[] = [];

  for (const block of toBlocks(raw)) {
    // Strip the block's own marker ("(5)", "3.", "Q1)", "(i)", "(A)").
    const withoutNumber = block.replace(LEADING_MARKER, "").trim();
    const { marks, clean } = extractMarks(withoutNumber);

    const mcq = splitOptions(clean);
    if (mcq) {
      questions.push({
        id: makeId(),
        type: "mcq",
        prompt: mcq.prompt,
        options: mcq.options,
        answer: mcq.answer,
        marks,
        difficulty: "medium",
        source: "teacher"
      });
      continue;
    }

    const prompt = clean;
    if (!prompt) {
      continue;
    }

    const isEssay = ESSAY_HINT.test(prompt) || marks > 2;
    if (isEssay) {
      questions.push({
        id: makeId(),
        type: "essay",
        prompt,
        modelAnswer: "",
        marks,
        difficulty: "medium",
        source: "teacher"
      });
    } else {
      questions.push({
        id: makeId(),
        type: "short",
        prompt,
        accepted: [],
        marks,
        difficulty: "medium",
        source: "teacher"
      });
    }
  }

  return questions;
}
