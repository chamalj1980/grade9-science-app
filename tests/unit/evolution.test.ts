import { describe, expect, it } from "vitest";
import {
  earthTheories,
  evoStatements,
  lifeTheories,
  timelineRounds
} from "../../src/data/evolutionData";
import {
  correctOrder,
  getRound,
  isCorrectTruth,
  isOrderComplete,
  orderCorrectness,
  statementsByTruth,
  totalRounds,
  totalStatements
} from "../../src/utils/evolution";

describe("timeline ordering", () => {
  it("marks the exact correct order complete, and any swap incomplete", () => {
    const round = timelineRounds[1]; // the animal march
    const answer = correctOrder(round);

    expect(isOrderComplete(round, answer)).toBe(true);

    const swapped = [...answer];
    [swapped[0], swapped[1]] = [swapped[1], swapped[0]];
    expect(isOrderComplete(round, swapped)).toBe(false);
  });

  it("is incomplete until every slot is filled", () => {
    const round = timelineRounds[0];
    const answer = correctOrder(round);
    expect(isOrderComplete(round, answer.slice(0, answer.length - 1))).toBe(false);
  });

  it("reports which placed positions are correct", () => {
    const round = timelineRounds[2]; // plants
    const answer = correctOrder(round);
    const almost = [...answer];
    [almost[0], almost[1]] = [almost[1], almost[0]]; // first two wrong, rest right
    const marks = orderCorrectness(round, almost);
    expect(marks[0]).toBe(false);
    expect(marks[1]).toBe(false);
    expect(marks.slice(2).every(Boolean)).toBe(true);
  });

  it("puts the earliest life form first in the animal round", () => {
    const animals = getRound("animals")!;
    expect(animals.order[0].id).toBe("bacteria");
    expect(animals.order[animals.order.length - 1].id).toBe("birds");
  });

  it("keeps unique item ids within each round and counts rounds", () => {
    expect(totalRounds).toBe(timelineRounds.length);
    for (const round of timelineRounds) {
      const ids = round.order.map((item) => item.id);
      expect(new Set(ids).size).toBe(ids.length);
      expect(ids.length).toBeGreaterThanOrEqual(4);
    }
  });
});

describe("true / false statements", () => {
  it("counts every statement", () => {
    expect(totalStatements).toBe(evoStatements.length);
  });

  it("accepts a statement only under its true value", () => {
    expect(isCorrectTruth("s1", "true")).toBe(true); // Earth ~4.5 bya
    expect(isCorrectTruth("s1", "false")).toBe(false);
    expect(isCorrectTruth("s2", "false")).toBe(true); // no oxygen early
    expect(isCorrectTruth("s2", "true")).toBe(false);
  });

  it("splits into true and false, each non-empty, with unique ids", () => {
    expect(statementsByTruth(true).length).toBeGreaterThanOrEqual(4);
    expect(statementsByTruth(false).length).toBeGreaterThanOrEqual(4);
    const ids = evoStatements.map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe("theory data", () => {
  it("has exactly one accepted origin-of-life theory (bio-chemical)", () => {
    const accepted = lifeTheories.filter((theory) => theory.accepted);
    expect(accepted).toHaveLength(1);
    expect(accepted[0].id).toBe("biochemical");
  });

  it("has both a first-scientific and a modern Earth theory", () => {
    const statuses = earthTheories.map((theory) => theory.status);
    expect(statuses).toContain("first-scientific");
    expect(statuses).toContain("modern");
  });
});
