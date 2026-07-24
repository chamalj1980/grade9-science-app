// The authoring prompt: the instructions that turn a raw chapter's text into a full
// CHAPTER (lesson + the exercises the teacher asked for + a recap) expressed as our block
// schema. Transport-agnostic — the same prompt whether a teacher runs it in Claude by hand
// or a server proxy calls the API.
//
// The SYSTEM prompt is static (schema + block reference + rules) so it stays cacheable; the
// per-request spec (chapter text, how many exercises, recap brief) goes in the USER message.
// Keep the block reference in sync with schema.ts as block types evolve.

import { exerciseTypeOption, type DraftOptions } from "./draftOptions";

export const DRAFT_MAX_TOKENS = 16000;

// Concise JSON shapes + when-to-use for the blocks the AI may emit.
const BLOCK_REFERENCE = `
prose         — explanation paragraphs. { "type":"prose", "body":["paragraph; use **bold** for key terms", ...] }
callout       — a highlighted note. { "type":"callout", "variant":"key"|"help"|"feature", "emoji":"👴 (feature only)", "body":"text" }
cardGrid      — 2–6 related items side by side. { "type":"cardGrid", "variant":"badges"|"facts"|"icons"|"plain", "heading":"optional", "cards":[{ "emoji":"⭐","title":"...","body":"...","badge":"short tag (badges only)" }] }
termList      — key words. { "type":"termList", "terms":[{ "term":"...", "meaning":"..." }] }
sequenceStrip — an ordered process to READ (not solve). { "type":"sequenceStrip", "items":[{ "id":"a","emoji":"🥚","label":"..." }], "note":"optional" }
figure        — a diagram. Prefer a library id when it fits: "tree-of-life", "rock-strata", "primordial-earth". Otherwise simple inline SVG. { "type":"figure", "art":"<library id>", "caption":"optional" } OR { "type":"figure", "svg":"<svg viewBox=\\"0 0 240 160\\">...simple shapes only...</svg>", "alt":"describe it", "caption":"optional" }
mcq           — a multiple-choice quiz. { "type":"mcq", "title":"Quick check", "questions":[{ "id":"q1","prompt":"...","options":["A","B","C"],"answer":0 }] }   // answer = 0-based index of the CORRECT option
sortBins      — sort item cards into labelled groups. { "type":"sortBins", "title":"...", "bins":[{ "id":"b1","title":"Group A","emoji":"🅰️","hint":"optional" }], "items":[{ "id":"i1","text":"...","binId":"b1","reason":"why it belongs there" }] }   // every item's binId MUST equal one of the bin ids
orderTimeline — arrange items into the correct order. { "type":"orderTimeline", "rounds":[{ "id":"r1","title":"Level 1 · ...","prompt":"Put these in order, earliest first.","order":[{ "id":"o1","emoji":"🌍","label":"..." }] }], "successNote":"optional" }   // "order" IS the correct sequence
`.trim();

const EXAMPLE = `{
  "title": "The Water Cycle",
  "sections": [
    {
      "kind": "lesson",
      "label": "Lesson",
      "hero": { "eyebrow": "Lesson", "title": "The Water Cycle", "intro": "💧 Water is never still — it travels from the sea to the sky and back again." },
      "groups": [
        {
          "heading": "☀️ The journey begins",
          "blocks": [
            { "type": "prose", "body": ["The Sun heats the sea and water becomes an invisible gas called **water vapour**. This is **evaporation**."] }
          ]
        }
      ]
    },
    {
      "kind": "exercise",
      "label": "Exercise 1",
      "hero": { "eyebrow": "Exercise 1", "title": "Check your understanding", "intro": "Answer these questions." },
      "groups": [
        {
          "blocks": [
            { "type": "mcq", "title": "Quick check", "questions": [
              { "id": "q1", "prompt": "What is evaporation?", "options": ["Vapour becoming liquid", "Liquid becoming vapour"], "answer": 1 }
            ] }
          ]
        }
      ]
    },
    {
      "kind": "recap",
      "label": "Recap",
      "hero": { "eyebrow": "Recap", "title": "Water Cycle — recap", "intro": "The key points in one place." },
      "groups": [
        {
          "heading": "Key points",
          "blocks": [
            { "type": "termList", "terms": [{ "term": "Evaporation", "meaning": "Liquid water turning into vapour when heated." }] }
          ]
        }
      ]
    }
  ]
}`;

export const DRAFT_SYSTEM_PROMPT = `You are an expert Grade 9 science curriculum author writing for Sri Lankan students in clear, simple English.

Your job: turn the SOURCE CHAPTER text the user provides into ONE complete chapter — a lesson, the exercises the teacher asks for, and a recap — expressed as a single JSON object matching the schema below.

CHAPTER SHAPE:
{
  "title": "<the chapter's title>",
  "sections": [
    { "kind": "lesson"|"exercise"|"recap", "label": "<tab label>", "hero": { "eyebrow": "...", "title": "...", "intro": "<one line>" }, "groups": [ { "heading": "<optional emoji + title>", "blocks": [ <blocks> ] } ] }
  ]
}

BLOCK TYPES (use ONLY these):
${BLOCK_REFERENCE}

RULES:
- Output the JSON object ONLY. No markdown code fences, no commentary before or after.
- Section order: the "lesson" first, then each requested "exercise" in order, then the "recap" (if requested).
- The LESSON has 4–7 groups, each a clear sub-topic with an emoji heading. Use "prose" for explanation, "cardGrid" for comparisons/lists, a "termList" group for key words, and a "figure" where a diagram genuinely helps.
- Each EXERCISE section contains ONE group holding ONE block of exactly the type requested for it (optionally preceded by a one-line "prose" intro). Build it from the chapter's real content.
- Build each exercise at exactly the requested SIZE: for "mcq" that is the number of questions; for "sortBins" the number of items to sort (choose 2–4 sensible bins from the content); for "orderTimeline" the number of steps in the round.
- Answer keys must be CORRECT: "answer" is the 0-based index of the right option; every sortBins item's "binId" must match a declared bin id; an orderTimeline "order" array must be in the true correct sequence.
- The RECAP follows the teacher's recap brief exactly (see the request), using termList / prose / callout blocks.
- Grade 9 reading level. Short sentences. Wrap the most important terms in **bold**.
- Do NOT invent facts, numbers, or examples that are not supported by the source text. If the source doesn't cover something, leave it out.
- Keep any inline SVG simple and self-contained (basic shapes, no scripts, no external references).

EXAMPLE (format only — your content comes from the source text):
${EXAMPLE}`;

function buildSpec(options: DraftOptions): string {
  const lines: string[] = ["- Lesson: yes"];

  if (options.exercises.length === 0) {
    lines.push("- Exercises: none");
  } else {
    lines.push(`- Exercises: ${options.exercises.length}`);
    options.exercises.forEach((spec, index) => {
      const option = exerciseTypeOption(spec.type);
      lines.push(
        `   ${index + 1}. type "${spec.type}" — ${option.label} — exactly ${spec.count} ${option.countLabel}`
      );
    });
  }

  lines.push(
    options.includeRecap
      ? `- Recap: yes. Brief: ${options.recapInstruction.trim()}`
      : "- Recap: none"
  );

  return lines.join("\n");
}

export function buildDraftUserMessage(chapterText: string, options: DraftOptions): string {
  return `SOURCE CHAPTER TEXT:

${chapterText.trim()}

---
BUILD THIS CHAPTER:
${buildSpec(options)}

Write the chapter now as a single JSON object. Respond with only the JSON.`;
}

export function buildDraftPrompt(
  chapterText: string,
  options: DraftOptions
): { system: string; user: string } {
  return { system: DRAFT_SYSTEM_PROMPT, user: buildDraftUserMessage(chapterText, options) };
}

// The full prompt as one copyable block, for teachers who run it in Claude by hand.
export function buildCopyablePrompt(chapterText: string, options: DraftOptions): string {
  return `${DRAFT_SYSTEM_PROMPT}\n\n====================\n\n${buildDraftUserMessage(chapterText, options)}`;
}
