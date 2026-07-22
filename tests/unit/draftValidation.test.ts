import { describe, expect, it } from "vitest";
import { parseDraft } from "../../src/ai/draftValidation";
import { SAMPLE_DRAFT_JSON } from "../../src/ai/sampleDraft";

describe("parseDraft", () => {
  it("parses the built-in sample into a valid section", () => {
    const { section, errors } = parseDraft(SAMPLE_DRAFT_JSON);
    expect(errors).toEqual([]);
    expect(section).not.toBeNull();
    expect(section!.id).toBe("lesson");
    expect(section!.hero.title).toContain("Density");
    expect(section!.groups.length).toBeGreaterThanOrEqual(3);
  });

  it("strips markdown code fences before parsing", () => {
    const fenced = "```json\n{ \"hero\": { \"title\": \"X\" }, \"groups\": [] }\n```";
    // groups empty → treated as an error, but fence stripping must have worked to get there
    const { errors } = parseDraft(fenced);
    expect(errors.join(" ")).toMatch(/groups/);
  });

  it("reports an error for non-JSON input", () => {
    const { section, errors } = parseDraft("this is not json");
    expect(section).toBeNull();
    expect(errors[0]).toMatch(/not valid json/i);
  });

  it("drops unknown block types with a warning", () => {
    const raw = JSON.stringify({
      hero: { title: "T" },
      groups: [{ heading: "G", blocks: [{ type: "prose", body: ["hi"] }, { type: "hologram" }] }]
    });
    const { section, warnings } = parseDraft(raw);
    expect(section!.groups[0].blocks).toHaveLength(1);
    expect(warnings.join(" ")).toMatch(/hologram/);
  });

  it("repairs an out-of-range mcq answer index", () => {
    const raw = JSON.stringify({
      hero: { title: "T" },
      groups: [
        {
          heading: "Q",
          blocks: [
            { type: "mcq", questions: [{ id: "q1", prompt: "?", options: ["a", "b"], answer: 9 }] }
          ]
        }
      ]
    });
    const { section, warnings } = parseDraft(raw);
    const mcq = section!.groups[0].blocks[0] as { questions: { answer: number }[] };
    expect(mcq.questions[0].answer).toBe(0);
    expect(warnings.join(" ")).toMatch(/answer index/i);
  });

  it("fills in a default hero when fields are missing", () => {
    const raw = JSON.stringify({ groups: [{ blocks: [{ type: "prose", body: ["x"] }] }] });
    const { section } = parseDraft(raw);
    expect(section!.hero.eyebrow).toBe("Lesson");
    expect(section!.hero.title).toBe("Untitled lesson");
  });
});
