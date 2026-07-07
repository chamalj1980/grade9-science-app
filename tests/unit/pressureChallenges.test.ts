import { describe, expect, it } from "vitest";
import {
  createHalvePressureBaseline,
  createPressureReading,
  getPressureLevel,
  validatePressureChallenge
} from "../../src/utils/pressureChallenges";

describe("pressure challenge validation", () => {
  it("accepts multiple valid combinations for the 150 Pa target", () => {
    expect(
      validatePressureChallenge("target-150", createPressureReading(300, 2))
        .isCorrect
    ).toBe(true);
    expect(
      validatePressureChallenge("target-150", createPressureReading(450, 3))
        .isCorrect
    ).toBe(true);
    expect(
      validatePressureChallenge("target-150", createPressureReading(750, 5))
        .isCorrect
    ).toBe(true);
  });

  it("rejects readings outside the 150 Pa tolerance", () => {
    expect(
      validatePressureChallenge("target-150", createPressureReading(320, 2))
        .isCorrect
    ).toBe(false);
  });

  it("requires the same force and half the pressure for challenge 2", () => {
    const baseline = createHalvePressureBaseline(300, 1);

    expect(
      validatePressureChallenge(
        "halve-pressure",
        createPressureReading(300, 2),
        baseline
      ).isCorrect
    ).toBe(true);
    expect(
      validatePressureChallenge(
        "halve-pressure",
        createPressureReading(310, 2),
        baseline
      ).isCorrect
    ).toBe(false);
    expect(
      validatePressureChallenge(
        "halve-pressure",
        createPressureReading(300, 1.5),
        baseline
      ).isCorrect
    ).toBe(false);
  });

  it("accepts only pressures of at least 500 Pa for challenge 3", () => {
    expect(
      validatePressureChallenge("reach-500", createPressureReading(500, 1))
        .isCorrect
    ).toBe(true);
    expect(
      validatePressureChallenge("reach-500", createPressureReading(1000, 2))
        .isCorrect
    ).toBe(true);
    expect(
      validatePressureChallenge("reach-500", createPressureReading(400, 1))
        .isCorrect
    ).toBe(false);
  });

  it("labels gauge ranges as low, medium, and high", () => {
    expect(getPressureLevel(120)).toBe("low");
    expect(getPressureLevel(150)).toBe("medium");
    expect(getPressureLevel(499)).toBe("medium");
    expect(getPressureLevel(500)).toBe("high");
  });
});
