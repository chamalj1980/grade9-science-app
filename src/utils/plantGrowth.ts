import {
  hormoneScenarios,
  type HormoneId,
  type HormoneScenario
} from "../data/plantGrowthData";

// ---- Phototropism model (Exercise 1: Phototropism Lab) ----
// A one-directional light source and a plant that may or may not still have its apex.
// Auxin, made in the apex, collects on the SHADED side (away from the light). Those
// cells elongate more, so the shoot tip curves TOWARD the light. Remove the apex and
// there is no auxin: the shoot no longer bends and lateral buds are free to grow, so
// the plant becomes short and bushy.

export type LightDir = "left" | "right" | "top";
export type Bend = "left" | "right" | "up" | "none";
export type AuxinSide = "left" | "right" | "even";

export interface PlantState {
  light: LightDir;
  apexPresent: boolean;
}

export interface PlantOutcome {
  bend: Bend; // which way the shoot tip curves
  bushy: boolean; // lateral buds growing (apex removed)
  auxinSide: AuxinSide; // where auxin has collected
}

// The shaded side is opposite the light; auxin collects there. Overhead light shades
// neither side, so auxin stays even and the shoot grows straight up.
export function auxinSideFor(light: LightDir): AuxinSide {
  if (light === "left") return "right";
  if (light === "right") return "left";
  return "even";
}

export function computeOutcome(state: PlantState): PlantOutcome {
  // No apex → no auxin from the tip: the shoot cannot bend, and lateral buds grow.
  if (!state.apexPresent) {
    return { bend: "none", bushy: true, auxinSide: "even" };
  }

  const auxinSide = auxinSideFor(state.light);
  // The tip curves toward the light: the opposite side (where auxin sits) grows longer.
  const bend: Bend =
    state.light === "top" ? "up" : state.light === "left" ? "left" : "right";
  return { bend, bushy: false, auxinSide };
}

export interface LabChallenge {
  id: string;
  title: string;
  goal: string;
  // Every specified field must match the computed outcome for the challenge to pass.
  target: { bend?: Bend; bushy?: boolean };
  hint: string;
}

export const labChallenges: LabChallenge[] = [
  {
    id: "bend-left",
    title: "Level 1 · Reach for the window",
    goal: "A plant sits on a windowsill with light coming only from the LEFT. Make its shoot bend toward the light.",
    target: { bend: "left" },
    hint: "Keep the apex on and shine the light from the left — auxin collects on the right, so the tip curves left."
  },
  {
    id: "bend-right",
    title: "Level 2 · Chase the light",
    goal: "Now the light comes from the RIGHT. Make the shoot show positive phototropism toward it.",
    target: { bend: "right" },
    hint: "Apex on, light from the right: auxin gathers on the left and the tip curves right."
  },
  {
    id: "straight-up",
    title: "Level 3 · Straight and tall",
    goal: "Light is directly OVERHEAD. Make the shoot grow straight upwards.",
    target: { bend: "up", bushy: false },
    hint: "Apex on, light from the top: auxin stays even, so the shoot grows straight up."
  },
  {
    id: "bushy",
    title: "Level 4 · A bushy plant",
    goal: "A gardener wants a short, bushy plant with many side shoots. Change the plant so its lateral buds grow.",
    target: { bushy: true },
    hint: "Cut off the apex. With no auxin from the tip, the lateral buds are free to grow."
  }
];

export const totalChallenges = labChallenges.length;

export function challengeSolved(
  challenge: LabChallenge,
  outcome: PlantOutcome
): boolean {
  const { bend, bushy } = challenge.target;
  if (bend !== undefined && outcome.bend !== bend) return false;
  if (bushy !== undefined && outcome.bushy !== bushy) return false;
  return true;
}

// ---- Hormone classification (Exercise 2) ----
export const totalHormoneScenarios = hormoneScenarios.length;

export function getScenario(id: string): HormoneScenario | undefined {
  return hormoneScenarios.find((scenario) => scenario.id === id);
}

export function isCorrectHormone(id: string, hormone: HormoneId): boolean {
  return getScenario(id)?.hormone === hormone;
}

export function scenariosForHormone(hormone: HormoneId): HormoneScenario[] {
  return hormoneScenarios.filter((scenario) => scenario.hormone === hormone);
}
