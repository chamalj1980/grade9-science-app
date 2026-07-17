import { describe, expect, it } from "vitest";
import { elements } from "../../src/data/matterElements";
import { substanceCards } from "../../src/data/matterSubstances";
import {
  atomHints,
  atomLevels,
  electronShells,
  elementBySymbol,
  elementForProtons,
  isAtomCorrect,
  isCorrectClass,
  isNeutral,
  massNumber,
  substancesForClass,
  totalAtomTargets,
  totalSubstances
} from "../../src/utils/matter";

describe("atom maths", () => {
  it("adds protons and neutrons for the mass number", () => {
    // Textbook table 3.8: Na has 11 protons + 12 neutrons = 23.
    expect(massNumber(11, 12)).toBe(23);
    expect(massNumber(17, 18)).toBe(35); // Cl
    expect(massNumber(8, 8)).toBe(16); // O
  });

  it("matches every textbook mass number in table 3.8", () => {
    const expected: [string, number][] = [
      ["N", 14],
      ["O", 16],
      ["F", 19],
      ["Na", 23],
      ["Cl", 35]
    ];
    for (const [symbol, mass] of expected) {
      const element = elementBySymbol(symbol)!;
      expect(massNumber(element.z, element.neutrons)).toBe(mass);
    }
  });

  it("matches the textbook exercise figures (Ca, Fe, S, Br)", () => {
    const expected: [string, number, number, number][] = [
      // symbol, protons, neutrons, mass number
      ["Ca", 20, 20, 40],
      ["Fe", 26, 30, 56],
      ["S", 16, 16, 32],
      ["Br", 35, 45, 80]
    ];
    for (const [symbol, protons, neutrons, mass] of expected) {
      const element = elementBySymbol(symbol)!;
      expect(element.z).toBe(protons);
      expect(element.neutrons).toBe(neutrons);
      expect(massNumber(element.z, element.neutrons)).toBe(mass);
    }
  });

  it("treats an atom as neutral only when protons equal electrons", () => {
    expect(isNeutral(11, 11)).toBe(true);
    expect(isNeutral(11, 10)).toBe(false);
  });

  it("identifies the element from the proton count alone", () => {
    expect(elementForProtons(6)?.name).toBe("Carbon");
    expect(elementForProtons(11)?.symbol).toBe("Na");
    expect(elementForProtons(999)).toBeUndefined();
  });
});

describe("electron shells", () => {
  it("fills 2, then 8, then 8", () => {
    expect(electronShells(1)).toEqual([1]);
    expect(electronShells(2)).toEqual([2]);
    expect(electronShells(6)).toEqual([2, 4]); // carbon
    expect(electronShells(11)).toEqual([2, 8, 1]); // sodium
    expect(electronShells(20)).toEqual([2, 8, 8, 2]); // calcium
  });

  it("never loses electrons and handles zero", () => {
    expect(electronShells(0)).toEqual([]);
    for (const count of [3, 9, 17, 26]) {
      const shells = electronShells(count);
      expect(shells.reduce((sum, n) => sum + n, 0)).toBe(count);
    }
  });
});

describe("build the atom", () => {
  const sodium = { symbol: "Na", name: "Sodium", protons: 11, neutrons: 12 };

  it("accepts only a correctly built neutral atom", () => {
    expect(isAtomCorrect(sodium, 11, 12, 11)).toBe(true);
    expect(isAtomCorrect(sodium, 10, 12, 11)).toBe(false); // wrong protons
    expect(isAtomCorrect(sodium, 11, 11, 11)).toBe(false); // wrong neutrons
    expect(isAtomCorrect(sodium, 11, 12, 10)).toBe(false); // not neutral
  });

  it("gives no hints once the atom is right", () => {
    expect(atomHints(sodium, 11, 12, 11)).toEqual([]);
  });

  it("points at the specific particle that is wrong", () => {
    expect(atomHints(sodium, 9, 12, 9).join(" ")).toMatch(/protons/i);
    expect(atomHints(sodium, 11, 5, 11).join(" ")).toMatch(/neutrons/i);
    expect(atomHints(sodium, 11, 12, 8).join(" ")).toMatch(/neutral|electrons/i);
  });

  it("counts every target across the levels and resolves each element", () => {
    const levelTotal = atomLevels.reduce(
      (sum, level) => sum + level.targets.length,
      0
    );
    expect(totalAtomTargets).toBe(levelTotal);
    expect(levelTotal).toBeGreaterThanOrEqual(9);

    for (const level of atomLevels) {
      for (const target of level.targets) {
        expect(elementBySymbol(target.symbol)?.z).toBe(target.protons);
      }
    }
  });
});

describe("matter classification", () => {
  it("counts every sort card", () => {
    expect(totalSubstances).toBe(substanceCards.length);
  });

  it("accepts a substance only in its own bin", () => {
    expect(isCorrectClass("air", "mixture")).toBe(true);
    expect(isCorrectClass("air", "compound")).toBe(false);
    // Distilled water is a compound, not a mixture — a classic trap.
    expect(isCorrectClass("distilled-water", "compound")).toBe(true);
    expect(isCorrectClass("distilled-water", "mixture")).toBe(false);
    // Chlorine is an element even though it travels as Cl2 molecules.
    expect(isCorrectClass("chlorine", "element")).toBe(true);
  });

  it("has cards in all three bins with unique ids", () => {
    for (const choice of ["element", "compound", "mixture"] as const) {
      expect(substancesForClass(choice).length).toBeGreaterThanOrEqual(4);
    }
    const ids = substanceCards.map((card) => card.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe("element data", () => {
  it("has unique symbols and ascending atomic numbers", () => {
    const symbols = elements.map((element) => element.symbol);
    expect(new Set(symbols).size).toBe(symbols.length);

    for (let i = 1; i < elements.length; i++) {
      expect(elements[i].z).toBeGreaterThan(elements[i - 1].z);
    }
  });

  it("gives a Latin name to exactly the latin-origin symbols", () => {
    for (const element of elements) {
      if (element.origin === "latin") {
        expect(element.latin, `${element.name} needs a Latin name`).toBeTruthy();
      } else {
        expect(element.latin).toBeUndefined();
      }
    }
    // Spot-check the textbook's table 3.3.
    expect(elementBySymbol("Na")?.latin).toBe("Natrium");
    expect(elementBySymbol("Au")?.latin).toBe("Aurum");
    expect(elementBySymbol("Pb")?.latin).toBe("Plumbum");
    expect(elementBySymbol("Hg")?.latin).toBe("Hydrargyrum");
  });
});
