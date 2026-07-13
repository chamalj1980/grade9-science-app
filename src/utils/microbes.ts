// Pure helpers for the Applications of Micro-organisms module. The exercises are about
// classifying and matching, so the "logic" here is grouping and answer-checking. Keeping
// it in one place lets the components stay thin and lets the rules be unit tested.
import {
  microbeMatches,
  microbeMatchLevels,
  type MicrobeField,
  type MicrobeMatch
} from "../data/microbeMatch";
import {
  microbeSortCards,
  type MicrobeEffect,
  type MicrobeSortCard
} from "../data/microbeSortCards";

// ---- Exercise 1: match a microbe to its job ----

const matchById = new Map(microbeMatches.map((match) => [match.id, match]));

export function getMatch(id: string): MicrobeMatch | undefined {
  return matchById.get(id);
}

// A placement is correct only when the microbe is dropped on its own job.
export function isCorrectMatch(microbeId: string, jobId: string): boolean {
  return microbeId === jobId;
}

export function matchesForField(field: MicrobeField): MicrobeMatch[] {
  const level = microbeMatchLevels.find((candidate) => candidate.id === field);

  if (!level) {
    return [];
  }

  return level.matchIds
    .map((id) => matchById.get(id))
    .filter((match): match is MicrobeMatch => match !== undefined);
}

export const totalMatches = microbeMatches.length;

// ---- Exercise 2: sort scenes into beneficial / harmful ----

const sortCardById = new Map(microbeSortCards.map((card) => [card.id, card]));

export function getSortCard(id: string): MicrobeSortCard | undefined {
  return sortCardById.get(id);
}

export function isCorrectEffect(cardId: string, effect: MicrobeEffect): boolean {
  return sortCardById.get(cardId)?.effect === effect;
}

export function cardsForEffect(effect: MicrobeEffect): MicrobeSortCard[] {
  return microbeSortCards.filter((card) => card.effect === effect);
}

export const totalSortCards = microbeSortCards.length;
