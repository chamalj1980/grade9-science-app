import type { ContentSection } from "../content/schema";

// Persistence for the Design Studio's working lesson draft. One draft for now, autosaved
// to localStorage; named multi-draft management and publishing into the live course come
// in a later slice.
const DRAFT_KEY = "grade9-design-draft";

export function emptyLesson(): ContentSection {
  return {
    id: "lesson",
    hero: {
      variant: "lesson",
      eyebrow: "Lesson",
      title: "Untitled lesson",
      intro: "A one-line introduction to hook the student."
    },
    groups: [{ heading: "New section", blocks: [] }]
  };
}

export function loadDraft(): ContentSection {
  if (typeof window === "undefined") {
    return emptyLesson();
  }
  try {
    const raw = window.localStorage.getItem(DRAFT_KEY);
    if (!raw) {
      return emptyLesson();
    }
    const parsed = JSON.parse(raw) as ContentSection;
    // Minimal shape guard so a corrupted store can't crash the editor.
    if (parsed && parsed.hero && Array.isArray(parsed.groups)) {
      return parsed;
    }
    return emptyLesson();
  } catch {
    return emptyLesson();
  }
}

export function saveDraft(section: ContentSection): void {
  if (typeof window === "undefined") {
    return;
  }
  window.localStorage.setItem(DRAFT_KEY, JSON.stringify(section));
}
