import type { ChapterContent, ContentSection } from "../schema";
import { electrolysisChapter } from "./electrolysis";
import { evolutionChapter } from "./evolution";

// Modules whose sections are driven by the content schema instead of bespoke components.
// As each existing chapter is migrated, add it here and delete its old course components.
export const schemaChapters: Record<string, ChapterContent> = {
  [evolutionChapter.moduleId]: evolutionChapter,
  [electrolysisChapter.moduleId]: electrolysisChapter
};

export function getChapterSection(
  moduleId: string,
  sectionId: string
): ContentSection | undefined {
  return schemaChapters[moduleId]?.sections.find((section) => section.id === sectionId);
}
