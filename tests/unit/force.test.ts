import { describe, expect, it } from "vitest";
import { forceScenarios } from "../../src/data/forceData";
import {
  allDirections,
  arrowEnd,
  directionAngles,
  forceHints,
  forceLevels,
  isCorrectEffect,
  isForceCorrect,
  scenariosForEffect,
  totalForceTargets,
  totalScenarios,
  type ForceTarget
} from "../../src/utils/force";

describe("arrow geometry", () => {
  it("maps directions to the maths angles", () => {
    expect(directionAngles.right).toBe(0);
    expect(directionAngles.up).toBe(90);
    expect(directionAngles.left).toBe(180);
    expect(directionAngles.down).toBe(270);
  });

  it("points a rightward arrow along +x with length proportional to magnitude", () => {
    const end = arrowEnd(100, 100, 5, "right", 4);
    expect(end.x).toBeCloseTo(120); // 100 + 5*4
    expect(end.y).toBeCloseTo(100);
  });

  it("points an upward arrow along -y (up on screen)", () => {
    const end = arrowEnd(100, 100, 5, "up", 4);
    expect(end.x).toBeCloseTo(100);
    expect(end.y).toBeCloseTo(80); // 100 - 5*4
  });

  it("doubles the arrow length when the magnitude doubles", () => {
    const short = arrowEnd(0, 0, 5, "right", 3);
    const long = arrowEnd(0, 0, 10, "right", 3);
    expect(long.x).toBeCloseTo(short.x * 2);
  });

  it("keeps a diagonal arrow the right length", () => {
    const end = arrowEnd(0, 0, 10, "up-right", 3);
    const length = Math.hypot(end.x, end.y);
    expect(length).toBeCloseTo(30); // 10 N * 3 px/N
  });
});

describe("draw the force", () => {
  const target: ForceTarget = { magnitude: 8, direction: "up", point: "centre" };

  it("accepts only a matching magnitude and direction", () => {
    expect(isForceCorrect(target, 8, "up")).toBe(true);
    expect(isForceCorrect(target, 6, "up")).toBe(false);
    expect(isForceCorrect(target, 8, "down")).toBe(false);
  });

  it("gives no hints once correct, and targeted hints otherwise", () => {
    expect(forceHints(target, 8, "up")).toEqual([]);
    expect(forceHints(target, 4, "up").join(" ")).toMatch(/longer/i);
    expect(forceHints(target, 12, "up").join(" ")).toMatch(/shorter/i);
    expect(forceHints(target, 8, "left").join(" ")).toMatch(/up/i);
  });

  it("counts every target and uses only known directions", () => {
    const levelTotal = forceLevels.reduce(
      (sum, level) => sum + level.targets.length,
      0
    );
    expect(totalForceTargets).toBe(levelTotal);
    expect(levelTotal).toBeGreaterThanOrEqual(9);

    for (const level of forceLevels) {
      for (const targetItem of level.targets) {
        expect(allDirections).toContain(targetItem.direction);
        expect(targetItem.magnitude).toBeGreaterThan(0);
      }
    }
  });
});

describe("effect classification", () => {
  it("counts every scenario", () => {
    expect(totalScenarios).toBe(forceScenarios.length);
  });

  it("accepts a scenario only for its own effect", () => {
    expect(isCorrectEffect("catch-ball", "stop")).toBe(true);
    expect(isCorrectEffect("catch-ball", "move")).toBe(false);
    expect(isCorrectEffect("squash-ball", "shape")).toBe(true);
    expect(isCorrectEffect("bat-hit", "direction")).toBe(true);
  });

  it("has scenarios for all five effects, each with unique ids", () => {
    for (const effect of ["move", "stop", "speed", "direction", "shape"] as const) {
      expect(scenariosForEffect(effect).length).toBeGreaterThanOrEqual(2);
    }
    const ids = forceScenarios.map((scenario) => scenario.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
