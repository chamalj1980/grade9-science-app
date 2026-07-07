import { calculateArea, calculateForce, calculatePressure } from "./pressure";

// Which quantity a drill problem asks the student to find.
export type DrillVariable = "pressure" | "force" | "area";

export interface DrillProblem {
  solveFor: DrillVariable;
  forceN: number;
  areaM2: number;
  pressurePa: number;
  prompt: string;
  answer: number;
  unit: string;
  formula: string;
  steps: string[];
}

const squareMetre = "m²";

// Base ingredients chosen so every generated problem has clean whole-number values,
// no matter which variable is hidden (force = pressure * area keeps all three integers).
const pressureChoices = [50, 100, 150, 200, 250, 300];
const areaChoices = [1, 2, 3, 4, 5];

function pickFrom<T>(values: T[], random: () => number): T {
  return values[Math.floor(random() * values.length)];
}

// Build a fully worked problem from a chosen force + area and the variable to hide.
// Exported so tests can assert internal consistency (the answer always matches P = F / A).
export function buildDrillProblem(
  solveFor: DrillVariable,
  forceN: number,
  areaM2: number
): DrillProblem {
  const pressurePa = calculatePressure(forceN, areaM2);

  if (solveFor === "pressure") {
    return {
      solveFor,
      forceN,
      areaM2,
      pressurePa,
      prompt: `A force of ${forceN} N acts on an area of ${areaM2} ${squareMetre}. Find the pressure.`,
      answer: pressurePa,
      unit: "Pa",
      formula: "P = F / A",
      steps: [
        "P = F / A",
        `P = ${forceN} N / ${areaM2} ${squareMetre}`,
        `P = ${pressurePa} Pa`
      ]
    };
  }

  if (solveFor === "force") {
    return {
      solveFor,
      forceN,
      areaM2,
      pressurePa,
      prompt: `A pressure of ${pressurePa} Pa acts over an area of ${areaM2} ${squareMetre}. Find the force.`,
      answer: calculateForce(pressurePa, areaM2),
      unit: "N",
      formula: "F = P × A",
      steps: [
        "F = P × A",
        `F = ${pressurePa} Pa × ${areaM2} ${squareMetre}`,
        `F = ${forceN} N`
      ]
    };
  }

  return {
    solveFor,
    forceN,
    areaM2,
    pressurePa,
    prompt: `A ${forceN} N box exerts a pressure of ${pressurePa} Pa. Find the contact area.`,
    answer: calculateArea(forceN, pressurePa),
    unit: squareMetre,
    formula: "A = F / P",
    steps: [
      "A = F / P",
      `A = ${forceN} N / ${pressurePa} Pa`,
      `A = ${areaM2} ${squareMetre}`
    ]
  };
}

const drillVariables: DrillVariable[] = ["pressure", "force", "area"];

// Auto-generate a random but always-clean problem. `random` is injectable for tests.
export function generateDrillProblem(random: () => number = Math.random): DrillProblem {
  const solveFor = pickFrom(drillVariables, random);
  const pressurePa = pickFrom(pressureChoices, random);
  const areaM2 = pickFrom(areaChoices, random);
  const forceN = pressurePa * areaM2;

  return buildDrillProblem(solveFor, forceN, areaM2);
}

// Accept answers within a small tolerance so slider/rounding wobble never fails a
// student who has the right idea.
export function isDrillAnswerCorrect(
  problem: DrillProblem,
  input: number
): boolean {
  if (!Number.isFinite(input)) {
    return false;
  }

  return Math.abs(input - problem.answer) <= 0.01;
}

export interface CuboidPart {
  id: string;
  question: string;
  areaM2: number;
  forceN: number;
  pressurePa: number;
  steps: string[];
}

// The fixed textbook cuboid problem (spec 17.2): 2 m x 1 m x 1 m, weight 400 N.
// Values are computed so the numbers can never drift from the formula: 200, 275, 400 Pa.
export const cuboidWeightN = 400;

export const cuboidParts: CuboidPart[] = [
  {
    id: "large-face",
    question: "Resting on the 2 m × 1 m face.",
    areaM2: 2 * 1,
    forceN: cuboidWeightN,
    pressurePa: calculatePressure(cuboidWeightN, 2 * 1),
    steps: [
      "Area = 2 m × 1 m = 2 " + squareMetre,
      `P = ${cuboidWeightN} N / 2 ${squareMetre}`,
      `P = ${calculatePressure(cuboidWeightN, 2)} Pa`
    ]
  },
  {
    id: "large-face-extra",
    question: "Same face, with an extra 150 N added on top.",
    areaM2: 2 * 1,
    forceN: cuboidWeightN + 150,
    pressurePa: calculatePressure(cuboidWeightN + 150, 2 * 1),
    steps: [
      `Total force = ${cuboidWeightN} N + 150 N = ${cuboidWeightN + 150} N`,
      "Area = 2 " + squareMetre,
      `P = ${cuboidWeightN + 150} N / 2 ${squareMetre}`,
      `P = ${calculatePressure(cuboidWeightN + 150, 2)} Pa`
    ]
  },
  {
    id: "small-face",
    question: "Standing on the 1 m × 1 m face.",
    areaM2: 1 * 1,
    forceN: cuboidWeightN,
    pressurePa: calculatePressure(cuboidWeightN, 1 * 1),
    steps: [
      "Area = 1 m × 1 m = 1 " + squareMetre,
      `P = ${cuboidWeightN} N / 1 ${squareMetre}`,
      `P = ${calculatePressure(cuboidWeightN, 1)} Pa`
    ]
  }
];
