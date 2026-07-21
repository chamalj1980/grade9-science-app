// The full Grade 9 science course as a flat list of all 19 chapters, used by the home
// page (Discovery Deck). Nine chapters are already built as interactive modules and link
// to `modules.ts` via `moduleId`; the remaining ten are placeholders shown as
// "coming soon". Chapters are grouped into four subject areas for filtering.

export type Subject = "life" | "matter" | "energy" | "planet";

export interface SubjectMeta {
  id: Subject;
  name: string; // short label used on chips and tags
  full: string; // longer label
}

export const subjectOrder: Subject[] = ["life", "matter", "energy", "planet"];

export const subjects: Record<Subject, SubjectMeta> = {
  life: { id: "life", name: "Life", full: "Life & Living Things" },
  matter: { id: "matter", name: "Matter", full: "Matter & Materials" },
  energy: { id: "energy", name: "Energy", full: "Forces & Energy" },
  planet: { id: "planet", name: "Planet", full: "Earth & Space" }
};

// One art id per chapter — drives the colourful illustration in ChapterArt.tsx.
export type ChapterArtId =
  | "microbes"
  | "senses"
  | "pressure"
  | "heart"
  | "digestion"
  | "photosynthesis"
  | "flower"
  | "matter"
  | "atom"
  | "bond"
  | "ph"
  | "metal"
  | "motion"
  | "circuit"
  | "magnet"
  | "light"
  | "sound"
  | "eco"
  | "space"
  | "movement"
  | "evolution";

export interface Chapter {
  n: number;
  title: string;
  subject: Subject;
  blurb: string;
  art: ChapterArtId;
  // Set for chapters that are built as interactive modules; links to modules.ts.
  moduleId?: string;
}

export const chapters: Chapter[] = [
  {
    n: 1,
    title: "Applications of Micro-organisms",
    subject: "life",
    blurb: "Bacteria, fungi, protozoa, algae and viruses — and how microbes help us.",
    art: "microbes",
    moduleId: "micro-organisms"
  },
  {
    n: 2,
    title: "Eye and Ear",
    subject: "life",
    blurb: "How we see and hear — structure, focusing, defects and safe habits.",
    art: "senses",
    moduleId: "sensory-system"
  },
  {
    n: 3,
    title: "Nature and Properties of Matter",
    subject: "matter",
    blurb: "Elements, compounds and mixtures — and the atoms they are built from.",
    art: "atom",
    moduleId: "matter-properties"
  },
  {
    n: 4,
    title: "Basic Concepts Associated with Force",
    subject: "energy",
    blurb: "What a force can do, how we measure it, and how to draw it as a vector.",
    art: "motion",
    moduleId: "force-basics"
  },
  {
    n: 5,
    title: "Pressure Exerted by Solids",
    subject: "energy",
    blurb: "How force and contact area change the pressure a solid makes.",
    art: "pressure",
    moduleId: "pressure-solids"
  },
  {
    n: 6,
    title: "The Human Circulatory System",
    subject: "life",
    blurb: "The heart, blood vessels, blood components and safe transfusion.",
    art: "heart",
    moduleId: "circulatory-system"
  },
  {
    n: 7,
    title: "Plant Growth Substances",
    subject: "life",
    blurb: "The chemicals a plant makes to control its growth — and the man-made ones farmers use.",
    art: "flower",
    moduleId: "plant-growth"
  },
  {
    n: 8,
    title: "Support and Movements of Organisms",
    subject: "life",
    blurb: "How animals and plants move — muscles, joints, tropisms and the touchy Mimosa.",
    art: "movement",
    moduleId: "support-movement"
  },
  {
    n: 9,
    title: "The Evolutionary Process",
    subject: "life",
    blurb: "How the Earth and life began, the sequence of life, fossils and natural selection.",
    art: "evolution",
    moduleId: "evolution"
  },
  {
    n: 10,
    title: "Electrolysis",
    subject: "matter",
    blurb: "Using electricity to split compounds into their elements.",
    art: "ph"
  },
  {
    n: 11,
    title: "Density",
    subject: "matter",
    blurb: "Mass packed into a space — why some things float and others sink.",
    art: "metal"
  },
  {
    n: 12,
    title: "Bio-diversity",
    subject: "life",
    blurb: "The huge variety of living things, and why protecting it matters.",
    art: "flower"
  },
  {
    n: 13,
    title: "Artificial Environment and Green Concept",
    subject: "planet",
    blurb: "Building and living in ways that work with nature, not against it.",
    art: "photosynthesis"
  },
  {
    n: 14,
    title: "Reflection and Refraction of Waves",
    subject: "energy",
    blurb: "How light and sound bounce off and bend through different materials.",
    art: "light"
  },
  {
    n: 15,
    title: "Simple Machines",
    subject: "energy",
    blurb: "Levers, pulleys, wheels and ramps that make work easier.",
    art: "motion"
  },
  {
    n: 16,
    title: "Nanotechnology and its Applications",
    subject: "matter",
    blurb: "Science at the scale of atoms — and where we already use it.",
    art: "bond"
  },
  {
    n: 17,
    title: "Lightning Accidents",
    subject: "energy",
    blurb: "How lightning strikes, the damage it does, and how to stay safe.",
    art: "circuit"
  },
  {
    n: 18,
    title: "Natural Disasters",
    subject: "planet",
    blurb: "Floods, landslides and cyclones — and how we prepare for them.",
    art: "eco"
  },
  {
    n: 19,
    title: "Sustainable use of Natural Resources",
    subject: "planet",
    blurb: "Using water, soil, forests and energy without using them up.",
    art: "space"
  }
];
