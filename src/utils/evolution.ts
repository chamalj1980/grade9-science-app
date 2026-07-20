import {
  evoStatements,
  timelineRounds,
  type EvoStatement,
  type TimelineRound
} from "../data/evolutionData";

// ---- Exercise 1: Timeline ordering ----

export function getRound(id: string): TimelineRound | undefined {
  return timelineRounds.find((round) => round.id === id);
}

// The correct sequence of item ids for a round (earliest first).
export function correctOrder(round: TimelineRound): string[] {
  return round.order.map((item) => item.id);
}

// True once every slot is filled with the right item in the right place.
export function isOrderComplete(round: TimelineRound, placed: string[]): boolean {
  const answer = correctOrder(round);
  return (
    placed.length === answer.length &&
    placed.every((id, index) => id === answer[index])
  );
}

// Which placed positions are correct — drives the per-slot ticks/crosses.
export function orderCorrectness(round: TimelineRound, placed: string[]): boolean[] {
  const answer = correctOrder(round);
  return placed.map((id, index) => id === answer[index]);
}

export const totalRounds = timelineRounds.length;

// ---- Exercise 2: True / False ----

export type TruthValue = "true" | "false";

export const totalStatements = evoStatements.length;

export function getStatement(id: string): EvoStatement | undefined {
  return evoStatements.find((statement) => statement.id === id);
}

export function isCorrectTruth(id: string, choice: TruthValue): boolean {
  const statement = getStatement(id);
  if (!statement) {
    return false;
  }
  return statement.isTrue === (choice === "true");
}

export function statementsByTruth(isTrue: boolean): EvoStatement[] {
  return evoStatements.filter((statement) => statement.isTrue === isTrue);
}
