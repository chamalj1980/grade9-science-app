import { describe, expect, it } from "vitest";
import { quizQuestions } from "../../src/data/quizQuestions";
import {
  computePoints,
  getStat,
  POINTS_CORRECT,
  questionsForModule,
  recordResult,
  shuffle,
  type QuizStats
} from "../../src/utils/quiz";

const builtModuleIds = [
  "pressure-solids",
  "circulatory-system",
  "sensory-system",
  "micro-organisms"
];

describe("quiz question bank", () => {
  it("every question has four options and a valid answer index", () => {
    for (const question of quizQuestions) {
      expect(question.options).toHaveLength(4);
      expect(question.answer).toBeGreaterThanOrEqual(0);
      expect(question.answer).toBeLessThan(4);
      expect(question.explanation.length).toBeGreaterThan(0);
    }
  });

  it("has unique question ids", () => {
    const ids = quizQuestions.map((question) => question.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("provides a set of questions for every built module", () => {
    for (const moduleId of builtModuleIds) {
      const set = questionsForModule(moduleId);
      expect(set.length).toBeGreaterThanOrEqual(4);
      expect(set.every((question) => question.moduleId === moduleId)).toBe(true);
    }
  });
});

describe("shuffle", () => {
  it("keeps exactly the same items and does not mutate the input", () => {
    const input = [1, 2, 3, 4, 5, 6, 7, 8];
    const result = shuffle(input);
    expect(result).toHaveLength(input.length);
    expect([...result].sort((a, b) => a - b)).toEqual(input);
    expect(input).toEqual([1, 2, 3, 4, 5, 6, 7, 8]); // unchanged
  });
});

describe("computePoints", () => {
  it("scores nothing for a wrong answer", () => {
    expect(computePoints(false, 5, 100)).toBe(0);
  });

  it("gives the base plus a full speed bonus for an instant correct answer", () => {
    // instant answer (0 ms), first in streak → base + 50 speed + 0 streak
    expect(computePoints(true, 1, 0)).toBe(POINTS_CORRECT + 50);
  });

  it("gives only the base when slow and with no streak", () => {
    // beyond the speed window, first correct → just the base
    expect(computePoints(true, 1, 20000)).toBe(POINTS_CORRECT);
  });

  it("adds a streak bonus that is capped", () => {
    // slow answer removes speed bonus; streak of 6 → capped 50 streak bonus
    expect(computePoints(true, 100, 20000)).toBe(POINTS_CORRECT + 50);
  });
});

describe("recordResult", () => {
  it("keeps the best score and correct count and counts plays", () => {
    let stats: QuizStats = {};
    stats = recordResult(stats, {
      moduleId: "pressure-solids",
      mode: "practice",
      score: 300,
      correct: 5,
      total: 8
    });
    stats = recordResult(stats, {
      moduleId: "pressure-solids",
      mode: "practice",
      score: 200, // lower score
      correct: 7, // higher correct
      total: 8
    });

    const stat = getStat(stats, "pressure-solids", "practice");
    expect(stat.bestScore).toBe(300);
    expect(stat.bestCorrect).toBe(7);
    expect(stat.plays).toBe(2);
  });

  it("keeps modes and modules separate", () => {
    let stats: QuizStats = {};
    stats = recordResult(stats, {
      moduleId: "micro-organisms",
      mode: "time-attack",
      score: 900,
      correct: 8,
      total: 8
    });
    expect(getStat(stats, "micro-organisms", "practice").plays).toBe(0);
    expect(getStat(stats, "micro-organisms", "time-attack").bestScore).toBe(900);
  });
});
