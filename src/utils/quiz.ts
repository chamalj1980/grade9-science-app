import { quizQuestions, type QuizQuestion } from "../data/quizQuestions";

export type QuizMode = "practice" | "time-attack";

// Tuning constants for the two modes.
export const TIME_ATTACK_SECONDS = 90;
export const POINTS_CORRECT = 100;
export const MAX_SPEED_BONUS = 50;
export const SPEED_WINDOW_MS = 8000; // answers faster than this earn a speed bonus
export const MAX_STREAK_BONUS = 50;

// All MCQs that belong to one chapter/module.
export function questionsForModule(moduleId: string): QuizQuestion[] {
  return quizQuestions.filter((question) => question.moduleId === moduleId);
}

export function hasQuiz(moduleId: string): boolean {
  return quizQuestions.some((question) => question.moduleId === moduleId);
}

// Fisher-Yates shuffle. Returns a NEW array; the input is not mutated.
export function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

// Points for a single answer. Wrong answers score nothing. Correct answers earn a base,
// plus a speed bonus (the faster within SPEED_WINDOW_MS, the more) and a streak bonus
// (10 per consecutive correct answer, capped). `streak` is the run length INCLUDING this
// answer, so the first correct answer gets no streak bonus.
export function computePoints(
  correct: boolean,
  streak: number,
  answerMs: number
): number {
  if (!correct) {
    return 0;
  }

  const speedBonus = Math.max(
    0,
    Math.round(MAX_SPEED_BONUS * (1 - Math.min(answerMs, SPEED_WINDOW_MS) / SPEED_WINDOW_MS))
  );
  const streakBonus = Math.min(MAX_STREAK_BONUS, Math.max(0, streak - 1) * 10);

  return POINTS_CORRECT + speedBonus + streakBonus;
}

// ---- Best-score persistence (localStorage) ----

export interface ModeStat {
  bestScore: number;
  bestCorrect: number;
  plays: number;
}

export type QuizStats = Record<string, ModeStat>;

export const quizStatsStorageKey = "quiz-arena-stats";

export function statKey(moduleId: string, mode: QuizMode): string {
  return `${moduleId}:${mode}`;
}

export interface QuizResult {
  moduleId: string;
  mode: QuizMode;
  score: number;
  correct: number;
  total: number;
}

// Merge a finished attempt into the stats, keeping the best score/correct and bumping
// the play count. Pure: returns a new stats object.
export function recordResult(stats: QuizStats, result: QuizResult): QuizStats {
  const key = statKey(result.moduleId, result.mode);
  const previous = stats[key] ?? { bestScore: 0, bestCorrect: 0, plays: 0 };

  return {
    ...stats,
    [key]: {
      bestScore: Math.max(previous.bestScore, result.score),
      bestCorrect: Math.max(previous.bestCorrect, result.correct),
      plays: previous.plays + 1
    }
  };
}

export function getStat(stats: QuizStats, moduleId: string, mode: QuizMode): ModeStat {
  return stats[statKey(moduleId, mode)] ?? { bestScore: 0, bestCorrect: 0, plays: 0 };
}

export function loadQuizStats(): QuizStats {
  if (typeof window === "undefined") {
    return {};
  }

  const saved = window.localStorage.getItem(quizStatsStorageKey);

  if (!saved) {
    return {};
  }

  try {
    const parsed = JSON.parse(saved) as unknown;
    return parsed && typeof parsed === "object" ? (parsed as QuizStats) : {};
  } catch {
    return {};
  }
}

export function saveQuizStats(stats: QuizStats): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(quizStatsStorageKey, JSON.stringify(stats));
}
