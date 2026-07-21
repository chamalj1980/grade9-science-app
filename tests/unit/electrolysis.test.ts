import { describe, expect, it } from "vitest";
import { electrolysisChapter } from "../../src/content/chapters/electrolysis";
import type { Block, McqBlock, SortBinsBlock } from "../../src/content/schema";
import { isCorrectBin, itemsForBin, mcqScore } from "../../src/content/blocks/logic";

function blocksOfType<T extends Block["type"]>(type: T): Extract<Block, { type: T }>[] {
  const found: Extract<Block, { type: T }>[] = [];
  for (const section of electrolysisChapter.sections) {
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

const sortBlocks = blocksOfType("sortBins") as SortBinsBlock[];
const [classifySort, trueFalseSort] = sortBlocks;
const mcqBlock = blocksOfType("mcq")[0] as McqBlock;

describe("electrolysis chapter data", () => {
  it("wires the lesson and both exercises", () => {
    const ids = electrolysisChapter.sections.map((section) => section.id);
    expect(ids).toEqual(["lesson", "exercise-1", "exercise-2"]);
  });

  it("has two sort exercises and one quiz", () => {
    expect(sortBlocks).toHaveLength(2);
    expect(mcqBlock.questions.length).toBeGreaterThanOrEqual(6);
  });

  it("classifies electrolytes vs non-electrolytes into declared bins", () => {
    const binIds = new Set(classifySort.bins.map((bin) => bin.id));
    for (const item of classifySort.items) {
      expect(binIds.has(item.binId)).toBe(true);
    }
    // Fused NaCl conducts (electrolyte); solid NaCl does not.
    expect(isCorrectBin(classifySort, "fused-nacl", "electrolyte")).toBe(true);
    expect(isCorrectBin(classifySort, "solid-nacl", "nonelectrolyte")).toBe(true);
    expect(itemsForBin(classifySort, "electrolyte").length).toBeGreaterThanOrEqual(3);
    expect(itemsForBin(classifySort, "nonelectrolyte").length).toBeGreaterThanOrEqual(3);
  });

  it("keeps true/false statements balanced and correctly keyed", () => {
    expect(itemsForBin(trueFalseSort, "true").length).toBeGreaterThanOrEqual(4);
    expect(itemsForBin(trueFalseSort, "false").length).toBeGreaterThanOrEqual(4);
    // Hydrogen forms at the NEGATIVE electrode — the positive-electrode claim is false.
    expect(isCorrectBin(trueFalseSort, "t6", "false")).toBe(true);
  });

  it("scores the recap quiz and keeps answer indices valid", () => {
    const perfect = Object.fromEntries(
      mcqBlock.questions.map((question) => [question.id, question.answer])
    );
    expect(mcqScore(mcqBlock, perfect)).toBe(mcqBlock.questions.length);
    for (const question of mcqBlock.questions) {
      expect(question.answer).toBeGreaterThanOrEqual(0);
      expect(question.answer).toBeLessThan(question.options.length);
    }
  });
});
