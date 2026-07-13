// "Match the Microbe" data for Exercise 1. Each microbe is matched to the job it does,
// grouped into three levels by field (food & drink, farming & medicine, industry &
// environment). All facts come from the Grade 9 textbook, Chapter 1 (section 1.3.1).
import type { MicrobeCategoryId } from "./microbeGroups";

export type MicrobeField = "food" | "farm-med" | "industry-env";

export interface MicrobeMatch {
  id: string;
  microbe: string;
  emoji: string;
  job: string; // the application shown as the drop target
  fact: string; // one-line reason revealed when matched correctly
  field: MicrobeField;
  category: MicrobeCategoryId; // which group it belongs to (for the microscope view)
}

export interface MicrobeMatchLevel {
  id: MicrobeField;
  title: string;
  matchIds: string[];
}

export const microbeMatches: MicrobeMatch[] = [
  // ---- Level 1 · Food & drink ----
  {
    id: "yeast-bread",
    microbe: "Saccharomyces (yeast)",
    emoji: "🍞",
    job: "Bread & alcohol",
    fact: "Yeast (Saccharomyces cerevisiae) is used in the bakery industry and to produce alcohol.",
    field: "food",
    category: "fungi"
  },
  {
    id: "lactobacillus-yoghurt",
    microbe: "Lactobacillus bulgaricus",
    emoji: "🥛",
    job: "Yoghurt & curd",
    fact: "Lactobacillus turns lactose into lactic acid, making the acidic dairy products yoghurt and curd.",
    field: "food",
    category: "bacteria"
  },
  {
    id: "streptococcus-culture",
    microbe: "Streptococcus thermophilus",
    emoji: "🧀",
    job: "Dairy culture",
    fact: "Streptococcus thermophilus works with Lactobacillus as a culture in dairy products.",
    field: "food",
    category: "bacteria"
  },
  {
    id: "acetobacter-vinegar",
    microbe: "Acetobacter aceti",
    emoji: "🍶",
    job: "Vinegar",
    fact: "Acetobacter aceti is the bacterium used to produce vinegar.",
    field: "food",
    category: "bacteria"
  },

  // ---- Level 2 · Farming & medicine ----
  {
    id: "rhizobium-nitrogen",
    microbe: "Rhizobium",
    emoji: "🌱",
    job: "Nitrogen fixation",
    fact: "Rhizobium lives in the root nodules of legumes and fixes atmospheric nitrogen.",
    field: "farm-med",
    category: "bacteria"
  },
  {
    id: "azotobacter-biofertilizer",
    microbe: "Azotobacter",
    emoji: "🧪",
    job: "Bio-fertilizer",
    fact: "Azotobacter is a free-living nitrogen-fixing bacterium added to soil as a bio-fertilizer.",
    field: "farm-med",
    category: "bacteria"
  },
  {
    id: "bt-pest-control",
    microbe: "Bacillus thuringiensis",
    emoji: "🐛",
    job: "Biological pest control",
    fact: "Bacillus thuringiensis makes toxins used to control crop pests and dengue-mosquito larvae.",
    field: "farm-med",
    category: "bacteria"
  },
  {
    id: "penicillium-penicillin",
    microbe: "Penicillium notatum",
    emoji: "💊",
    job: "Penicillin antibiotic",
    fact: "Penicillium notatum produces penicillin, discovered by Alexander Fleming.",
    field: "farm-med",
    category: "fungi"
  },

  // ---- Level 3 · Industry & environment ----
  {
    id: "methanococcus-biogas",
    microbe: "Methanococcus",
    emoji: "🔥",
    job: "Biogas (methane)",
    fact: "Anaerobic bacteria such as Methanococcus produce biogas, which is mainly methane, from organic matter.",
    field: "industry-env",
    category: "bacteria"
  },
  {
    id: "acidithiobacillus-metal",
    microbe: "Acidithiobacillus ferrooxidans",
    emoji: "⛏️",
    job: "Metal extraction",
    fact: "Acidithiobacillus ferrooxidans extracts metals like copper and uranium by bio-leaching.",
    field: "industry-env",
    category: "bacteria"
  },
  {
    id: "pseudomonas-oil",
    microbe: "Pseudomonas",
    emoji: "🛢️",
    job: "Cleaning oil spills",
    fact: "Pseudomonas breaks down the hydrocarbons in an ocean oil layer — a form of bio-remediation.",
    field: "industry-env",
    category: "bacteria"
  },
  {
    id: "bacillus-fibre",
    microbe: "Bacillus corchorus",
    emoji: "🥥",
    job: "Separating plant fibres",
    fact: "Its pectinase enzyme digests pectate, separating fibres from coconut, hemp and other plants.",
    field: "industry-env",
    category: "bacteria"
  }
];

export const microbeMatchLevels: MicrobeMatchLevel[] = [
  {
    id: "food",
    title: "Level 1 · Food & drink",
    matchIds: [
      "yeast-bread",
      "lactobacillus-yoghurt",
      "streptococcus-culture",
      "acetobacter-vinegar"
    ]
  },
  {
    id: "farm-med",
    title: "Level 2 · Farming & medicine",
    matchIds: [
      "rhizobium-nitrogen",
      "azotobacter-biofertilizer",
      "bt-pest-control",
      "penicillium-penicillin"
    ]
  },
  {
    id: "industry-env",
    title: "Level 3 · Industry & environment",
    matchIds: [
      "methanococcus-biogas",
      "acidithiobacillus-metal",
      "pseudomonas-oil",
      "bacillus-fibre"
    ]
  }
];
