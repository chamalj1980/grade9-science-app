import { describe, expect, it } from "vitest";
import { buildDraftUserMessage } from "../../src/ai/authoringPrompt";
import {
  clampCount,
  defaultCountFor,
  defaultDraftOptions,
  normalizeDraftOptions
} from "../../src/ai/draftOptions";

describe("exercise sizing", () => {
  it("clamps a count into the type's range", () => {
    expect(clampCount("mcq", 99)).toBe(12); // max
    expect(clampCount("mcq", 0)).toBe(2); // min
    expect(clampCount("orderTimeline", 4)).toBe(4); // inside range
    expect(clampCount("sortBins", Number.NaN)).toBe(defaultCountFor("sortBins"));
  });

  it("gives each type its own default size", () => {
    expect(defaultCountFor("mcq")).toBe(5);
    expect(defaultCountFor("sortBins")).toBe(8);
    expect(defaultCountFor("orderTimeline")).toBe(5);
  });
});

describe("normalizeDraftOptions", () => {
  it("upgrades legacy options where exercises were bare type strings", () => {
    const legacy = { exercises: ["mcq", "sortBins"], includeRecap: true, recapInstruction: "x" };
    const options = normalizeDraftOptions(legacy);
    expect(options.exercises).toEqual([
      { type: "mcq", count: 5 },
      { type: "sortBins", count: 8 }
    ]);
  });

  it("clamps stored counts and falls back on unknown types", () => {
    const options = normalizeDraftOptions({
      exercises: [{ type: "hologram", count: 3 }, { type: "orderTimeline", count: 999 }]
    });
    expect(options.exercises[0].type).toBe("mcq");
    expect(options.exercises[1]).toEqual({ type: "orderTimeline", count: 10 });
  });

  it("returns defaults for junk input", () => {
    expect(normalizeDraftOptions(null)).toEqual(defaultDraftOptions());
    expect(normalizeDraftOptions("nope")).toEqual(defaultDraftOptions());
  });
});

describe("prompt spec includes sizes", () => {
  it("states the exact size and unit per exercise", () => {
    const message = buildDraftUserMessage("TEXT", {
      exercises: [
        { type: "mcq", count: 6 },
        { type: "orderTimeline", count: 4 }
      ],
      includeRecap: true,
      recapInstruction: "Ten bullets."
    });
    expect(message).toContain('1. type "mcq" — Multiple choice quiz — exactly 6 questions');
    expect(message).toContain('2. type "orderTimeline" — Put in order — exactly 4 steps');
    expect(message).toContain("Recap: yes. Brief: Ten bullets.");
  });

  it("handles no exercises and no recap", () => {
    const message = buildDraftUserMessage("TEXT", {
      exercises: [],
      includeRecap: false,
      recapInstruction: ""
    });
    expect(message).toContain("Exercises: none");
    expect(message).toContain("Recap: none");
  });
});
