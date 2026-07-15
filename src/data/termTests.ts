// Built-in Term Test: a whole-term mix modelled on the real paper — a run of MCQs
// (Part I) followed by structured questions (Part II). The MCQs are drawn from the
// chapter banks so there is one source of truth for those facts; the structured
// questions are authored here.
import { quizQuestions } from "./quizQuestions";
import type { McqQuestion, TestPack, TestQuestion } from "./testModel";

const TERM_MODULES = [
  "micro-organisms",
  "sensory-system",
  "pressure-solids",
  "circulatory-system"
];

// Take the first `perModule` MCQs from each chapter so the mix spans the whole term.
function mcqSpread(perModule: number): McqQuestion[] {
  return TERM_MODULES.flatMap((moduleId) =>
    quizQuestions
      .filter((question) => question.moduleId === moduleId)
      .slice(0, perModule)
      .map<McqQuestion>((question) => ({
        id: `tt-${question.id}`,
        type: "mcq",
        moduleId: question.moduleId,
        prompt: question.prompt,
        options: question.options,
        answer: question.answer,
        explanation: question.explanation,
        marks: 1,
        difficulty: question.difficulty,
        source: "builtin"
      }))
  );
}

const structured: TestQuestion[] = [
  {
    id: "tt-short-1",
    type: "short",
    moduleId: "circulatory-system",
    prompt: "Name the straw-coloured liquid part of blood.",
    accepted: ["plasma"],
    explanation: "Plasma carries the blood cells, nutrients and wastes.",
    marks: 1,
    difficulty: "easy",
    source: "builtin"
  },
  {
    id: "tt-short-2",
    type: "short",
    moduleId: "pressure-solids",
    prompt: "State the SI unit used to measure pressure.",
    accepted: ["pascal", "pa", "n/m2", "newton per square metre"],
    explanation: "Pressure is measured in pascals (Pa), where 1 Pa = 1 N/m².",
    marks: 1,
    difficulty: "easy",
    source: "builtin"
  },
  {
    id: "tt-short-3",
    type: "short",
    moduleId: "micro-organisms",
    prompt:
      "Name the bacterium that fixes atmospheric nitrogen in the root nodules of legumes.",
    accepted: ["rhizobium"],
    explanation: "Rhizobium lives in legume root nodules and fixes nitrogen.",
    marks: 1,
    difficulty: "medium",
    source: "builtin"
  },
  {
    id: "tt-truefalse-1",
    type: "truefalse",
    moduleId: "micro-organisms",
    prompt: "Antibiotics are an effective treatment for illnesses caused by viruses.",
    answer: false,
    explanation:
      "Antibiotics work on bacteria and fungi, not viruses. Viral illnesses need vaccines or antivirals.",
    marks: 1,
    difficulty: "medium",
    source: "builtin"
  },
  {
    id: "tt-essay-1",
    type: "essay",
    moduleId: "pressure-solids",
    prompt:
      "A camel has wide, flat feet. Explain why this stops it sinking into soft sand. Use the relationship between force, area and pressure in your answer.",
    modelAnswer:
      "The camel's weight (the force) stays the same, but its wide feet spread that weight over a much larger contact area. Since pressure = force ÷ area, increasing the area decreases the pressure on the sand. The lower pressure is not enough to push the camel's feet down into the sand, so it does not sink.",
    points: [
      "States that pressure = force ÷ area",
      "Notes the weight/force stays the same",
      "Explains the wide feet increase the contact area",
      "Concludes the larger area lowers the pressure, so it does not sink"
    ],
    marks: 4,
    difficulty: "hard",
    source: "builtin"
  },
  {
    id: "tt-essay-2",
    type: "essay",
    moduleId: "circulatory-system",
    prompt:
      "Explain why the left ventricle has a much thicker muscular wall than the right ventricle.",
    modelAnswer:
      "The right ventricle only pumps blood a short distance to the lungs, so it needs less force. The left ventricle has to pump oxygenated blood all the way around the body, against much greater resistance. A thicker muscular wall lets it contract more strongly and generate the higher pressure needed for that longer journey.",
    points: [
      "Right ventricle pumps only to the lungs — a short distance",
      "Left ventricle pumps to the whole body",
      "The body circuit needs a higher pressure / more force",
      "Thicker muscle contracts more strongly to make that pressure"
    ],
    marks: 3,
    difficulty: "medium",
    source: "builtin"
  }
];

export const builtInTermTest: TestPack = {
  id: "builtin-term-mock",
  title: "Full-term mock test",
  kind: "term",
  questions: [...mcqSpread(3), ...structured],
  createdAt: 0,
  source: "builtin"
};

export const builtInPacks: TestPack[] = [builtInTermTest];
