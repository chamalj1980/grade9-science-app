// The full Grade 9 science course as a flat list of all 19 chapters, used by the home
// page (Discovery Deck). Four chapters are already built as interactive modules and link
// to `modules.ts` via `moduleId`; the remaining fifteen are placeholders shown as
// "coming soon". Chapters are grouped into four subject areas for filtering.
//
// NOTE: the titles and subject grouping of the not-yet-built chapters are a proposed
// arrangement — swap in the official syllabus names/order when confirmed.

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
  | "space";

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
    title: "Reproduction in Plants",
    subject: "life",
    blurb: "Flowers, pollination, seeds and how new plants begin.",
    art: "flower"
  },
  {
    n: 8,
    title: "Classification of Matter",
    subject: "matter",
    blurb: "Elements, compounds and mixtures all around us.",
    art: "matter"
  },
  {
    n: 9,
    title: "Atomic Structure",
    subject: "matter",
    blurb: "Inside the atom — protons, neutrons and electron shells.",
    art: "atom"
  },
  {
    n: 10,
    title: "Chemical Bonding",
    subject: "matter",
    blurb: "How atoms join together into ionic and covalent bonds.",
    art: "bond"
  },
  {
    n: 11,
    title: "Acids, Bases and Salts",
    subject: "matter",
    blurb: "The pH scale, indicators and neutralisation reactions.",
    art: "ph"
  },
  {
    n: 12,
    title: "Metals and Non-metals",
    subject: "matter",
    blurb: "Their properties, reactions and everyday uses.",
    art: "metal"
  },
  {
    n: 13,
    title: "Force and Motion",
    subject: "energy",
    blurb: "Speed, acceleration and Newton's ideas about motion.",
    art: "motion"
  },
  {
    n: 14,
    title: "Electricity and Circuits",
    subject: "energy",
    blurb: "Current, voltage, resistance and simple circuits.",
    art: "circuit"
  },
  {
    n: 15,
    title: "Magnetism",
    subject: "energy",
    blurb: "Magnets, magnetic fields and electromagnets.",
    art: "magnet"
  },
  {
    n: 16,
    title: "Light and Reflection",
    subject: "energy",
    blurb: "Rays, mirrors, refraction and how a prism makes a rainbow.",
    art: "light"
  },
  {
    n: 17,
    title: "Sound and Waves",
    subject: "energy",
    blurb: "Vibrations, pitch, loudness and how sound travels.",
    art: "sound"
  },
  {
    n: 18,
    title: "Ecosystems and Environment",
    subject: "planet",
    blurb: "Food chains, habitats and protecting the natural world.",
    art: "eco"
  },
  {
    n: 19,
    title: "The Solar System",
    subject: "planet",
    blurb: "The Sun, planets, moons and our place in space.",
    art: "space"
  }
];
