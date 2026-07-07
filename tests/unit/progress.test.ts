import { describe, expect, it } from "vitest";
import { modules } from "../../src/data/modules";
import {
  calculateModuleProgress,
  calculateOverallProgress,
  createInitialProgress,
  getRevisionSuggestions,
  getSectionFraction,
  markSectionViewed,
  normalizeProgress,
  updateSectionProgress
} from "../../src/utils/progress";

const pressure = modules.find((module) => module.id === "pressure-solids")!;
const circulatory = modules.find((module) => module.id === "circulatory-system")!;

describe("progress utilities", () => {
  it("starts every module at zero percent", () => {
    const progress = createInitialProgress(modules);

    expect(calculateModuleProgress(pressure, progress["pressure-solids"])).toBe(0);
    expect(
      calculateModuleProgress(circulatory, progress["circulatory-system"])
    ).toBe(0);
    expect(calculateOverallProgress(modules, progress)).toBe(0);
  });

  it("averages progress over each module's own sections", () => {
    // Pressure has 4 sections; circulatory has 5 (it adds a 3D simulation section).
    expect(pressure.sections).toHaveLength(4);
    expect(circulatory.sections).toHaveLength(5);
  });

  it("treats a viewed section as partial and a completed section as full", () => {
    let progress = createInitialProgress(modules);
    progress = markSectionViewed(progress, "pressure-solids", "lesson");

    // One of four sections merely viewed -> 0.3 / 4 = 7.5% -> 8%.
    expect(calculateModuleProgress(pressure, progress["pressure-solids"])).toBe(8);

    progress = updateSectionProgress(progress, "pressure-solids", "lesson", {
      completed: true
    });

    // One of four sections fully complete -> 1 / 4 = 25%.
    expect(calculateModuleProgress(pressure, progress["pressure-solids"])).toBe(25);
  });

  it("gives partial credit from an exercise score", () => {
    let progress = createInitialProgress(modules);
    progress = updateSectionProgress(progress, "pressure-solids", "exercise-1", {
      score: 2,
      total: 3
    });

    expect(getSectionFraction(progress["pressure-solids"]["exercise-1"])).toBeCloseTo(
      2 / 3
    );
  });

  it("never lowers a saved score or streak", () => {
    let progress = createInitialProgress(modules);
    progress = updateSectionProgress(progress, "pressure-solids", "exercise-2", {
      score: 8,
      total: 10,
      streak: 4
    });
    progress = updateSectionProgress(progress, "pressure-solids", "exercise-2", {
      score: 3,
      streak: 1
    });

    expect(progress["pressure-solids"]["exercise-2"].score).toBe(8);
    expect(progress["pressure-solids"]["exercise-2"].streak).toBe(4);
  });

  it("does not downgrade a completed section when viewed again", () => {
    let progress = createInitialProgress(modules);
    progress = updateSectionProgress(progress, "pressure-solids", "recap", {
      completed: true
    });
    progress = markSectionViewed(progress, "pressure-solids", "recap");

    expect(progress["pressure-solids"].recap.status).toBe("completed");
  });

  it("normalizes unknown modules and malformed section values", () => {
    const progress = normalizeProgress(modules, {
      "pressure-solids": {
        lesson: { status: "completed", score: 1, total: 1, streak: 0 },
        "exercise-1": { status: "banana", score: -5, total: 3, streak: 2 },
        recap: "nope"
      },
      unknown: { lesson: { status: "completed" } }
    });

    expect(progress["pressure-solids"].lesson.status).toBe("completed");
    // Bad status falls back to not-started, negative score clamped to 0.
    expect(progress["pressure-solids"]["exercise-1"].status).toBe("not-started");
    expect(progress["pressure-solids"]["exercise-1"].score).toBe(0);
    expect(progress["pressure-solids"]["exercise-1"].streak).toBe(2);
    expect(progress["pressure-solids"].recap.status).toBe("not-started");
    expect(progress["circulatory-system"].lesson.status).toBe("not-started");
    expect(progress).not.toHaveProperty("unknown");
  });

  it("suggests the first unfinished section per module", () => {
    let progress = createInitialProgress(modules);
    progress = updateSectionProgress(progress, "pressure-solids", "lesson", {
      completed: true
    });

    const suggestions = getRevisionSuggestions(modules, progress);
    const pressureSuggestion = suggestions.find(
      (item) => item.moduleId === "pressure-solids"
    );

    expect(pressureSuggestion?.sectionId).toBe("exercise-1");
    expect(suggestions).toHaveLength(2);
  });
});
