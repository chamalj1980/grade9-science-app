import type { TestPack, TestQuestion } from "../data/testModel";

// Local store for teacher-authored / imported test packs. Everything lives in
// localStorage on this device; packs move between devices as exported JSON files.

export const testBankStorageKey = "quiz-arena-packs";

export function makeId(prefix = "pack"): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

// ---- pure collection helpers ----

export function upsertPack(packs: TestPack[], pack: TestPack): TestPack[] {
  const index = packs.findIndex((candidate) => candidate.id === pack.id);
  if (index === -1) {
    return [...packs, pack];
  }
  const next = [...packs];
  next[index] = pack;
  return next;
}

export function removePack(packs: TestPack[], id: string): TestPack[] {
  return packs.filter((pack) => pack.id !== id);
}

// ---- validation (imported JSON is untrusted) ----

function isQuestion(value: unknown): value is TestQuestion {
  if (!value || typeof value !== "object") {
    return false;
  }
  const question = value as Record<string, unknown>;
  if (typeof question.id !== "string" || typeof question.prompt !== "string") {
    return false;
  }
  if (typeof question.marks !== "number" || !Number.isFinite(question.marks)) {
    return false;
  }

  switch (question.type) {
    case "mcq":
      return (
        Array.isArray(question.options) &&
        question.options.length >= 2 &&
        question.options.every((option) => typeof option === "string") &&
        typeof question.answer === "number" &&
        question.answer >= 0 &&
        question.answer < question.options.length
      );
    case "truefalse":
      return typeof question.answer === "boolean";
    case "short":
      return (
        Array.isArray(question.accepted) &&
        question.accepted.every((item) => typeof item === "string")
      );
    case "essay":
      return typeof question.modelAnswer === "string";
    default:
      return false;
  }
}

export function isValidPack(value: unknown): value is TestPack {
  if (!value || typeof value !== "object") {
    return false;
  }
  const pack = value as Record<string, unknown>;
  return (
    typeof pack.id === "string" &&
    typeof pack.title === "string" &&
    (pack.kind === "module" || pack.kind === "term") &&
    Array.isArray(pack.questions) &&
    pack.questions.length > 0 &&
    pack.questions.every(isQuestion)
  );
}

export type ImportResult =
  | { ok: true; pack: TestPack }
  | { ok: false; error: string };

// Parse a pack from exported JSON, giving a friendly message when it is not usable.
export function parsePackJson(json: string): ImportResult {
  let parsed: unknown;
  try {
    parsed = JSON.parse(json);
  } catch {
    return { ok: false, error: "That file isn't valid JSON." };
  }

  if (!isValidPack(parsed)) {
    return {
      ok: false,
      error: "That file isn't a test pack, or some questions are missing fields."
    };
  }

  // Re-id on import so an imported pack never overwrites an existing one.
  return {
    ok: true,
    pack: { ...parsed, id: makeId(), source: "imported" }
  };
}

export function exportPackJson(pack: TestPack): string {
  return JSON.stringify(pack, null, 2);
}

// ---- persistence ----

export function loadPacks(): TestPack[] {
  if (typeof window === "undefined") {
    return [];
  }
  const saved = window.localStorage.getItem(testBankStorageKey);
  if (!saved) {
    return [];
  }
  try {
    const parsed = JSON.parse(saved) as unknown;
    return Array.isArray(parsed) ? parsed.filter(isValidPack) : [];
  } catch {
    return [];
  }
}

export function savePacks(packs: TestPack[]): void {
  if (typeof window === "undefined") {
    return;
  }
  window.localStorage.setItem(testBankStorageKey, JSON.stringify(packs));
}

// Trigger a download of the pack as a .json file (client-side only).
export function downloadPack(pack: TestPack): void {
  const blob = new Blob([exportPackJson(pack)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${pack.title.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
