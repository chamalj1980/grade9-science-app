// Shared question model for the testing module (Phase 2). A TestQuestion is a
// discriminated union covering the shapes found in a term paper. Objective types
// (mcq, truefalse, short) are auto-graded; essay/structured answers are self-marked by
// the student against a model answer. Phase 1's MCQ bank maps onto the "mcq" case, so
// Module Quizzes and Term Tests can share this model.
import type { Difficulty } from "./quizQuestions";

export type TestQuestionType = "mcq" | "truefalse" | "short" | "essay";

interface BaseQuestion {
  id: string;
  moduleId?: string; // chapter tag; omitted/mixed for term tests
  prompt: string;
  marks: number;
  difficulty?: Difficulty;
  source: "builtin" | "teacher" | "imported";
}

export interface McqQuestion extends BaseQuestion {
  type: "mcq";
  options: string[];
  answer: number; // index of the correct option
  explanation?: string;
}

export interface TrueFalseQuestion extends BaseQuestion {
  type: "truefalse";
  answer: boolean;
  explanation?: string;
}

export interface ShortQuestion extends BaseQuestion {
  type: "short";
  accepted: string[]; // accepted answers / keywords (case-insensitive)
  explanation?: string;
}

export interface EssayQuestion extends BaseQuestion {
  type: "essay";
  modelAnswer: string;
  points?: string[]; // mark-scheme points, shown when self-marking
}

export type TestQuestion =
  | McqQuestion
  | TrueFalseQuestion
  | ShortQuestion
  | EssayQuestion;

export interface TestPack {
  id: string;
  title: string;
  kind: "module" | "term";
  moduleId?: string; // for module packs
  questions: TestQuestion[];
  createdAt: number;
  source: "builtin" | "teacher" | "imported";
}

export const questionTypeLabels: Record<TestQuestionType, string> = {
  mcq: "Multiple choice",
  truefalse: "True / False",
  short: "Short answer",
  essay: "Essay / structured"
};

// Objective types can be marked by the computer; essays are self-marked.
export function isAutoGraded(type: TestQuestionType): boolean {
  return type !== "essay";
}

// Normalise free text for comparison: lowercase, trim, collapse spaces, drop most
// punctuation. Used for short-answer keyword matching.
export function normalizeText(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// True if a typed short answer matches any accepted answer/keyword. Matches when the
// normalised answer equals an accepted term or contains it (keyword style).
export function matchesShort(answer: string, accepted: string[]): boolean {
  const normalizedAnswer = normalizeText(answer);
  if (!normalizedAnswer) {
    return false;
  }
  return accepted.some((candidate) => {
    const normalizedCandidate = normalizeText(candidate);
    return (
      normalizedCandidate.length > 0 &&
      (normalizedAnswer === normalizedCandidate ||
        normalizedAnswer.includes(normalizedCandidate))
    );
  });
}

export interface Grade {
  autoGraded: boolean;
  correct: boolean;
  earned: number; // marks earned
}

// Grade an objective answer. `answer` is the student's response: an option index for
// mcq, a boolean for truefalse, a string for short. Essays return an ungraded result.
export function gradeAnswer(question: TestQuestion, answer: unknown): Grade {
  switch (question.type) {
    case "mcq": {
      const correct = answer === question.answer;
      return { autoGraded: true, correct, earned: correct ? question.marks : 0 };
    }
    case "truefalse": {
      const correct = answer === question.answer;
      return { autoGraded: true, correct, earned: correct ? question.marks : 0 };
    }
    case "short": {
      const correct =
        typeof answer === "string" && matchesShort(answer, question.accepted);
      return { autoGraded: true, correct, earned: correct ? question.marks : 0 };
    }
    case "essay":
    default:
      return { autoGraded: false, correct: false, earned: 0 };
  }
}

export function totalMarks(questions: TestQuestion[]): number {
  return questions.reduce((sum, question) => sum + (question.marks || 0), 0);
}

// Switch a question to another type in the editor, keeping everything the two types
// share (prompt, marks, tags) and seeding sensible defaults for the new fields.
export function convertQuestion(
  question: TestQuestion,
  type: TestQuestionType
): TestQuestion {
  const base = {
    id: question.id,
    moduleId: question.moduleId,
    prompt: question.prompt,
    marks: question.marks,
    difficulty: question.difficulty,
    source: question.source
  };
  const explanation = "explanation" in question ? question.explanation : undefined;

  switch (type) {
    case "mcq":
      return {
        ...base,
        type: "mcq",
        options: question.type === "mcq" ? question.options : ["", "", "", ""],
        answer: question.type === "mcq" ? question.answer : 0,
        explanation
      };
    case "truefalse":
      return {
        ...base,
        type: "truefalse",
        answer: question.type === "truefalse" ? question.answer : true,
        explanation
      };
    case "short":
      return {
        ...base,
        type: "short",
        accepted: question.type === "short" ? question.accepted : [],
        explanation
      };
    case "essay":
    default:
      return {
        ...base,
        type: "essay",
        modelAnswer: question.type === "essay" ? question.modelAnswer : "",
        points: question.type === "essay" ? question.points : undefined
      };
  }
}

export function makeBlankQuestion(id: string, type: TestQuestionType): TestQuestion {
  return convertQuestion(
    {
      id,
      type: "short",
      prompt: "",
      accepted: [],
      marks: 1,
      difficulty: "medium",
      source: "teacher"
    },
    type
  );
}

// Problems a teacher should fix before publishing. Empty array = ready.
export function questionIssues(question: TestQuestion): string[] {
  const issues: string[] = [];
  if (!question.prompt.trim()) {
    issues.push("The question text is empty.");
  }
  if (question.marks <= 0) {
    issues.push("Marks must be at least 1.");
  }
  switch (question.type) {
    case "mcq":
      if (question.options.length < 2) {
        issues.push("Needs at least two options.");
      }
      if (question.options.some((option) => !option.trim())) {
        issues.push("Every option needs text.");
      }
      break;
    case "short":
      if (question.accepted.filter((item) => item.trim()).length === 0) {
        issues.push("Add at least one accepted answer so it can be marked.");
      }
      break;
    case "essay":
      if (!question.modelAnswer.trim()) {
        issues.push("Add a model answer for the student to self-mark against.");
      }
      break;
    default:
      break;
  }
  return issues;
}
