import type { ChapterDraft, EditorSection, SectionKind } from "../components/design/types";
import { uid } from "../components/design/starters";

// Persistence for the Design Studio's working CHAPTER draft (lesson + exercises + recap).
// One draft for now, autosaved to localStorage; named multi-draft management and publishing
// into the live course come in a later slice.
const DRAFT_KEY = "grade9-design-draft";

const KIND_DEFAULTS: Record<SectionKind, { eyebrow: string; title: string; intro: string; heading?: string }> = {
  lesson: {
    eyebrow: "Lesson",
    title: "Untitled lesson",
    intro: "A one-line introduction to hook the student.",
    heading: "New section"
  },
  exercise: {
    eyebrow: "Exercise",
    title: "Untitled exercise",
    intro: "Try this — then check your answers."
  },
  recap: {
    eyebrow: "Recap",
    title: "Recap",
    intro: "The key points in one place for quick revision.",
    heading: "Key points"
  }
};

export function starterSection(kind: SectionKind, label: string): EditorSection {
  const defaults = KIND_DEFAULTS[kind];
  return {
    key: uid("sec"),
    kind,
    label,
    hero: {
      variant: kind === "exercise" ? "exercise" : "lesson",
      eyebrow: defaults.eyebrow,
      title: defaults.title,
      intro: defaults.intro
    },
    groups: [{ heading: defaults.heading, blocks: [] }]
  };
}

export function emptyChapter(): ChapterDraft {
  return { title: "Untitled chapter", sections: [starterSection("lesson", "Lesson")] };
}

export function loadDraft(): ChapterDraft {
  if (typeof window === "undefined") {
    return emptyChapter();
  }
  try {
    const raw = window.localStorage.getItem(DRAFT_KEY);
    if (!raw) {
      return emptyChapter();
    }
    const parsed = JSON.parse(raw) as Record<string, unknown>;

    // Current shape: a ChapterDraft with a `sections` array of EditorSections.
    if (parsed && Array.isArray(parsed.sections)) {
      return parsed as unknown as ChapterDraft;
    }

    // Legacy shape: a single ContentSection ({ hero, groups }). Wrap it as a one-lesson
    // chapter so an in-progress draft isn't lost.
    if (parsed && parsed.hero && Array.isArray(parsed.groups)) {
      const hero = parsed.hero as EditorSection["hero"];
      return {
        title: hero.title || "Untitled chapter",
        sections: [
          {
            key: uid("sec"),
            kind: "lesson",
            label: "Lesson",
            hero,
            wrapperClass: parsed.wrapperClass as string | undefined,
            groups: parsed.groups as EditorSection["groups"]
          }
        ]
      };
    }

    return emptyChapter();
  } catch {
    return emptyChapter();
  }
}

export function saveDraft(draft: ChapterDraft): void {
  if (typeof window === "undefined") {
    return;
  }
  window.localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
}
