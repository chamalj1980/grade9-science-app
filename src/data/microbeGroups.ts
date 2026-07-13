// The five micro-organism categories from the Grade 9 textbook (Chapter 1, Table 1.1).
// Used by the lesson's category explorer and by the classification content. Scientific
// names are kept exactly as the textbook spells them; the textbook notes memorising the
// names is not required, so they appear as examples only.
export type MicrobeCategoryId =
  | "bacteria"
  | "fungi"
  | "protozoa"
  | "algae"
  | "virus";

export interface MicrobeExample {
  name: string;
  note: string;
}

export interface MicrobeGroup {
  id: MicrobeCategoryId;
  name: string;
  emoji: string;
  tagline: string;
  characteristics: string[];
  examples: MicrobeExample[];
}

export const microbeGroups: MicrobeGroup[] = [
  {
    id: "bacteria",
    name: "Bacteria",
    emoji: "🦠",
    tagline: "Single-celled and everywhere.",
    characteristics: [
      "Unicellular and microscopic.",
      "Have different body shapes.",
      "Widely spread in every type of environment on Earth."
    ],
    examples: [
      { name: "Lactobacillus bulgaricus", note: "Used for milk products such as yoghurt." },
      { name: "Acetobacter aceti", note: "Used to make vinegar." },
      { name: "Bacillus anthracis", note: "Causes anthrax disease." },
      { name: "Vibrio cholerae", note: "Causes cholera disease." }
    ]
  },
  {
    id: "fungi",
    name: "Fungi",
    emoji: "🍄",
    tagline: "They thrive on moist surfaces.",
    characteristics: [
      "Unicellular or multicellular.",
      "Some reproductive organs can be seen with the naked eye (e.g. mushrooms).",
      "Thrive on moist surfaces (substrates)."
    ],
    examples: [
      { name: "Mucor", note: "The fungus that grows on bread." },
      { name: "Saccharomyces", note: "Yeast — used in bread and alcohol." }
    ]
  },
  {
    id: "protozoa",
    name: "Protozoa",
    emoji: "🐛",
    tagline: "Tiny movers of water and bodies.",
    characteristics: [
      "Unicellular and microscopic.",
      "Move using structures such as cilia, pseudopodia and flagella.",
      "Live in aquatic environments and inside other living organisms."
    ],
    examples: [
      { name: "Amoeba", note: "Moves using pseudopodia." },
      { name: "Paramecium", note: "Moves using cilia." },
      { name: "Euglena", note: "Moves using a flagellum." },
      { name: "Plasmodium", note: "Causes malaria." }
    ]
  },
  {
    id: "algae",
    name: "Algae",
    emoji: "🌿",
    tagline: "Green microbes that make their own food.",
    characteristics: [
      "Unicellular or multicellular, with filamentous or thallus body forms.",
      "Possess chlorophyll and can carry out photosynthesis.",
      "Microscopic algae floating on water are called phytoplankton."
    ],
    examples: [
      { name: "Chlamydomonas", note: "A unicellular green alga." },
      { name: "Spirogyra", note: "A filamentous green alga." },
      { name: "Diatoms", note: "Algae with glassy cell walls." }
    ]
  },
  {
    id: "virus",
    name: "Viruses",
    emoji: "🧬",
    tagline: "Between the living and the non-living.",
    characteristics: [
      "Electron-microscopic — far smaller than other microbes.",
      "Display both living and non-living characteristics.",
      "Multiply only inside living cells and have no cellular organisation."
    ],
    examples: [
      { name: "Influenza virus", note: "Causes the flu." },
      { name: "HIV", note: "Causes AIDS." },
      { name: "Ebola virus", note: "Causes Ebola." },
      { name: "Dengue virus", note: "Causes dengue fever." }
    ]
  }
];
