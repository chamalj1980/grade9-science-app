// Generic answer-checking for the assessment blocks. This logic is per BLOCK TYPE, not
// per chapter — every chapter's ordering/sorting/quiz reuses it, which is the whole point
// of the schema: content is data, checking lives here once.

import type { McqBlock, OrderTimelineBlock, SortBinsBlock } from "../schema";

type Round = OrderTimelineBlock["rounds"][number];

// ---- orderTimeline ----

// The correct sequence of item ids for a round (earliest first).
export function correctOrder(round: Round): string[] {
  return round.order.map((item) => item.id);
}

// True once every slot is filled with the right item in the right place.
export function isOrderComplete(round: Round, placed: string[]): boolean {
  const answer = correctOrder(round);
  return placed.length === answer.length && placed.every((id, i) => id === answer[i]);
}

// Which placed positions are correct — drives the per-slot ticks/crosses.
export function orderCorrectness(round: Round, placed: string[]): boolean[] {
  const answer = correctOrder(round);
  return placed.map((id, i) => id === answer[i]);
}

export function totalOrderItems(block: OrderTimelineBlock): number {
  return block.rounds.reduce((sum, round) => sum + round.order.length, 0);
}

// ---- sortBins ----

export function isCorrectBin(block: SortBinsBlock, itemId: string, binId: string): boolean {
  const item = block.items.find((candidate) => candidate.id === itemId);
  return item ? item.binId === binId : false;
}

export function itemsForBin(block: SortBinsBlock, binId: string): SortBinsBlock["items"] {
  return block.items.filter((item) => item.binId === binId);
}

// ---- mcq ----

export function mcqScore(block: McqBlock, answers: Record<string, number>): number {
  return block.questions.reduce(
    (score, question) => (answers[question.id] === question.answer ? score + 1 : score),
    0
  );
}
