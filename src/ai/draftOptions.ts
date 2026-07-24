// What the teacher asks the AI to build: how many exercises, which type each one is and
// how big it should be, and how the recap should be written. These options travel with the
// chapter text into the authoring prompt (kept out of the static system prompt so it stays
// cacheable).

export type ExerciseType = "mcq" | "sortBins" | "orderTimeline";

export interface ExerciseTypeOption {
  id: ExerciseType;
  label: string;
  hint: string;
  // The type-appropriate quantity knob: what the number means, and its sane range.
  countLabel: string;
  min: number;
  max: number;
  defaultCount: number;
}

export const EXERCISE_TYPES: ExerciseTypeOption[] = [
  {
    id: "mcq",
    label: "Multiple choice quiz",
    hint: "Recall and recognition questions",
    countLabel: "questions",
    min: 2,
    max: 12,
    defaultCount: 5
  },
  {
    id: "sortBins",
    label: "Sort into groups",
    hint: "Classify items into labelled bins",
    countLabel: "items",
    min: 4,
    max: 16,
    defaultCount: 8
  },
  {
    id: "orderTimeline",
    label: "Put in order",
    hint: "Arrange items into the correct sequence",
    countLabel: "steps",
    min: 3,
    max: 10,
    defaultCount: 5
  }
];

export interface ExerciseSpec {
  type: ExerciseType;
  count: number;
}

// The default recap brief. The teacher can rewrite this freely.
export const DEFAULT_RECAP_INSTRUCTION =
  "A short revision note covering the whole chapter in point form — the key facts and terms a student should memorise. No more than 500 words.";

export const MAX_EXERCISES = 6;

export interface DraftOptions {
  exercises: ExerciseSpec[]; // one entry per exercise, in order
  includeRecap: boolean;
  recapInstruction: string;
}

export function exerciseTypeOption(type: ExerciseType): ExerciseTypeOption {
  return EXERCISE_TYPES.find((option) => option.id === type) ?? EXERCISE_TYPES[0];
}

export function exerciseTypeLabel(type: ExerciseType): string {
  return exerciseTypeOption(type).label;
}

export function defaultCountFor(type: ExerciseType): number {
  return exerciseTypeOption(type).defaultCount;
}

export function clampCount(type: ExerciseType, value: number): number {
  const option = exerciseTypeOption(type);
  if (!Number.isFinite(value)) {
    return option.defaultCount;
  }
  return Math.min(option.max, Math.max(option.min, Math.round(value)));
}

export function defaultDraftOptions(): DraftOptions {
  return {
    exercises: [
      { type: "mcq", count: defaultCountFor("mcq") },
      { type: "sortBins", count: defaultCountFor("sortBins") }
    ],
    includeRecap: true,
    recapInstruction: DEFAULT_RECAP_INSTRUCTION
  };
}

function isExerciseType(value: unknown): value is ExerciseType {
  return value === "mcq" || value === "sortBins" || value === "orderTimeline";
}

// Coerce persisted or legacy options into a valid shape. Older saved options stored
// `exercises` as a bare array of type strings, with no per-exercise size.
export function normalizeDraftOptions(raw: unknown): DraftOptions {
  const base = defaultDraftOptions();
  if (!raw || typeof raw !== "object") {
    return base;
  }
  const obj = raw as Record<string, unknown>;
  const rawExercises = Array.isArray(obj.exercises) ? obj.exercises : [];

  const exercises: ExerciseSpec[] = rawExercises
    .slice(0, MAX_EXERCISES)
    .map((entry) => {
      if (typeof entry === "string") {
        const type = isExerciseType(entry) ? entry : "mcq";
        return { type, count: defaultCountFor(type) };
      }
      const spec = (entry ?? {}) as Record<string, unknown>;
      const type = isExerciseType(spec.type) ? spec.type : "mcq";
      return { type, count: clampCount(type, Number(spec.count)) };
    });

  return {
    exercises,
    includeRecap:
      typeof obj.includeRecap === "boolean" ? obj.includeRecap : base.includeRecap,
    recapInstruction:
      typeof obj.recapInstruction === "string" && obj.recapInstruction.trim()
        ? obj.recapInstruction
        : base.recapInstruction
  };
}
