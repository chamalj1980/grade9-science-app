import {
  moverMatches,
  moverLevels,
  plantScenarios,
  type MoverMatch,
  type PlantMoveType,
  type PlantScenario
} from "../data/movementData";

// ---- Exercise 1: match an animal to its appendage ----
export const totalMovers = moverMatches.length;

export function getMover(id: string): MoverMatch | undefined {
  return moverMatches.find((mover) => mover.id === id);
}

export function moversForLevel(level: MoverMatch["level"]): MoverMatch[] {
  const ids = moverLevels.find((entry) => entry.id === level)?.matchIds ?? [];
  return ids
    .map((id) => getMover(id))
    .filter((mover): mover is MoverMatch => Boolean(mover));
}

// A chip (animal) is placed on a slot labelled with an appendage. Correct when the
// animal's own appendage matches that slot. Within a level, every appendage is unique.
export function isCorrectMatch(animalId: string, appendage: string): boolean {
  return getMover(animalId)?.appendage === appendage;
}

// ---- Exercise 2: tropic vs nastic ----
export const totalScenarios = plantScenarios.length;

export function getScenario(id: string): PlantScenario | undefined {
  return plantScenarios.find((scenario) => scenario.id === id);
}

export function isCorrectType(id: string, type: PlantMoveType): boolean {
  return getScenario(id)?.type === type;
}

export function scenariosForType(type: PlantMoveType): PlantScenario[] {
  return plantScenarios.filter((scenario) => scenario.type === type);
}
