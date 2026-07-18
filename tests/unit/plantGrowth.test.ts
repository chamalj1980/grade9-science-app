import { describe, expect, it } from "vitest";
import {
  auxinSideFor,
  challengeSolved,
  computeOutcome,
  isCorrectHormone,
  labChallenges,
  scenariosForHormone,
  totalHormoneScenarios
} from "../../src/utils/plantGrowth";

describe("phototropism model", () => {
  it("collects auxin on the side away from the light", () => {
    expect(auxinSideFor("left")).toBe("right");
    expect(auxinSideFor("right")).toBe("left");
    expect(auxinSideFor("top")).toBe("even");
  });

  it("bends the shoot toward one-directional light when the apex is present", () => {
    expect(computeOutcome({ light: "left", apexPresent: true }).bend).toBe("left");
    expect(computeOutcome({ light: "right", apexPresent: true }).bend).toBe("right");
  });

  it("grows straight up under overhead light", () => {
    const outcome = computeOutcome({ light: "top", apexPresent: true });
    expect(outcome.bend).toBe("up");
    expect(outcome.auxinSide).toBe("even");
    expect(outcome.bushy).toBe(false);
  });

  it("stops bending and turns bushy once the apex is removed", () => {
    const outcome = computeOutcome({ light: "left", apexPresent: false });
    expect(outcome.bend).toBe("none");
    expect(outcome.bushy).toBe(true);
  });
});

describe("phototropism lab challenges", () => {
  it("solves the bend-toward-light level only with the right controls", () => {
    const level = labChallenges.find((c) => c.id === "bend-left")!;
    expect(challengeSolved(level, computeOutcome({ light: "left", apexPresent: true }))).toBe(true);
    expect(challengeSolved(level, computeOutcome({ light: "right", apexPresent: true }))).toBe(false);
    expect(challengeSolved(level, computeOutcome({ light: "left", apexPresent: false }))).toBe(false);
  });

  it("solves the bushy level only when the apex is removed", () => {
    const level = labChallenges.find((c) => c.id === "bushy")!;
    expect(challengeSolved(level, computeOutcome({ light: "top", apexPresent: false }))).toBe(true);
    expect(challengeSolved(level, computeOutcome({ light: "top", apexPresent: true }))).toBe(false);
  });

  it("requires a straight-up, non-bushy shoot for the tall level", () => {
    const level = labChallenges.find((c) => c.id === "straight-up")!;
    expect(challengeSolved(level, computeOutcome({ light: "top", apexPresent: true }))).toBe(true);
    expect(challengeSolved(level, computeOutcome({ light: "left", apexPresent: true }))).toBe(false);
  });
});

describe("hormone classification", () => {
  it("matches each effect to the hormone that causes it", () => {
    expect(isCorrectHormone("bend-light", "auxin")).toBe(true);
    expect(isCorrectHormone("bend-light", "gibberellin")).toBe(false);
    expect(isCorrectHormone("big-fruit", "gibberellin")).toBe(true);
    expect(isCorrectHormone("cell-div", "cytokinin")).toBe(true);
    expect(isCorrectHormone("close-stomata", "abscisic")).toBe(true);
    expect(isCorrectHormone("ripen-fruit", "ethene")).toBe(true);
  });

  it("groups every scenario under exactly one hormone", () => {
    const grouped =
      scenariosForHormone("auxin").length +
      scenariosForHormone("gibberellin").length +
      scenariosForHormone("cytokinin").length +
      scenariosForHormone("abscisic").length +
      scenariosForHormone("ethene").length;
    expect(grouped).toBe(totalHormoneScenarios);
  });
});
