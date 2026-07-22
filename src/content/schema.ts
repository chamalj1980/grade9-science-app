// The content model for a chapter, expressed as data instead of bespoke JSX.
//
// A chapter is a list of SECTIONS (lesson / exercise / recap). A section is a list of
// GROUPS; each group renders as one <section className="lesson-block"> (the visual
// grouping unit, with an optional h3 heading) and holds a list of BLOCKS. Every block
// has a `type` that maps to a full-power React component in BlockRenderer.tsx — so
// interactivity is never flattened, only lifted out of the component into data.
//
// These TypeScript types ARE the schema: when content later moves into a database
// (Phase 2), the same shapes become JSON validated at runtime.
//
// Two kinds of block:
//   • presentational — prose, callout, cardGrid, sequenceStrip, termList, revealTabs,
//                      stepper. Some are interactive to *explore* (revealTabs, stepper)
//                      but are not scored.
//   • assessment     — orderTimeline, sortBins, mcq, markDone. These report progress up
//                      through useSectionProgress so a section's score/completion is the
//                      sum of its assessment blocks (exactly the old contract).

import type { SectionId, Theme } from "../types";

// Inline strings may contain **bold** spans, rendered by the richText helper.
export type RichText = string;

// ---- Presentational blocks ----

export interface ProseBlock {
  type: "prose";
  body: RichText[]; // one paragraph per entry
}

// A highlighted note. `key` = the lesson-key emphasis, `help` = muted helper line,
// `feature` = an emoji + text card (the Darwin-style highlight).
export interface CalloutBlock {
  type: "callout";
  variant?: "key" | "help" | "feature";
  emoji?: string;
  body: RichText;
}

// A grid of cards. `variant` chooses the layout/skin (mapped to CSS in the renderer):
//   badges — two wide cards, each with an optional coloured tag
//   facts  — emoji-left rows with a title + detail
//   icons  — compact icon-over-text cards
//   living — like icons, tuned for the living-fossils gallery
//   plain  — title + detail, no emoji
export interface CardGridBlock {
  type: "cardGrid";
  heading?: string; // optional h4 sub-heading within the group
  intro?: RichText;
  variant: "badges" | "facts" | "icons" | "living" | "plain";
  cards: {
    emoji?: string;
    title: string;
    body: RichText;
    badge?: string; // e.g. "modern theory"
    badgeTone?: string; // extra class on the badge, e.g. "first-scientific" | "modern"
  }[];
}

// An animated ordered strip (the "march of life").
export interface SequenceStripBlock {
  type: "sequenceStrip";
  intro?: RichText;
  items: { id: string; emoji: string; label: string }[];
  note?: RichText;
}

// A definitions list (key words).
export interface TermListBlock {
  type: "termList";
  terms: { term: string; meaning: string }[];
}

// ---- Visual blocks ----

// An SVG illustration with an optional caption. Supply EITHER `art` (an id from the
// hand-drawn registry in src/content/illustrations.tsx) OR `svg` (inline SVG markup —
// the form an AI author or teacher produces, stored as data). Inline markup is sanitized
// before rendering; give it an `alt` for accessibility. `size` caps the rendered width.
export interface FigureBlock {
  type: "figure";
  art?: string; // registry illustration id
  svg?: string; // OR inline SVG markup (authored/AI-generated)
  alt?: string; // accessibility label for inline svg
  heading?: string; // optional h4 sub-heading
  caption?: RichText;
  size?: "small" | "medium" | "large"; // default medium
}

// ---- Interactive-to-explore blocks (not scored) ----

// An illustration with clickable hotspots; tapping a marker reveals its label + detail.
// The visual analogue of revealTabs — great for diagrams, apparatus and specimens.
// `x`/`y` are percentages of the illustration box (0–100).
export interface HotspotDiagramBlock {
  type: "hotspotDiagram";
  art: string; // base illustration id
  heading?: string;
  intro?: RichText;
  defaultId?: string;
  hotspots: {
    id: string;
    x: number;
    y: number;
    emoji?: string;
    label: string;
    body?: RichText;
  }[];
}

// Button row that reveals a detail panel — the life-theory explorer.
export interface RevealTabsBlock {
  type: "revealTabs";
  defaultId?: string;
  ariaLabel?: string;
  tabs: {
    id: string;
    emoji?: string;
    label: string; // button caption
    title: string; // panel heading
    badge?: string; // verdict pill text
    badgeTone?: "yes" | "no"; // verdict pill colour
    lead?: RichText; // emphasised claim line
    body?: RichText; // supporting detail
  }[];
}

// A step-through explainer with dots + a Next button (fossil formation).
export interface StepperBlock {
  type: "stepper";
  steps: { emoji: string; title: string; body: RichText }[];
}

// ---- Assessment blocks (scored; report progress) ----

// Tap-to-place ordering across one or more rounds/levels. `order` is the CORRECT
// sequence, earliest first; the component shuffles it for the pool.
export interface OrderTimelineBlock {
  type: "orderTimeline";
  rounds: {
    id: string;
    title: string;
    prompt: string;
    order: { id: string; emoji: string; label: string }[];
  }[];
  successNote?: RichText;
}

// Sort items into labelled bins; `binId` on each item is its correct bin.
export interface SortBinsBlock {
  type: "sortBins";
  title?: string; // header caption (e.g. "Part A · True or false?")
  wrapperClass?: string; // optional extra class for theme accents (e.g. "evolution-bins")
  bins: { id: string; title: string; emoji: string; hint?: string }[];
  items: { id: string; text: string; binId: string; reason?: RichText }[];
}

// An inline multiple-choice quiz; `answer` is the 0-based correct option index.
export interface McqBlock {
  type: "mcq";
  title?: string; // header caption (e.g. "Part B · Quick recap quiz")
  questions: { id: string; prompt: string; options: string[]; answer: number }[];
}

// The "mark this section done" finisher.
export interface MarkDoneBlock {
  type: "markDone";
  prompt?: RichText;
  label?: string;
  doneLabel?: string;
}

export type Block =
  | ProseBlock
  | CalloutBlock
  | CardGridBlock
  | SequenceStripBlock
  | TermListBlock
  | FigureBlock
  | RevealTabsBlock
  | StepperBlock
  | HotspotDiagramBlock
  | OrderTimelineBlock
  | SortBinsBlock
  | McqBlock
  | MarkDoneBlock;

export type BlockType = Block["type"];

// ---- Section & chapter ----

export interface SectionHero {
  eyebrow: string;
  title: string;
  intro?: RichText;
  // "lesson" = big hero with optional decoration; "exercise" = plain hero;
  // "intro" = the compact playground-intro used by sort/quiz exercises.
  variant?: "lesson" | "exercise" | "intro";
  decoration?: string[]; // floating emoji for the lesson hero swirl
}

// One <section> wrapper grouping a heading + several blocks.
export interface ContentGroup {
  id?: string; // anchors aria-labelledby to the heading
  heading?: string; // h3 heading
  className?: string; // defaults to "lesson-block"
  blocks: Block[];
}

export interface ContentSection {
  id: SectionId;
  hero: SectionHero;
  wrapperClass?: string; // article class, defaults to "lesson"
  groups: ContentGroup[];
}

export interface ChapterContent {
  moduleId: string;
  theme: Theme;
  sections: ContentSection[];
}
