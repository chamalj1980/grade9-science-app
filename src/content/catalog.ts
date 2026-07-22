// The block catalog: one entry per block type, describing what it does, when to reach
// for it, and a small working sample. This powers the Block Gallery (admin/teacher
// reference + insert menu) and is the same palette an AI authoring pass would select
// from. Keep an entry here in sync whenever a block type is added to schema.ts.

import type { Block, BlockType } from "./schema";

export type BlockCategory = "presentational" | "interactive" | "assessment";
export type BlockDomain = "general" | "science" | "math" | "language";

export interface BlockCatalogEntry {
  type: BlockType;
  name: string;
  category: BlockCategory;
  scored: boolean;
  domains: BlockDomain[];
  description: string; // what it does
  whenToUse: string; // the authoring heuristic
  previewClass?: string; // container class so the sample renders in context
  sample: Block; // a small, working instance rendered live in the gallery
}

export const blockCatalog: BlockCatalogEntry[] = [
  // ---- Presentational ----
  {
    type: "prose",
    name: "Prose",
    category: "presentational",
    scored: false,
    domains: ["general"],
    description: "Plain paragraphs with **bold** emphasis for key terms.",
    whenToUse: "A narrative explanation — the connective text of a lesson.",
    sample: {
      type: "prose",
      body: [
        "Water is made of **hydrogen** and **oxygen**. It covers most of the Earth's surface and is essential for all living things."
      ]
    }
  },
  {
    type: "callout",
    name: "Callout",
    category: "presentational",
    scored: false,
    domains: ["general"],
    description:
      "A highlighted note. Variants: key (emphasis), help (muted tip), feature (emoji card).",
    whenToUse: "The one fact that must stick, a hint, or a spotlight on a person/idea.",
    sample: {
      type: "callout",
      variant: "key",
      body: "**Remember:** pressure = force ÷ area (P = F / A)."
    }
  },
  {
    type: "cardGrid",
    name: "Card grid",
    category: "presentational",
    scored: false,
    domains: ["general"],
    description:
      "A grid of cards. Variants: badges, facts, icons, living, plain — different skins.",
    whenToUse: "Comparing or listing 2–6 related things side by side.",
    sample: {
      type: "cardGrid",
      variant: "facts",
      cards: [
        { emoji: "🧊", title: "Solid", body: "Keeps a fixed shape and volume." },
        { emoji: "💧", title: "Liquid", body: "Fixed volume, takes its container's shape." },
        { emoji: "💨", title: "Gas", body: "Spreads to fill all the space it can." }
      ]
    }
  },
  {
    type: "sequenceStrip",
    name: "Sequence strip",
    category: "presentational",
    scored: false,
    domains: ["general", "science"],
    description: "An animated ordered strip that displays a sequence, earliest first.",
    whenToUse: "Showing a process or timeline you want students to read, not solve.",
    sample: {
      type: "sequenceStrip",
      items: [
        { id: "egg", emoji: "🥚", label: "Egg" },
        { id: "larva", emoji: "🐛", label: "Larva" },
        { id: "pupa", emoji: "🛡️", label: "Pupa" },
        { id: "adult", emoji: "🦋", label: "Butterfly" }
      ],
      note: "The life cycle of a butterfly."
    }
  },
  {
    type: "termList",
    name: "Term list",
    category: "presentational",
    scored: false,
    domains: ["general", "language"],
    description: "A definitions list pairing each term with its meaning.",
    whenToUse: "A glossary or set of key words to learn.",
    sample: {
      type: "termList",
      terms: [
        { term: "Atom", meaning: "The smallest unit of an element." },
        { term: "Molecule", meaning: "Two or more atoms chemically joined together." }
      ]
    }
  },
  {
    type: "figure",
    name: "Figure",
    category: "presentational",
    scored: false,
    domains: ["general", "science"],
    description:
      "An SVG illustration with an optional caption — either a library asset or inline AI/teacher-authored SVG.",
    whenToUse: "A diagram, scene or specimen that a photo or drawing explains best.",
    sample: {
      type: "figure",
      art: "tree-of-life",
      caption: "The tree of life branching from a common ancestor."
    }
  },

  // ---- Interactive (explore, not scored) ----
  {
    type: "revealTabs",
    name: "Reveal tabs",
    category: "interactive",
    scored: false,
    domains: ["general", "science"],
    description: "A button row; clicking one reveals its detail panel and optional badge.",
    whenToUse: "Competing options, theories or categories explored one at a time.",
    sample: {
      type: "revealTabs",
      defaultId: "solid",
      ariaLabel: "States of matter",
      tabs: [
        {
          id: "solid",
          emoji: "🧊",
          label: "Solid",
          title: "Solid",
          badge: "fixed shape",
          badgeTone: "yes",
          lead: "Particles are packed tightly in a regular pattern.",
          body: "They vibrate in place, so a solid keeps its shape and volume."
        },
        {
          id: "liquid",
          emoji: "💧",
          label: "Liquid",
          title: "Liquid",
          lead: "Particles are close but can slide past each other.",
          body: "A liquid keeps its volume but takes the shape of its container."
        }
      ]
    }
  },
  {
    type: "stepper",
    name: "Stepper",
    category: "interactive",
    scored: false,
    domains: ["general", "science"],
    description: "A step-through walkthrough with dots and a Next button.",
    whenToUse: "A procedure or process to move through one stage at a time.",
    sample: {
      type: "stepper",
      steps: [
        { emoji: "🫗", title: "Fill the beaker", body: "Pour in 100 ml of water." },
        { emoji: "🔥", title: "Heat gently", body: "Warm it until small bubbles form." },
        { emoji: "☁️", title: "Observe", body: "Watch the water turn into vapour." }
      ]
    }
  },
  {
    type: "hotspotDiagram",
    name: "Hotspot diagram",
    category: "interactive",
    scored: false,
    domains: ["general", "science"],
    description: "An illustration with clickable markers; tapping one reveals its detail.",
    whenToUse: "Label the parts of a diagram, apparatus or specimen — explore by tapping.",
    previewClass: "lesson-block",
    sample: {
      type: "hotspotDiagram",
      art: "rock-strata",
      intro: "Tap a fossil to see how deep it lies.",
      hotspots: [
        { id: "leaf", x: 25, y: 26, emoji: "🍃", label: "Leaf — young layer", body: "Near the top, so young." },
        { id: "fish", x: 32, y: 59, emoji: "🐟", label: "Fish", body: "Deeper, so older." },
        { id: "trilobite", x: 38, y: 92, emoji: "🐛", label: "Trilobite — oldest", body: "At the bottom, so the oldest." }
      ]
    }
  },

  // ---- Assessment (scored) ----
  {
    type: "orderTimeline",
    name: "Order timeline",
    category: "assessment",
    scored: true,
    domains: ["general", "science", "math"],
    description:
      "Tap-to-place ordering across rounds. Auto-checks; ticks each slot; tracks progress.",
    whenToUse: "“Put these in the right order” — sequences, sizes, steps, magnitudes.",
    sample: {
      type: "orderTimeline",
      successNote: "🎉 Correct order!",
      rounds: [
        {
          id: "size",
          title: "Order by size",
          prompt: "Smallest first.",
          order: [
            { id: "atom", emoji: "⚛️", label: "Atom" },
            { id: "cell", emoji: "🦠", label: "Cell" },
            { id: "organ", emoji: "❤️", label: "Organ" },
            { id: "body", emoji: "🧍", label: "Whole body" }
          ]
        }
      ]
    }
  },
  {
    type: "sortBins",
    name: "Sort into bins",
    category: "assessment",
    scored: true,
    domains: ["general", "science", "language"],
    description:
      "Sort item cards into labelled bins (drag or tap). Correct cards lock with a reason.",
    whenToUse: "Classify, group, or judge true/false. Two or more categories.",
    previewClass: "sort-panel",
    sample: {
      type: "sortBins",
      title: "Sort the materials",
      bins: [
        { id: "metal", title: "Metal", emoji: "🔩", hint: "conducts electricity" },
        { id: "nonmetal", title: "Non-metal", emoji: "🪵", hint: "usually an insulator" }
      ],
      items: [
        { id: "copper", text: "Copper", binId: "metal", reason: "Copper is a metal." },
        { id: "wood", text: "Wood", binId: "nonmetal", reason: "Wood is a non-metal." },
        { id: "iron", text: "Iron", binId: "metal", reason: "Iron is a metal." }
      ]
    }
  },
  {
    type: "mcq",
    name: "Multiple choice",
    category: "assessment",
    scored: true,
    domains: ["general", "science", "math", "language"],
    description: "An inline multiple-choice quiz. Each question locks and colours on answer.",
    whenToUse: "Recall and recognition checks — the classic quiz question.",
    sample: {
      type: "mcq",
      title: "Check yourself",
      questions: [
        {
          id: "q1",
          prompt: "What is the chemical formula for water?",
          options: ["H₂O", "CO₂", "O₂", "NaCl"],
          answer: 0
        }
      ]
    }
  },
  {
    type: "markDone",
    name: "Mark done",
    category: "assessment",
    scored: false,
    domains: ["general"],
    description: "A completion button that flips a lesson section to “done”.",
    whenToUse: "The end of a lesson, to gate completion.",
    previewClass: "lesson-finish",
    sample: {
      type: "markDone",
      prompt: "Finished reading this lesson?",
      label: "Mark as done",
      doneLabel: "Done ✅"
    }
  }
];

// Blocks not built yet — the subject-specific roadmap. Shown in the gallery so admins
// can see where the library is headed. Promote one of these to a real block by adding
// its component + schema type + catalog entry above.
export interface PlannedBlock {
  name: string;
  domain: BlockDomain;
  description: string;
}

export const plannedBlocks: PlannedBlock[] = [
  // General
  { name: "Video", domain: "general", description: "An embedded lesson video clip." },
  { name: "Table", domain: "general", description: "Rows and columns of structured data." },
  { name: "Accordion", domain: "general", description: "Collapsible FAQ-style sections." },
  { name: "Flashcards", domain: "general", description: "Flip cards for self-testing recall." },
  { name: "Match pairs", domain: "general", description: "Draw lines between matching items." },
  // Science
  { name: "Simulation", domain: "science", description: "Slider-driven interactive model (like the heart/pressure sims)." },
  { name: "Data chart", domain: "science", description: "Plot and read experimental data." },
  { name: "Classification tree", domain: "science", description: "Branch organisms/matter into groups." },
  // Mathematics
  { name: "Equation", domain: "math", description: "Rendered LaTeX/Math notation." },
  { name: "Worked solution", domain: "math", description: "Reveal a solution step by step." },
  { name: "Numeric input", domain: "math", description: "Type an answer, checked with tolerance." },
  { name: "Interactive graph", domain: "math", description: "Drag points, plot functions." },
  { name: "Number line", domain: "math", description: "Place values on a number line." },
  // Language
  { name: "Audio play", domain: "language", description: "Listen to a word, phrase or passage." },
  { name: "Cloze", domain: "language", description: "Fill in the blanks in a passage." },
  { name: "Sentence order", domain: "language", description: "Arrange words into a correct sentence." },
  { name: "Vocab flashcards", domain: "language", description: "Word ↔ meaning, with the medium's script." },
  { name: "Record", domain: "language", description: "Record and check pronunciation." }
];
