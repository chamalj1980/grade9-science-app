import { sanitizeSvg } from "../content/sanitizeSvg";
import type { Block, ContentGroup, ContentSection } from "../content/schema";
import { uid } from "../components/design/starters";

// Turns raw model output into a safe ContentSection the editor can load. AI output is
// imperfect, so this is lenient where it can coerce and strict where it must: it strips
// code fences, parses JSON, normalizes the hero, keeps only known block types, sanitizes
// inline SVG, and repairs mcq answer indices. Anything dropped or fixed is reported.

export interface ParseResult {
  section: ContentSection | null;
  errors: string[];
  warnings: string[];
}

const KNOWN_BLOCK_TYPES = new Set<Block["type"]>([
  "prose",
  "callout",
  "cardGrid",
  "sequenceStrip",
  "termList",
  "figure",
  "revealTabs",
  "stepper",
  "hotspotDiagram",
  "orderTimeline",
  "sortBins",
  "mcq",
  "markDone"
]);

function stripFences(text: string): string {
  const trimmed = text.trim();
  // Pull the JSON out of a ```json ... ``` fence if the model added one.
  const fence = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fence) {
    return fence[1].trim();
  }
  // Otherwise take from the first { to the last } so stray prose is ignored.
  const first = trimmed.indexOf("{");
  const last = trimmed.lastIndexOf("}");
  if (first >= 0 && last > first) {
    return trimmed.slice(first, last + 1);
  }
  return trimmed;
}

function asString(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

export function parseDraft(raw: string): ParseResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!raw.trim()) {
    return { section: null, errors: ["Nothing to parse — paste the draft JSON first."], warnings };
  }

  let data: unknown;
  try {
    data = JSON.parse(stripFences(raw));
  } catch (error) {
    return {
      section: null,
      errors: [`Not valid JSON: ${(error as Error).message}`],
      warnings
    };
  }

  if (!data || typeof data !== "object") {
    return { section: null, errors: ["Top level must be a JSON object."], warnings };
  }

  const obj = data as Record<string, unknown>;
  const heroIn = (obj.hero ?? {}) as Record<string, unknown>;
  const hero: ContentSection["hero"] = {
    variant: "lesson",
    eyebrow: asString(heroIn.eyebrow, "Lesson"),
    title: asString(heroIn.title, "Untitled lesson"),
    intro: asString(heroIn.intro, "")
  };

  const rawGroups = Array.isArray(obj.groups) ? obj.groups : [];
  if (rawGroups.length === 0) {
    errors.push("No `groups` array found — the model output isn't a lesson section.");
    return { section: null, errors, warnings };
  }

  const groups: ContentGroup[] = [];
  rawGroups.forEach((groupUnknown, gi) => {
    const group = (groupUnknown ?? {}) as Record<string, unknown>;
    const rawBlocks = Array.isArray(group.blocks) ? group.blocks : [];
    const blocks: Block[] = [];

    rawBlocks.forEach((blockUnknown, bi) => {
      const block = (blockUnknown ?? {}) as Record<string, unknown>;
      const type = block.type as Block["type"];
      if (!KNOWN_BLOCK_TYPES.has(type)) {
        warnings.push(`Group ${gi + 1}, block ${bi + 1}: unknown type "${String(block.type)}" — dropped.`);
        return;
      }
      blocks.push(repairBlock(type, block, warnings, gi, bi));
    });

    groups.push({
      heading: asString(group.heading) || undefined,
      className: asString(group.className) || undefined,
      blocks
    });
  });

  const section: ContentSection = { id: "lesson", hero, groups };
  return { section, errors, warnings };
}

// Per-type light repair. Recognized blocks pass through mostly as-is; we only fix the
// things that would break rendering or grading.
function repairBlock(
  type: Block["type"],
  block: Record<string, unknown>,
  warnings: string[],
  gi: number,
  bi: number
): Block {
  if (type === "figure" && typeof block.svg === "string") {
    return { ...(block as object), type, svg: sanitizeSvg(block.svg) } as Block;
  }

  if (type === "mcq") {
    const rawQuestions = Array.isArray(block.questions) ? block.questions : [];
    const questions = rawQuestions.map((questionUnknown) => {
      const question = (questionUnknown ?? {}) as Record<string, unknown>;
      const options = Array.isArray(question.options)
        ? question.options.map((option) => asString(option))
        : [];
      let answer = typeof question.answer === "number" ? question.answer : 0;
      if (answer < 0 || answer >= options.length) {
        warnings.push(`Group ${gi + 1}, block ${bi + 1}: mcq answer index out of range — reset to 0.`);
        answer = 0;
      }
      return {
        id: asString(question.id) || uid("q"),
        prompt: asString(question.prompt),
        options,
        answer
      };
    });
    return { type: "mcq", title: asString(block.title) || undefined, questions } as Block;
  }

  // Everything else is trusted structurally (the renderer tolerates optional fields).
  return { ...(block as object), type } as Block;
}
