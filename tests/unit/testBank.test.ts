import { describe, expect, it } from "vitest";
import {
  gradeAnswer,
  isAutoGraded,
  matchesShort,
  normalizeText,
  totalMarks,
  type TestPack,
  type TestQuestion
} from "../../src/data/testModel";
import { builtInTermTest } from "../../src/data/termTests";
import {
  exportPackJson,
  isValidPack,
  parsePackJson,
  removePack,
  upsertPack
} from "../../src/utils/testBank";

const mcq: TestQuestion = {
  id: "m1",
  type: "mcq",
  prompt: "SI unit of pressure?",
  options: ["Newton", "Pascal", "Joule", "Watt"],
  answer: 1,
  marks: 2,
  source: "teacher"
};

const short: TestQuestion = {
  id: "s1",
  type: "short",
  prompt: "Name the liquid part of blood.",
  accepted: ["plasma"],
  marks: 1,
  source: "teacher"
};

const essay: TestQuestion = {
  id: "e1",
  type: "essay",
  prompt: "Explain why the left ventricle is thicker.",
  modelAnswer: "It pumps blood around the whole body.",
  marks: 3,
  source: "teacher"
};

describe("grading", () => {
  it("auto-grades everything except essays", () => {
    expect(isAutoGraded("mcq")).toBe(true);
    expect(isAutoGraded("truefalse")).toBe(true);
    expect(isAutoGraded("short")).toBe(true);
    expect(isAutoGraded("essay")).toBe(false);
  });

  it("awards the question's marks for a correct MCQ and nothing for a wrong one", () => {
    expect(gradeAnswer(mcq, 1)).toEqual({ autoGraded: true, correct: true, earned: 2 });
    expect(gradeAnswer(mcq, 0)).toEqual({ autoGraded: true, correct: false, earned: 0 });
  });

  it("grades true/false", () => {
    const tf: TestQuestion = {
      id: "t1",
      type: "truefalse",
      prompt: "Antibiotics kill viruses.",
      answer: false,
      marks: 1,
      source: "teacher"
    };
    expect(gradeAnswer(tf, false).correct).toBe(true);
    expect(gradeAnswer(tf, true).correct).toBe(false);
  });

  it("grades short answers case- and punctuation-insensitively", () => {
    expect(gradeAnswer(short, "Plasma").correct).toBe(true);
    expect(gradeAnswer(short, "  plasma. ").correct).toBe(true);
    expect(gradeAnswer(short, "the plasma").correct).toBe(true); // keyword contained
    expect(gradeAnswer(short, "serum").correct).toBe(false);
    expect(gradeAnswer(short, "").correct).toBe(false);
  });

  it("never auto-grades an essay", () => {
    expect(gradeAnswer(essay, "a long answer")).toEqual({
      autoGraded: false,
      correct: false,
      earned: 0
    });
  });

  it("normalises text and matches keywords", () => {
    expect(normalizeText("  Pascal (Pa)! ")).toBe("pascal pa");
    expect(matchesShort("N/m2", ["n m2"])).toBe(true);
    expect(matchesShort("gold", ["silver", "iron"])).toBe(false);
  });

  it("totals the marks of a paper", () => {
    expect(totalMarks([mcq, short, essay])).toBe(6);
  });
});

describe("test pack collection helpers", () => {
  const pack: TestPack = {
    id: "p1",
    title: "Pack one",
    kind: "term",
    questions: [mcq],
    createdAt: 1,
    source: "teacher"
  };

  it("adds a new pack and replaces one with the same id", () => {
    const added = upsertPack([], pack);
    expect(added).toHaveLength(1);

    const edited = upsertPack(added, { ...pack, title: "Renamed" });
    expect(edited).toHaveLength(1);
    expect(edited[0].title).toBe("Renamed");
  });

  it("removes by id", () => {
    expect(removePack([pack], "p1")).toEqual([]);
    expect(removePack([pack], "nope")).toHaveLength(1);
  });
});

describe("pack import / export", () => {
  const pack: TestPack = {
    id: "p1",
    title: "Pack one",
    kind: "term",
    questions: [mcq, short, essay],
    createdAt: 1,
    source: "teacher"
  };

  it("round-trips through JSON and re-ids on import", () => {
    const result = parsePackJson(exportPackJson(pack));
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.pack.title).toBe("Pack one");
      expect(result.pack.questions).toHaveLength(3);
      expect(result.pack.source).toBe("imported");
      expect(result.pack.id).not.toBe("p1"); // re-ided so it can't clobber an existing pack
    }
  });

  it("rejects invalid JSON with a friendly message", () => {
    const result = parsePackJson("{not json");
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toMatch(/JSON/i);
    }
  });

  it("rejects JSON that isn't a pack", () => {
    expect(parsePackJson(JSON.stringify({ hello: "world" })).ok).toBe(false);
    expect(parsePackJson(JSON.stringify([1, 2, 3])).ok).toBe(false);
  });

  it("rejects a pack whose MCQ answer is out of range", () => {
    const broken = {
      ...pack,
      questions: [{ ...mcq, answer: 9 }]
    };
    expect(parsePackJson(JSON.stringify(broken)).ok).toBe(false);
  });

  it("rejects a pack with no questions", () => {
    expect(parsePackJson(JSON.stringify({ ...pack, questions: [] })).ok).toBe(false);
  });
});

describe("built-in term test", () => {
  it("is a valid pack that mixes chapters and question types", () => {
    expect(isValidPack(builtInTermTest)).toBe(true);
    expect(builtInTermTest.kind).toBe("term");

    const types = new Set(builtInTermTest.questions.map((q) => q.type));
    expect(types.has("mcq")).toBe(true);
    expect(types.has("short")).toBe(true);
    expect(types.has("essay")).toBe(true);

    const modules = new Set(
      builtInTermTest.questions.map((q) => q.moduleId).filter(Boolean)
    );
    expect(modules.size).toBeGreaterThanOrEqual(4); // spans the whole term
    expect(totalMarks(builtInTermTest.questions)).toBeGreaterThan(12);
  });
});
