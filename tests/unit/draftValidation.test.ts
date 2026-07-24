import { describe, expect, it } from "vitest";
import { parseDraft } from "../../src/ai/draftValidation";
import { SAMPLE_DRAFT_JSON } from "../../src/ai/sampleDraft";

describe("parseDraft — chapter shape", () => {
  it("parses the built-in sample into a full chapter", () => {
    const { draft, errors } = parseDraft(SAMPLE_DRAFT_JSON);
    expect(errors).toEqual([]);
    expect(draft).not.toBeNull();
    expect(draft!.title).toContain("Density");
    const kinds = draft!.sections.map((s) => s.kind);
    expect(kinds).toEqual(["lesson", "exercise", "exercise", "recap"]);
    expect(draft!.sections.every((s) => s.key.length > 0)).toBe(true);
  });

  it("wraps a legacy single-section draft as a one-lesson chapter", () => {
    const legacy = JSON.stringify({
      hero: { title: "Old lesson" },
      groups: [{ heading: "G", blocks: [{ type: "prose", body: ["hi"] }] }]
    });
    const { draft } = parseDraft(legacy);
    expect(draft!.sections).toHaveLength(1);
    expect(draft!.sections[0].kind).toBe("lesson");
    expect(draft!.title).toBe("Old lesson");
  });

  it("strips markdown code fences before parsing", () => {
    const fenced = "```json\n{ \"title\": \"X\", \"sections\": [] }\n```";
    const { errors } = parseDraft(fenced);
    expect(errors.join(" ")).toMatch(/empty/i);
  });

  it("reports an error for non-JSON input", () => {
    const { draft, errors } = parseDraft("this is not json");
    expect(draft).toBeNull();
    expect(errors[0]).toMatch(/not valid json/i);
  });

  it("defaults an unknown section kind to lesson, with a warning", () => {
    const raw = JSON.stringify({
      sections: [{ kind: "hologram", hero: { title: "T" }, groups: [] }]
    });
    const { draft, warnings } = parseDraft(raw);
    expect(draft!.sections[0].kind).toBe("lesson");
    expect(warnings.join(" ")).toMatch(/hologram/);
  });
});

describe("parseDraft — block repair", () => {
  function chapterWith(block: unknown) {
    return JSON.stringify({
      sections: [{ kind: "exercise", hero: { title: "E" }, groups: [{ blocks: [block] }] }]
    });
  }

  it("drops unknown block types with a warning", () => {
    const raw = chapterWith({ type: "teleporter" });
    const { draft, warnings } = parseDraft(raw);
    expect(draft!.sections[0].groups[0].blocks).toHaveLength(0);
    expect(warnings.join(" ")).toMatch(/teleporter/);
  });

  it("repairs an out-of-range mcq answer index", () => {
    const raw = chapterWith({
      type: "mcq",
      questions: [{ id: "q1", prompt: "?", options: ["a", "b"], answer: 9 }]
    });
    const { draft, warnings } = parseDraft(raw);
    const mcq = draft!.sections[0].groups[0].blocks[0] as { questions: { answer: number }[] };
    expect(mcq.questions[0].answer).toBe(0);
    expect(warnings.join(" ")).toMatch(/answer index/i);
  });

  it("reassigns a sortBins item pointing at an unknown bin", () => {
    const raw = chapterWith({
      type: "sortBins",
      bins: [{ id: "b1", title: "Floats" }, { id: "b2", title: "Sinks" }],
      items: [{ id: "i1", text: "Wood", binId: "nope" }]
    });
    const { draft, warnings } = parseDraft(raw);
    const sort = draft!.sections[0].groups[0].blocks[0] as { items: { binId: string }[] };
    expect(sort.items[0].binId).toBe("b1");
    expect(warnings.join(" ")).toMatch(/unknown bin/i);
  });

  it("fills in missing ids and defaults for orderTimeline rounds", () => {
    const raw = chapterWith({
      type: "orderTimeline",
      rounds: [{ order: [{ label: "First" }, { label: "Second" }] }]
    });
    const { draft } = parseDraft(raw);
    const order = draft!.sections[0].groups[0].blocks[0] as {
      rounds: { id: string; prompt: string; order: { id: string; emoji: string }[] }[];
    };
    expect(order.rounds[0].id).toBeTruthy();
    expect(order.rounds[0].prompt).toBeTruthy();
    expect(order.rounds[0].order[0].id).toBeTruthy();
    expect(order.rounds[0].order[0].emoji).toBeTruthy();
  });
});
