import type { LearningModule, SectionId } from "../types";

// A section moves through three states so we can tell "opened" apart from "finished"
// (the spec distinguishes "Lesson viewed" from "Exercise completed").
export type SectionStatus = "not-started" | "viewed" | "completed";

// Rich per-section progress. `score`/`total` hold the primary count for an exercise
// (challenges solved, cards sorted, labels placed, transfusion cases passed) and
// `streak` holds a best-streak where an exercise tracks one (e.g. the calculation drill).
export interface SectionProgress {
  status: SectionStatus;
  score: number;
  total: number;
  streak: number;
}

// A patch an exercise sends up when its state changes.
export interface SectionProgressUpdate {
  score?: number;
  total?: number;
  streak?: number;
  completed?: boolean;
}

export type ModuleProgress = Record<SectionId, SectionProgress>;
export type ProgressState = Record<string, ModuleProgress>;

export const progressStorageKey = "grade9-science-progress";

// Every section id that can appear in storage. Used only to create/normalize the
// progress object; what a module actually shows is driven by its own `sections` list.
export const sectionIds: SectionId[] = [
  "lesson",
  "simulation",
  "exercise-1",
  "exercise-2",
  "recap"
];

export function createEmptySectionProgress(): SectionProgress {
  return { status: "not-started", score: 0, total: 0, streak: 0 };
}

export function createEmptyModuleProgress(): ModuleProgress {
  return sectionIds.reduce((progress, sectionId) => {
    progress[sectionId] = createEmptySectionProgress();
    return progress;
  }, {} as ModuleProgress);
}

export function createInitialProgress(modules: LearningModule[]): ProgressState {
  return modules.reduce<ProgressState>((progress, module) => {
    progress[module.id] = createEmptyModuleProgress();
    return progress;
  }, {});
}

function normalizeStatus(value: unknown): SectionStatus {
  return value === "completed" || value === "viewed" ? value : "not-started";
}

function normalizeNumber(value: unknown): number {
  return typeof value === "number" && Number.isFinite(value) && value >= 0
    ? value
    : 0;
}

// Defensive parse of whatever was in localStorage. Unknown modules/sections are dropped
// and every field is coerced back to a safe value so a corrupted store never crashes the app.
export function normalizeProgress(
  modules: LearningModule[],
  savedProgress: unknown
): ProgressState {
  const progress = createInitialProgress(modules);

  if (!savedProgress || typeof savedProgress !== "object") {
    return progress;
  }

  for (const module of modules) {
    const savedModule = (savedProgress as Record<string, unknown>)[module.id];

    if (!savedModule || typeof savedModule !== "object") {
      continue;
    }

    for (const sectionId of sectionIds) {
      const savedSection = (savedModule as Record<string, unknown>)[sectionId];

      if (!savedSection || typeof savedSection !== "object") {
        continue;
      }

      const section = savedSection as Record<string, unknown>;
      progress[module.id][sectionId] = {
        status: normalizeStatus(section.status),
        score: normalizeNumber(section.score),
        total: normalizeNumber(section.total),
        streak: normalizeNumber(section.streak)
      };
    }
  }

  return progress;
}

// How "done" a single section is, from 0 to 1. Completed sections count fully;
// in-progress exercises earn partial credit from their score; a merely-opened
// content section earns a small amount so the bar reflects that it was visited.
export function getSectionFraction(section: SectionProgress): number {
  if (section.status === "completed") {
    return 1;
  }

  if (section.total > 0) {
    return Math.min(0.95, section.score / section.total);
  }

  return section.status === "viewed" ? 0.3 : 0;
}

// Progress is averaged over the section ids the module actually has, so modules with
// different section counts (e.g. the extra "simulation" section) each compute correctly.
export function calculateModuleProgress(
  module: LearningModule,
  moduleProgress: ModuleProgress
): number {
  const sections = module.sections;

  if (sections.length === 0) {
    return 0;
  }

  const total = sections.reduce(
    (sum, section) =>
      sum +
      getSectionFraction(moduleProgress[section.id] ?? createEmptySectionProgress()),
    0
  );

  return Math.round((total / sections.length) * 100);
}

export function calculateOverallProgress(
  modules: LearningModule[],
  progress: ProgressState
): number {
  if (modules.length === 0) {
    return 0;
  }

  const total = modules.reduce(
    (sum, module) =>
      sum + calculateModuleProgress(module, progress[module.id] ?? createEmptyModuleProgress()),
    0
  );

  return Math.round(total / modules.length);
}

export function isSectionComplete(section: SectionProgress): boolean {
  return section.status === "completed";
}

// Mark a section at least "viewed" (opening it). Never downgrades a completed section.
export function markSectionViewed(
  progress: ProgressState,
  moduleId: string,
  sectionId: SectionId
): ProgressState {
  const moduleProgress = progress[moduleId] ?? createEmptyModuleProgress();
  const section = moduleProgress[sectionId] ?? createEmptySectionProgress();

  if (section.status === "completed") {
    return progress;
  }

  return {
    ...progress,
    [moduleId]: {
      ...moduleProgress,
      [sectionId]: { ...section, status: "viewed" }
    }
  };
}

// Apply an update from an exercise. Scores and streaks only ever move upward so
// re-opening an exercise can't wipe a student's best result. `completed: true`
// promotes the status; without it the section stays "viewed".
export function updateSectionProgress(
  progress: ProgressState,
  moduleId: string,
  sectionId: SectionId,
  update: SectionProgressUpdate
): ProgressState {
  const moduleProgress = progress[moduleId] ?? createEmptyModuleProgress();
  const section = moduleProgress[sectionId] ?? createEmptySectionProgress();

  const nextStatus: SectionStatus =
    update.completed || section.status === "completed"
      ? "completed"
      : section.status === "not-started"
        ? "viewed"
        : section.status;

  const nextSection: SectionProgress = {
    status: nextStatus,
    score:
      update.score === undefined
        ? section.score
        : Math.max(section.score, update.score),
    total: update.total === undefined ? section.total : update.total,
    streak:
      update.streak === undefined
        ? section.streak
        : Math.max(section.streak, update.streak)
  };

  return {
    ...progress,
    [moduleId]: { ...moduleProgress, [sectionId]: nextSection }
  };
}

export interface RevisionSuggestion {
  moduleId: string;
  moduleTitle: string;
  sectionId: SectionId;
  sectionTitle: string;
  reason: string;
}

// "Suggested revision areas" for the Progress screen (spec section 11): the first
// unfinished section in each module, with a friendly reason.
export function getRevisionSuggestions(
  modules: LearningModule[],
  progress: ProgressState
): RevisionSuggestion[] {
  const suggestions: RevisionSuggestion[] = [];

  for (const module of modules) {
    const moduleProgress = progress[module.id];

    if (!moduleProgress) {
      continue;
    }

    const section = module.sections.find(
      (candidate) => moduleProgress[candidate.id].status !== "completed"
    );

    if (!section) {
      continue;
    }

    const sectionProgress = moduleProgress[section.id];
    const reason =
      sectionProgress.status === "not-started"
        ? "Not started yet."
        : sectionProgress.total > 0
          ? `In progress: ${sectionProgress.score}/${sectionProgress.total} done.`
          : "Opened but not finished.";

    suggestions.push({
      moduleId: module.id,
      moduleTitle: module.title,
      sectionId: section.id,
      sectionTitle: section.title,
      reason
    });
  }

  return suggestions;
}

export function loadProgress(modules: LearningModule[]): ProgressState {
  if (typeof window === "undefined") {
    return createInitialProgress(modules);
  }

  const savedProgress = window.localStorage.getItem(progressStorageKey);

  if (!savedProgress) {
    return createInitialProgress(modules);
  }

  try {
    return normalizeProgress(modules, JSON.parse(savedProgress));
  } catch {
    return createInitialProgress(modules);
  }
}

export function saveProgress(progress: ProgressState): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(progressStorageKey, JSON.stringify(progress));
}
