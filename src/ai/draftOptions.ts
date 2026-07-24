// What the teacher asks the AI to build: how many exercises, which type each one is, and
// how the recap should be written. These options travel with the chapter text into the
// authoring prompt (kept out of the static system prompt so it stays cacheable).

export type ExerciseType = "mcq" | "sortBins" | "orderTimeline";

export interface ExerciseTypeOption {
  id: ExerciseType;
  label: string;
  hint: string;
}

export const EXERCISE_TYPES: ExerciseTypeOption[] = [
  { id: "mcq", label: "Multiple choice quiz", hint: "Recall and recognition questions" },
  { id: "sortBins", label: "Sort into groups", hint: "Classify items into labelled bins" },
  { id: "orderTimeline", label: "Put in order", hint: "Arrange items into the correct sequence" }
];

// The default recap brief. The teacher can rewrite this freely.
export const DEFAULT_RECAP_INSTRUCTION =
  "A short revision note covering the whole chapter in point form — the key facts and terms a student should memorise. No more than 500 words.";

export const MAX_EXERCISES = 6;

export interface DraftOptions {
  exercises: ExerciseType[]; // one entry per exercise, in order
  includeRecap: boolean;
  recapInstruction: string;
}

export function defaultDraftOptions(): DraftOptions {
  return {
    exercises: ["mcq", "sortBins"],
    includeRecap: true,
    recapInstruction: DEFAULT_RECAP_INSTRUCTION
  };
}

export function exerciseTypeLabel(type: ExerciseType): string {
  return EXERCISE_TYPES.find((option) => option.id === type)?.label ?? type;
}
