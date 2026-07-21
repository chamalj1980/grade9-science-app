import { describe, expect, it } from "vitest";
import { evolutionChapter } from "../../src/content/chapters/evolution";
import type {
  Block,
  McqBlock,
  OrderTimelineBlock,
  SortBinsBlock
} from "../../src/content/schema";
import {
  correctOrder,
  isCorrectBin,
  isOrderComplete,
  itemsForBin,
  mcqScore,
  orderCorrectness,
  totalOrderItems
} from "../../src/content/blocks/logic";

// Collect every block of a given type across a chapter's sections/groups.
function blocksOfType<T extends Block["type"]>(
  type: T
): Extract<Block, { type: T }>[] {
  const found: Extract<Block, { type: T }>[] = [];
  for (const section of evolutionChapter.sections) {
    for (const group of section.groups) {
      for (const block of group.blocks) {
        if (block.type === type) {
          found.push(block as Extract<Block, { type: T }>);
        }
      }
    }
  }
  return found;
}

const orderBlock = blocksOfType("orderTimeline")[0] as OrderTimelineBlock;
const sortBlock = blocksOfType("sortBins")[0] as SortBinsBlock;
const mcqBlock = blocksOfType("mcq")[0] as McqBlock;

describe("orderTimeline logic", () => {
  it("marks the exact correct order complete, and any swap incomplete", () => {
    const round = orderBlock.rounds[1]; // the animal march
    const answer = correctOrder(round);

    expect(isOrderComplete(round, answer)).toBe(true);

    const swapped = [...answer];
    [swapped[0], swapped[1]] = [swapped[1], swapped[0]];
    expect(isOrderComplete(round, swapped)).toBe(false);
  });

  it("is incomplete until every slot is filled", () => {
    const round = orderBlock.rounds[0];
    const answer = correctOrder(round);
    expect(isOrderComplete(round, answer.slice(0, answer.length - 1))).toBe(false);
  });

  it("reports which placed positions are correct", () => {
    const round = orderBlock.rounds[2]; // plants
    const answer = correctOrder(round);
    const almost = [...answer];
    [almost[0], almost[1]] = [almost[1], almost[0]]; // first two wrong, rest right
    const marks = orderCorrectness(round, almost);
    expect(marks[0]).toBe(false);
    expect(marks[1]).toBe(false);
    expect(marks.slice(2).every(Boolean)).toBe(true);
  });

  it("counts every item across rounds and keeps ids unique within a round", () => {
    const total = orderBlock.rounds.reduce((sum, round) => sum + round.order.length, 0);
    expect(totalOrderItems(orderBlock)).toBe(total);
    for (const round of orderBlock.rounds) {
      const ids = round.order.map((item) => item.id);
      expect(new Set(ids).size).toBe(ids.length);
      expect(ids.length).toBeGreaterThanOrEqual(4);
    }
  });

  it("orders the animal round from earliest life to most recent", () => {
    const animals = orderBlock.rounds.find((round) => round.id === "animals")!;
    expect(animals.order[0].id).toBe("bacteria");
    expect(animals.order[animals.order.length - 1].id).toBe("birds");
  });
});

describe("sortBins logic", () => {
  it("accepts an item only in its correct bin", () => {
    expect(isCorrectBin(sortBlock, "s1", "true")).toBe(true);
    expect(isCorrectBin(sortBlock, "s1", "false")).toBe(false);
    expect(isCorrectBin(sortBlock, "s2", "false")).toBe(true);
    expect(isCorrectBin(sortBlock, "s2", "true")).toBe(false);
  });

  it("splits items into non-empty bins, each referencing a declared bin", () => {
    const binIds = new Set(sortBlock.bins.map((bin) => bin.id));
    for (const bin of sortBlock.bins) {
      expect(itemsForBin(sortBlock, bin.id).length).toBeGreaterThanOrEqual(4);
    }
    for (const item of sortBlock.items) {
      expect(binIds.has(item.binId)).toBe(true);
    }
    const ids = sortBlock.items.map((item) => item.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe("mcq logic", () => {
  it("scores only the correct choices", () => {
    const perfect = Object.fromEntries(
      mcqBlock.questions.map((question) => [question.id, question.answer])
    );
    expect(mcqScore(mcqBlock, perfect)).toBe(mcqBlock.questions.length);

    const firstWrong = { ...perfect, [mcqBlock.questions[0].id]: -1 };
    expect(mcqScore(mcqBlock, firstWrong)).toBe(mcqBlock.questions.length - 1);
  });

  it("keeps every answer index within its options", () => {
    for (const question of mcqBlock.questions) {
      expect(question.answer).toBeGreaterThanOrEqual(0);
      expect(question.answer).toBeLessThan(question.options.length);
    }
  });
});

describe("chapter wiring", () => {
  it("exposes lesson and both exercise sections", () => {
    const ids = evolutionChapter.sections.map((section) => section.id);
    expect(ids).toContain("lesson");
    expect(ids).toContain("exercise-1");
    expect(ids).toContain("exercise-2");
  });
});
