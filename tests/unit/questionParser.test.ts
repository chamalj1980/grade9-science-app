import { describe, expect, it } from "vitest";
import { parseQuestions } from "../../src/utils/questionParser";

describe("parseQuestions — MCQs", () => {
  it("parses a paper-style MCQ with inline (1)…(4) options", () => {
    // Verbatim shape from the 2017 Term 2 paper, Part I.
    const raw = [
      "(5) Select the group which only contain pure metals.",
      "(1) Iron, Lead, Steel (2) Brass, Iron, Copper",
      "(3) Copper, Iron, Gold (4) Nichrome, Iron, Zinc"
    ].join("\n");

    const [question] = parseQuestions(raw);

    expect(question.type).toBe("mcq");
    expect(question.prompt).toBe("Select the group which only contain pure metals.");
    if (question.type === "mcq") {
      expect(question.options).toEqual([
        "Iron, Lead, Steel",
        "Brass, Iron, Copper",
        "Copper, Iron, Gold",
        "Nichrome, Iron, Zinc"
      ]);
      // No correct answer is marked in a plain paper — defaults to 0 for the teacher to fix.
      expect(question.answer).toBe(0);
    }
  });

  it("parses lettered options on their own lines and honours a * answer marker", () => {
    const raw = [
      "1. What is the SI unit of pressure?",
      "a) Newton",
      "b) Pascal *",
      "c) Joule",
      "d) Watt"
    ].join("\n");

    const [question] = parseQuestions(raw);

    expect(question.type).toBe("mcq");
    expect(question.prompt).toBe("What is the SI unit of pressure?");
    if (question.type === "mcq") {
      expect(question.options).toEqual(["Newton", "Pascal", "Joule", "Watt"]);
      expect(question.answer).toBe(1); // the starred option
    }
  });

  it("splits a run of real paper MCQs pasted as one blob with no blank lines", () => {
    // Verbatim from the 2017 Term 2 paper: question numbers AND options are both "(n)",
    // so this exercises the option-run heuristic.
    const raw = [
      "(1) Select the unsuitable combination.",
      "(1) Nicholus Copernicus – Introduced the helio-centric model",
      "(2) Tycho Brahe – Designed the equipment called sextant",
      "(3) Pythagorus – Declared that earth is a sphere",
      "(4) Johannes Kepler – Explained that planets are moving in elliptical orbits",
      "(2) Not a primary energy resource,",
      "(1) Biomass (2) Geothermal energy",
      "(3) Natural gas (4) Wind energy",
      "(3) The element which is being used mostly in nano-technology at present is,",
      "(1) Carbon (2) Sodium",
      "(3) Silicon (4) Germanium"
    ].join("\n");

    const questions = parseQuestions(raw);

    expect(questions).toHaveLength(3);
    expect(questions.every((q) => q.type === "mcq")).toBe(true);
    expect(questions[0].prompt).toBe("Select the unsuitable combination.");
    expect(questions[1].prompt).toBe("Not a primary energy resource,");
    expect(questions[2].prompt).toBe(
      "The element which is being used mostly in nano-technology at present is,"
    );
    if (questions[1].type === "mcq") {
      expect(questions[1].options).toEqual([
        "Biomass",
        "Geothermal energy",
        "Natural gas",
        "Wind energy"
      ]);
    }
    if (questions[0].type === "mcq") {
      expect(questions[0].options).toHaveLength(4);
      expect(questions[0].options[0]).toContain("Nicholus Copernicus");
    }
  });

  it("splits several blank-line separated questions", () => {
    const raw = [
      "1. Pressure is calculated as…",
      "a) Force x Area",
      "b) Force / Area *",
      "c) Area / Force",
      "d) Force + Area",
      "",
      "2. The upper chambers of the heart are called…",
      "a) Ventricles",
      "b) Atria *",
      "c) Valves",
      "d) Arteries"
    ].join("\n");

    const questions = parseQuestions(raw);

    expect(questions).toHaveLength(2);
    expect(questions.every((q) => q.type === "mcq")).toBe(true);
  });
});

describe("parseQuestions — structured types", () => {
  it("treats a brief prompt as a short answer and reads ^1& marks", () => {
    const raw = "(i) Name the constellation to which Aldebaran belongs. ^1&";

    const [question] = parseQuestions(raw);

    expect(question.type).toBe("short");
    expect(question.marks).toBe(1);
    expect(question.prompt).toBe("Name the constellation to which Aldebaran belongs.");
    if (question.type === "short") {
      expect(question.accepted).toEqual([]); // teacher fills the key in review
    }
  });

  it("treats an 'Explain…' prompt as an essay", () => {
    const raw = "(ii) Explain what is meant by a quality certificate. ^2&";

    const [question] = parseQuestions(raw);

    expect(question.type).toBe("essay");
    expect(question.marks).toBe(2);
    if (question.type === "essay") {
      expect(question.modelAnswer).toBe("");
    }
  });

  it("treats a high-mark prompt as an essay even without an explain hint", () => {
    const raw = "(iii) State two solutions which prevent polymers collecting in the environment. ^4&";

    const [question] = parseQuestions(raw);

    expect(question.type).toBe("essay");
    expect(question.marks).toBe(4);
  });

  it("reads multiplied marks such as ^1x3&", () => {
    const raw = "(i) Describe the nature of motion between A-B, B-C and C-D. ^1x3&";

    const [question] = parseQuestions(raw);

    expect(question.marks).toBe(3);
  });

  it("reads (2 marks) notation and strips it from the prompt", () => {
    const raw = "1. Name the liquid part of blood. (1 mark)";

    const [question] = parseQuestions(raw);

    expect(question.marks).toBe(1);
    expect(question.prompt).toBe("Name the liquid part of blood.");
  });
});

describe("parseQuestions — robustness", () => {
  it("returns nothing for empty input", () => {
    expect(parseQuestions("")).toEqual([]);
    expect(parseQuestions("   \n  \n ")).toEqual([]);
  });

  it("gives every question a unique id and marks them as teacher-sourced", () => {
    const raw = ["1. First question here?", "", "2. Second question here?"].join("\n");
    const questions = parseQuestions(raw);
    const ids = questions.map((q) => q.id);

    expect(new Set(ids).size).toBe(ids.length);
    expect(questions.every((q) => q.source === "teacher")).toBe(true);
  });
});
