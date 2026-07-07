import { describe, expect, it } from "vitest";
import {
  buildDrillProblem,
  cuboidParts,
  generateDrillProblem,
  isDrillAnswerCorrect,
  type DrillVariable
} from "../../src/utils/pressureCalcDrill";

describe("pressure calculation drill", () => {
  it("builds a solve-for-pressure problem matching P = F / A", () => {
    const problem = buildDrillProblem("pressure", 300, 2);

    expect(problem.answer).toBe(150);
    expect(problem.unit).toBe("Pa");
    expect(problem.formula).toBe("P = F / A");
  });

  it("builds solve-for-force and solve-for-area problems correctly", () => {
    expect(buildDrillProblem("force", 400, 2).answer).toBe(400);
    expect(buildDrillProblem("area", 400, 2).answer).toBe(2);
  });

  it("generates internally consistent problems for every RNG value", () => {
    // Sweep the RNG so each branch (variable, pressure, area) is exercised.
    for (let i = 0; i < 60; i += 1) {
      const value = i / 60;
      const problem = generateDrillProblem(() => value);

      expect(problem.forceN).toBe(problem.pressurePa * problem.areaM2);
      expect(Number.isInteger(problem.answer)).toBe(true);

      const expected: Record<DrillVariable, number> = {
        pressure: problem.pressurePa,
        force: problem.forceN,
        area: problem.areaM2
      };
      expect(problem.answer).toBe(expected[problem.solveFor]);
    }
  });

  it("accepts answers within tolerance and rejects wrong ones", () => {
    const problem = buildDrillProblem("pressure", 300, 2);

    expect(isDrillAnswerCorrect(problem, 150)).toBe(true);
    expect(isDrillAnswerCorrect(problem, 150.005)).toBe(true);
    expect(isDrillAnswerCorrect(problem, 151)).toBe(false);
    expect(isDrillAnswerCorrect(problem, Number.NaN)).toBe(false);
  });

  it("locks the fixed cuboid answers to 200, 275, and 400 Pa", () => {
    expect(cuboidParts.map((part) => part.pressurePa)).toEqual([200, 275, 400]);
  });
});
