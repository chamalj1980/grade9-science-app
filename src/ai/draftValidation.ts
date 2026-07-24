import { uid } from "../components/design/starters";
import type { ChapterDraft, EditorSection, SectionKind } from "../components/design/types";
import { sectionKindLabel } from "../components/design/types";
import { sanitizeSvg } from "../content/sanitizeSvg";
import type { Block, ContentGroup } from "../content/schema";

// Turns raw model output into a safe ChapterDraft the editor can load. AI output is
// imperfect, so this is lenient where it can coerce and strict where it must: it strips
// code fences, parses JSON, normalizes sections/heroes, keeps only known block types,
// sanitizes inline SVG, and repairs answer keys (mcq index, sortBins binId, order ids).
// Anything dropped or fixed is reported back to the teacher.

export interface ParseResult {
  draft: ChapterDraft | null;
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

const KNOWN_KINDS = new Set<SectionKind>(["lesson", "exercise", "recap"]);

function stripFences(text: string): string {
  const trimmed = text.trim();
  const fence = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fence) {
    return fence[1].trim();
  }
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
    return { draft: null, errors: ["Nothing to parse — paste the draft JSON first."], warnings };
  }

  let data: unknown;
  try {
    data = JSON.parse(stripFences(raw));
  } catch (error) {
    return { draft: null, errors: [`Not valid JSON: ${(error as Error).message}`], warnings };
  }

  if (!data || typeof data !== "object") {
    return { draft: null, errors: ["Top level must be a JSON object."], warnings };
  }

  const obj = data as Record<string, unknown>;

  // Preferred shape: a chapter with a `sections` array.
  if (Array.isArray(obj.sections)) {
    if (obj.sections.length === 0) {
      errors.push("`sections` is empty — nothing to load.");
      return { draft: null, errors, warnings };
    }
    const sections = obj.sections.map((section, index) =>
      normalizeSection(section, index, warnings)
    );
    return {
      draft: {
        title: asString(obj.title) || sections[0].hero.title || "Untitled chapter",
        sections
      },
      errors,
      warnings
    };
  }

  // Legacy shape: a single lesson section ({ hero, groups }) — wrap it as a one-lesson chapter.
  if (obj.hero || Array.isArray(obj.groups)) {
    const section = normalizeSection(
      { kind: "lesson", label: "Lesson", hero: obj.hero, groups: obj.groups },
      0,
      warnings
    );
    return {
      draft: { title: section.hero.title || "Untitled chapter", sections: [section] },
      errors,
      warnings
    };
  }

  errors.push("No `sections` array found — the model output isn't a chapter.");
  return { draft: null, errors, warnings };
}

function normalizeSection(raw: unknown, index: number, warnings: string[]): EditorSection {
  const section = (raw ?? {}) as Record<string, unknown>;

  const rawKind = section.kind as SectionKind;
  const kind: SectionKind = KNOWN_KINDS.has(rawKind) ? rawKind : "lesson";
  if (!KNOWN_KINDS.has(rawKind)) {
    warnings.push(`Section ${index + 1}: unknown kind "${String(section.kind)}" — treated as a lesson.`);
  }

  const heroIn = (section.hero ?? {}) as Record<string, unknown>;
  const hero = {
    variant: (kind === "exercise" ? "exercise" : "lesson") as "exercise" | "lesson",
    eyebrow: asString(heroIn.eyebrow, sectionKindLabel[kind]),
    title: asString(heroIn.title, `Untitled ${kind}`),
    intro: asString(heroIn.intro, "")
  };

  const rawGroups = Array.isArray(section.groups) ? section.groups : [];
  const groups: ContentGroup[] = rawGroups.map((groupUnknown, gi) => {
    const group = (groupUnknown ?? {}) as Record<string, unknown>;
    const rawBlocks = Array.isArray(group.blocks) ? group.blocks : [];
    const blocks: Block[] = [];
    rawBlocks.forEach((blockUnknown, bi) => {
      const block = (blockUnknown ?? {}) as Record<string, unknown>;
      const type = block.type as Block["type"];
      if (!KNOWN_BLOCK_TYPES.has(type)) {
        warnings.push(
          `Section ${index + 1}, group ${gi + 1}, block ${bi + 1}: unknown type "${String(block.type)}" — dropped.`
        );
        return;
      }
      blocks.push(repairBlock(type, block, warnings, index, gi, bi));
    });
    return { heading: asString(group.heading) || undefined, blocks };
  });

  return {
    key: uid("sec"),
    kind,
    label: asString(section.label) || sectionKindLabel[kind],
    hero,
    groups: groups.length > 0 ? groups : [{ blocks: [] }]
  };
}

// Per-type repair — we only fix what would break rendering or grading.
function repairBlock(
  type: Block["type"],
  block: Record<string, unknown>,
  warnings: string[],
  si: number,
  gi: number,
  bi: number
): Block {
  const where = `Section ${si + 1}, group ${gi + 1}, block ${bi + 1}`;

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
        warnings.push(`${where}: mcq answer index out of range — reset to 0.`);
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

  if (type === "sortBins") {
    const rawBins = Array.isArray(block.bins) ? block.bins : [];
    const bins = rawBins.map((binUnknown, i) => {
      const bin = (binUnknown ?? {}) as Record<string, unknown>;
      return {
        id: asString(bin.id) || uid("bin"),
        title: asString(bin.title, `Group ${i + 1}`),
        emoji: asString(bin.emoji, "📦"),
        hint: asString(bin.hint) || undefined
      };
    });
    const binIds = new Set(bins.map((bin) => bin.id));
    const fallback = bins[0]?.id ?? "";
    const rawItems = Array.isArray(block.items) ? block.items : [];
    const items = rawItems.map((itemUnknown) => {
      const item = (itemUnknown ?? {}) as Record<string, unknown>;
      let binId = asString(item.binId);
      if (!binIds.has(binId)) {
        warnings.push(`${where}: sortBins item pointed at an unknown bin — moved to "${bins[0]?.title ?? "the first bin"}".`);
        binId = fallback;
      }
      return {
        id: asString(item.id) || uid("it"),
        text: asString(item.text),
        binId,
        reason: asString(item.reason) || undefined
      };
    });
    return {
      type: "sortBins",
      title: asString(block.title) || undefined,
      wrapperClass: asString(block.wrapperClass) || undefined,
      bins,
      items
    } as Block;
  }

  if (type === "orderTimeline") {
    const rawRounds = Array.isArray(block.rounds) ? block.rounds : [];
    const rounds = rawRounds.map((roundUnknown, i) => {
      const round = (roundUnknown ?? {}) as Record<string, unknown>;
      const rawOrder = Array.isArray(round.order) ? round.order : [];
      const order = rawOrder.map((itemUnknown) => {
        const item = (itemUnknown ?? {}) as Record<string, unknown>;
        return {
          id: asString(item.id) || uid("o"),
          emoji: asString(item.emoji, "🔹"),
          label: asString(item.label)
        };
      });
      if (order.length < 2) {
        warnings.push(`${where}: ordering round ${i + 1} has fewer than 2 items.`);
      }
      return {
        id: asString(round.id) || uid("round"),
        title: asString(round.title, `Round ${i + 1}`),
        prompt: asString(round.prompt, "Put these in the correct order."),
        order
      };
    });
    return {
      type: "orderTimeline",
      rounds,
      successNote: asString(block.successNote) || undefined
    } as Block;
  }

  return { ...(block as object), type } as Block;
}
