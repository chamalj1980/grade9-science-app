import { describe, expect, it } from "vitest";
import { moverLevels, moverMatches, plantScenarios } from "../../src/data/movementData";
import {
  getMover,
  getScenario,
  isCorrectMatch,
  isCorrectType,
  moversForLevel,
  scenariosForType,
  totalMovers,
  totalScenarios
} from "../../src/utils/movement";

describe("match the mover (Exercise 1)", () => {
  it("counts every mover across the three levels", () => {
    expect(totalMovers).toBe(moverMatches.length);
    const levelTotal = moverLevels.reduce(
      (sum, level) => sum + level.matchIds.length,
      0
    );
    expect(levelTotal).toBe(totalMovers);
  });

  it("accepts an animal only on its own appendage", () => {
    expect(isCorrectMatch("m-amoeba", "Pseudopodia")).toBe(true);
    expect(isCorrectMatch("m-amoeba", "Cilia")).toBe(false);
    expect(isCorrectMatch("m-crow", "Wings")).toBe(true);
    expect(isCorrectMatch("m-dolphin", "Flippers")).toBe(true);
  });

  it("every appendage in a level is unique so a match is unambiguous", () => {
    for (const level of moverLevels) {
      const movers = moversForLevel(level.id);
      const appendages = movers.map((mover) => mover.appendage);
      expect(new Set(appendages).size).toBe(appendages.length);
      expect(movers.every((mover) => mover.level === level.id)).toBe(true);
    }
  });

  it("resolves every level id and has unique mover ids", () => {
    const ids = moverMatches.map((mover) => mover.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const level of moverLevels) {
      for (const id of level.matchIds) {
        expect(getMover(id)).toBeDefined();
      }
    }
  });
});

describe("tropic vs nastic (Exercise 2)", () => {
  it("counts every scenario", () => {
    expect(totalScenarios).toBe(plantScenarios.length);
  });

  it("classifies scenarios correctly", () => {
    // Tropic: growth linked to the stimulus direction.
    expect(isCorrectType("root-down", "tropic")).toBe(true);
    expect(isCorrectType("stem-light", "tropic")).toBe(true);
    expect(isCorrectType("root-down", "nastic")).toBe(false);
    // Nastic: fixed-direction response, e.g. Mimosa folding on touch.
    expect(isCorrectType("mimosa-touch", "nastic")).toBe(true);
    expect(isCorrectType("flower-open", "nastic")).toBe(true);
    expect(isCorrectType("mimosa-touch", "tropic")).toBe(false);
  });

  it("has scenarios in both bins with unique ids", () => {
    expect(scenariosForType("tropic").length).toBeGreaterThanOrEqual(4);
    expect(scenariosForType("nastic").length).toBeGreaterThanOrEqual(4);
    const ids = plantScenarios.map((scenario) => scenario.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const scenario of plantScenarios) {
      expect(getScenario(scenario.id)).toBeDefined();
    }
  });
});
