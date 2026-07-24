import type {
  BlockType,
  ContentGroup,
  ContentSection,
  SectionHero
} from "../../content/schema";
import type { SectionId } from "../../types";

// The Design Studio authors a CHAPTER draft: an ordered list of sections of different
// kinds. This editor model is intentionally decoupled from the app's fixed `SectionId`
// union so a chapter can hold N exercises. Publishing a draft into the live course (which
// reconciles with SectionId) is a later slice.
export type SectionKind = "lesson" | "exercise" | "recap";

export interface EditorSection {
  key: string; // stable id within the editor
  kind: SectionKind;
  label: string; // nav label, e.g. "Exercise 1"
  hero: SectionHero;
  wrapperClass?: string;
  groups: ContentGroup[];
}

export interface ChapterDraft {
  title: string;
  sections: EditorSection[];
}

export const sectionKindLabel: Record<SectionKind, string> = {
  lesson: "Lesson",
  exercise: "Exercise",
  recap: "Recap"
};

// Which blocks each section kind offers in its palette. Only block types with an edit form
// appear here; the renderer supports more, added as their forms are built.
export const PALETTE_BY_KIND: Record<SectionKind, BlockType[]> = {
  lesson: ["prose", "callout", "cardGrid", "figure", "mcq"],
  exercise: ["mcq", "sortBins", "orderTimeline"],
  recap: ["termList", "prose", "callout"]
};

// A representative valid SectionId per kind, used only so the live preview can render an
// EditorSection through the real SchemaSection (the id doesn't affect rendering).
const PREVIEW_ID: Record<SectionKind, SectionId> = {
  lesson: "lesson",
  exercise: "exercise-1",
  recap: "recap"
};

export function toContentSection(section: EditorSection): ContentSection {
  return {
    id: PREVIEW_ID[section.kind],
    hero: section.hero,
    wrapperClass: section.wrapperClass,
    groups: section.groups
  };
}
