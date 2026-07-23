// Model choices for AI authoring. A teacher picks the tier per chapter — advanced models
// for complex subjects, cheaper ones for simple/text-light chapters.
export interface ModelOption {
  id: string;
  label: string;
  note: string;
}

export const MODEL_OPTIONS: ModelOption[] = [
  {
    id: "claude-opus-4-8",
    label: "Opus 4.8",
    note: "Most capable — complex chapters, best answer keys and diagrams."
  },
  {
    id: "claude-sonnet-5",
    label: "Sonnet 5",
    note: "Strong and cheaper — good for most chapters."
  },
  {
    id: "claude-haiku-4-5",
    label: "Haiku 4.5",
    note: "Fastest and cheapest — simple, text-light chapters."
  }
];

export const DEFAULT_MODEL = "claude-opus-4-8";

// Design seam for the future phased pipeline (built once generation runs through a server
// proxy): route each authoring phase to a model. Cheap models handle structure; the strong
// model handles the reasoning-heavy phases (correct answer keys, diagram SVGs). This is the
// per-phase routing the teacher asked about — data now, wired when phasing lands.
export type AuthoringPhase = "outline" | "draft" | "assessment" | "visual";

export const PHASE_MODEL_DEFAULTS: Record<AuthoringPhase, string> = {
  outline: "claude-sonnet-5",
  draft: "claude-sonnet-5",
  assessment: "claude-opus-4-8",
  visual: "claude-opus-4-8"
};
