import { elements, type ElementInfo } from "../data/matterElements";
import {
  substanceCards,
  type MatterClass,
  type SubstanceCard
} from "../data/matterSubstances";

// ---- Atom maths (textbook 3.1.3) ----

// Mass number A = protons + neutrons.
export function massNumber(protons: number, neutrons: number): number {
  return protons + neutrons;
}

// An atom is electrically neutral when protons equal electrons.
export function isNeutral(protons: number, electrons: number): boolean {
  return protons === electrons;
}

// The element a nucleus belongs to is decided by its proton count alone (the atomic
// number is a unique property of the element).
export function elementForProtons(protons: number): ElementInfo | undefined {
  return elements.find((element) => element.z === protons);
}

export function elementBySymbol(symbol: string): ElementInfo | undefined {
  return elements.find((element) => element.symbol === symbol);
}

// Bohr-style shell filling (2, 8, 8, 2) used only to lay electrons out on rings for the
// atom diagram — the chapter itself does not teach shell rules.
export const shellCapacities = [2, 8, 8, 2];

export function electronShells(electrons: number): number[] {
  const shells: number[] = [];
  let left = Math.max(0, electrons);
  for (const capacity of shellCapacities) {
    if (left <= 0) {
      break;
    }
    const inShell = Math.min(capacity, left);
    shells.push(inShell);
    left -= inShell;
  }
  // Anything beyond the modelled shells rides on one extra ring.
  if (left > 0) {
    shells.push(left);
  }
  return shells;
}

// ---- Build the Atom (Exercise 1) ----

export interface AtomTarget {
  symbol: string;
  name: string;
  protons: number;
  neutrons: number;
}

export interface AtomLevel {
  id: string;
  title: string;
  blurb: string;
  targets: AtomTarget[];
}

function target(symbol: string): AtomTarget {
  const element = elementBySymbol(symbol);
  if (!element) {
    throw new Error(`Unknown element symbol: ${symbol}`);
  }
  return {
    symbol: element.symbol,
    name: element.name,
    protons: element.z,
    neutrons: element.neutrons
  };
}

// Kept to the small atoms the textbook works with, ramping up as levels progress.
export const atomLevels: AtomLevel[] = [
  {
    id: "level-1",
    title: "Level 1 · Equal protons and neutrons",
    blurb: "These atoms have the same number of protons and neutrons.",
    targets: [target("C"), target("N"), target("O")]
  },
  {
    id: "level-2",
    title: "Level 2 · More neutrons than protons",
    blurb: "Now the neutron count no longer matches the protons.",
    targets: [target("F"), target("Na"), target("Cl")]
  },
  {
    id: "level-3",
    title: "Level 3 · Bigger atoms",
    blurb: "Same rules, larger nuclei.",
    targets: [target("Mg"), target("S"), target("Ca")]
  }
];

export const totalAtomTargets = atomLevels.reduce(
  (sum, level) => sum + level.targets.length,
  0
);

export function targetsForLevel(levelId: string): AtomTarget[] {
  return atomLevels.find((level) => level.id === levelId)?.targets ?? [];
}

// A build is correct when protons, neutrons and electrons all match a neutral atom of
// the target element.
export function isAtomCorrect(
  target: AtomTarget,
  protons: number,
  neutrons: number,
  electrons: number
): boolean {
  return (
    protons === target.protons &&
    neutrons === target.neutrons &&
    electrons === target.protons
  );
}

// Per-particle feedback so the exercise can say exactly what is wrong.
export function atomHints(
  target: AtomTarget,
  protons: number,
  neutrons: number,
  electrons: number
): string[] {
  const hints: string[] = [];
  if (protons !== target.protons) {
    hints.push(
      protons < target.protons
        ? `Add more protons — the atomic number of ${target.name} is ${target.protons}.`
        : `Too many protons — ${target.name} has an atomic number of ${target.protons}.`
    );
  }
  if (neutrons !== target.neutrons) {
    hints.push(
      neutrons < target.neutrons
        ? `Add more neutrons to reach a mass number of ${massNumber(target.protons, target.neutrons)}.`
        : `Too many neutrons — the mass number should be ${massNumber(target.protons, target.neutrons)}.`
    );
  }
  if (protons === target.protons && electrons !== protons) {
    hints.push(
      "An atom is electrically neutral, so the electrons must equal the protons."
    );
  }
  return hints;
}

// ---- Classification (Exercise 2) ----

export const totalSubstances = substanceCards.length;

export function getSubstance(id: string): SubstanceCard | undefined {
  return substanceCards.find((card) => card.id === id);
}

export function isCorrectClass(id: string, choice: MatterClass): boolean {
  return getSubstance(id)?.answer === choice;
}

export function substancesForClass(choice: MatterClass): SubstanceCard[] {
  return substanceCards.filter((card) => card.answer === choice);
}
