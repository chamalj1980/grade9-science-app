// Section identifiers used across learning modules. Not every module uses every id
// (e.g. only the circulatory module has a "simulation" section); progress and nav are
// always driven by each module's own `sections` list.
export type SectionId =
  | "lesson"
  | "simulation"
  | "exercise-1"
  | "exercise-2"
  | "recap";

// The kind of experience a section renders. Used by the section registry in App.tsx
// and mirrors the content model in the spec (section 23) so new chapters can be added later.
export type SectionType =
  | "lesson"
  | "simulation"
  | "mixed-exercise"
  | "labeling"
  | "recap";

export interface LearningSection {
  id: SectionId;
  navLabel: string;
  title: string;
  eyebrow: string;
  summary: string;
  type: SectionType;
}

export interface LearningModule {
  id: string;
  chapter: number;
  title: string;
  shortTitle: string;
  summary: string;
  icon: string;
  theme: "pressure" | "circulatory";
  sections: LearningSection[];
}
