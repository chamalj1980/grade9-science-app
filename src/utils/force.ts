import {
  forceScenarios,
  type EffectId,
  type ForceScenario
} from "../data/forceData";

// ---- Direction ↔ angle ----
// Eight compass directions, measured anticlockwise from "right" (east), the way maths
// angles run. The graphics use screen coordinates (y grows downwards), so the arrow
// geometry flips the y component.
export type Direction =
  | "right"
  | "up-right"
  | "up"
  | "up-left"
  | "left"
  | "down-left"
  | "down"
  | "down-right";

export const directionAngles: Record<Direction, number> = {
  right: 0,
  "up-right": 45,
  up: 90,
  "up-left": 135,
  left: 180,
  "down-left": 225,
  down: 270,
  "down-right": 315
};

export const directionLabels: Record<Direction, string> = {
  right: "→ Right",
  "up-right": "↗ Up-right",
  up: "↑ Up",
  "up-left": "↖ Up-left",
  left: "← Left",
  "down-left": "↙ Down-left",
  down: "↓ Down",
  "down-right": "↘ Down-right"
};

// The four main directions (used in the early Draw-the-Force levels) then the diagonals.
export const mainDirections: Direction[] = ["right", "up", "left", "down"];
export const allDirections: Direction[] = [
  "right",
  "up-right",
  "up",
  "up-left",
  "left",
  "down-left",
  "down",
  "down-right"
];

// End point of a force arrow starting at (ox, oy), for the given magnitude and direction.
// `scale` is pixels per newton. y is negated so "up" points up on screen.
export function arrowEnd(
  ox: number,
  oy: number,
  magnitude: number,
  direction: Direction,
  scale: number
): { x: number; y: number } {
  const radians = (directionAngles[direction] * Math.PI) / 180;
  return {
    x: ox + Math.cos(radians) * magnitude * scale,
    y: oy - Math.sin(radians) * magnitude * scale
  };
}

// ---- Draw the Force (Exercise 1) ----
export interface ForceTarget {
  magnitude: number; // newtons
  direction: Direction;
  point: string; // point-of-application label, e.g. "centre"
}

export interface ForceLevel {
  id: string;
  title: string;
  blurb: string;
  targets: ForceTarget[];
}

export const forceLevels: ForceLevel[] = [
  {
    id: "level-1",
    title: "Level 1 · The four main directions",
    blurb: "Set the length for the magnitude and point the arrow the right way.",
    targets: [
      { magnitude: 5, direction: "right", point: "centre" },
      { magnitude: 8, direction: "up", point: "centre" },
      { magnitude: 3, direction: "left", point: "centre" }
    ]
  },
  {
    id: "level-2",
    title: "Level 2 · Add the diagonals",
    blurb: "Now the arrow can point on a slant too.",
    targets: [
      { magnitude: 6, direction: "up-right", point: "centre" },
      { magnitude: 10, direction: "down", point: "centre" },
      { magnitude: 4, direction: "down-left", point: "centre" }
    ]
  },
  {
    id: "level-3",
    title: "Level 3 · Bigger forces",
    blurb: "Same idea, larger magnitudes.",
    targets: [
      { magnitude: 12, direction: "left", point: "centre" },
      { magnitude: 9, direction: "up-left", point: "centre" },
      { magnitude: 14, direction: "down-right", point: "centre" }
    ]
  }
];

export const totalForceTargets = forceLevels.reduce(
  (sum, level) => sum + level.targets.length,
  0
);

export function targetsForLevel(levelId: string): ForceTarget[] {
  return forceLevels.find((level) => level.id === levelId)?.targets ?? [];
}

export function isForceCorrect(
  target: ForceTarget,
  magnitude: number,
  direction: Direction
): boolean {
  return magnitude === target.magnitude && direction === target.direction;
}

export function forceHints(
  target: ForceTarget,
  magnitude: number,
  direction: Direction
): string[] {
  const hints: string[] = [];
  if (magnitude !== target.magnitude) {
    hints.push(
      magnitude < target.magnitude
        ? `Make the arrow longer — the force should be ${target.magnitude} N.`
        : `Make the arrow shorter — the force should be ${target.magnitude} N.`
    );
  }
  if (direction !== target.direction) {
    hints.push(
      `Point the arrow ${directionLabels[target.direction].replace(/^[^ ]+ /, "").toLowerCase()}.`
    );
  }
  return hints;
}

// ---- Effect classification (Exercise 2) ----
export const totalScenarios = forceScenarios.length;

export function getScenario(id: string): ForceScenario | undefined {
  return forceScenarios.find((scenario) => scenario.id === id);
}

export function isCorrectEffect(id: string, effect: EffectId): boolean {
  return getScenario(id)?.effect === effect;
}

export function scenariosForEffect(effect: EffectId): ForceScenario[] {
  return forceScenarios.filter((scenario) => scenario.effect === effect);
}
