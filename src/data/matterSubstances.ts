// Substances for Exercise 2's three-bin sort, plus the mixture examples used in the
// lesson. Every classification and example comes from the Grade 9 textbook, Chapter 3
// (activities 3.1–3.4 and tables 3.9–3.10).

export type MatterClass = "element" | "compound" | "mixture";

export interface SubstanceCard {
  id: string;
  label: string;
  emoji: string;
  answer: MatterClass;
  reason: string;
}

export const substanceCards: SubstanceCard[] = [
  // ---- elements ----
  {
    id: "aluminium",
    label: "Aluminium",
    emoji: "🥫",
    answer: "element",
    reason: "Made of only aluminium atoms, so it cannot be split into simpler substances."
  },
  {
    id: "sulphur",
    label: "Sulphur",
    emoji: "🟡",
    answer: "element",
    reason: "A pure substance made of one kind of atom only."
  },
  {
    id: "zinc",
    label: "Zinc",
    emoji: "⚙️",
    answer: "element",
    reason: "Only zinc atoms — an element."
  },
  {
    id: "chlorine",
    label: "Chlorine",
    emoji: "🟢",
    answer: "element",
    reason: "Chlorine exists as Cl₂ molecules, but both atoms are the same kind, so it is still an element."
  },
  {
    id: "carbon",
    label: "Carbon",
    emoji: "⬛",
    answer: "element",
    reason: "One kind of atom only — carbon."
  },
  {
    id: "silver",
    label: "Silver",
    emoji: "🥈",
    answer: "element",
    reason: "Made of silver atoms alone. Its symbol Ag comes from the Latin 'Argentum'."
  },

  // ---- compounds ----
  {
    id: "sodium-chloride",
    label: "Sodium chloride (salt)",
    emoji: "🧂",
    answer: "compound",
    reason: "Sodium and chlorine chemically combined in a fixed ratio — NaCl."
  },
  {
    id: "copper-sulphate",
    label: "Copper sulphate",
    emoji: "🔷",
    answer: "compound",
    reason: "Copper, sulphur and oxygen chemically combined — CuSO₄."
  },
  {
    id: "glucose",
    label: "Glucose",
    emoji: "🍬",
    answer: "compound",
    reason: "Carbon, hydrogen and oxygen combined in a fixed ratio — C₆H₁₂O₆."
  },
  {
    id: "distilled-water",
    label: "Distilled water",
    emoji: "💧",
    answer: "compound",
    reason: "Pure water is H₂O — hydrogen and oxygen chemically combined. It is a pure substance, not a mixture."
  },
  {
    id: "carbon-dioxide",
    label: "Carbon dioxide",
    emoji: "💨",
    answer: "compound",
    reason: "One carbon atom joined to two oxygen atoms — CO₂."
  },
  {
    id: "calcium-carbonate",
    label: "Calcium carbonate",
    emoji: "🐚",
    answer: "compound",
    reason: "Calcium, carbon and oxygen combined — CaCO₃."
  },

  // ---- mixtures ----
  {
    id: "air",
    label: "Air",
    emoji: "🌬️",
    answer: "mixture",
    reason: "Nitrogen, oxygen, argon, carbon dioxide and water vapour mixed together."
  },
  {
    id: "salt-solution",
    label: "Salt solution",
    emoji: "🥤",
    answer: "mixture",
    reason: "Salt and water mixed — they can be separated again by vapourising the water."
  },
  {
    id: "drinking-water",
    label: "Drinking water",
    emoji: "🚰",
    answer: "mixture",
    reason: "Water with dissolved salts and gases in it — more than one constituent."
  },
  {
    id: "sea-water",
    label: "Sea water",
    emoji: "🌊",
    answer: "mixture",
    reason: "Water, salts and dissolved gases — separable by physical methods."
  },
  {
    id: "crude-oil",
    label: "Crude oil",
    emoji: "🛢️",
    answer: "mixture",
    reason: "Diesel, petrol, kerosene and tar mixed — separated by fractional distillation."
  },
  {
    id: "fruit-salad",
    label: "Fruit salad",
    emoji: "🍓",
    answer: "mixture",
    reason: "Several substances simply mixed, each keeping its own properties."
  }
];

export const matterClassInfo: Record<
  MatterClass,
  { title: string; hint: string; emoji: string }
> = {
  element: {
    title: "Element",
    hint: "one kind of atom",
    emoji: "🔹"
  },
  compound: {
    title: "Compound",
    hint: "elements chemically joined",
    emoji: "🔗"
  },
  mixture: {
    title: "Mixture",
    hint: "just mixed, separable",
    emoji: "🥣"
  }
};

// ---- Homogeneous vs heterogeneous (activity 3.4) ----
export interface MixtureExample {
  id: string;
  label: string;
  emoji: string;
  uniform: boolean; // true = homogeneous
  reason: string;
}

export const mixtureExamples: MixtureExample[] = [
  {
    id: "salt-sol",
    label: "Salt solution",
    emoji: "🧂",
    uniform: true,
    reason: "Colour and transparency are the same all the way through."
  },
  {
    id: "sugar-sol",
    label: "Sugar solution",
    emoji: "🍯",
    uniform: true,
    reason: "The sugar spreads evenly — the composition is uniform throughout."
  },
  {
    id: "sea-water-mix",
    label: "Sea water",
    emoji: "🌊",
    uniform: true,
    reason: "The dissolved salts are spread evenly through the water."
  },
  {
    id: "muddy-water",
    label: "Muddy water",
    emoji: "🟤",
    uniform: false,
    reason: "The colour and transparency change from place to place."
  },
  {
    id: "ice-cream",
    label: "Ice cream",
    emoji: "🍨",
    uniform: false,
    reason: "You can see different parts — it is not the same throughout."
  },
  {
    id: "mortar",
    label: "Mortar mixture",
    emoji: "🧱",
    uniform: false,
    reason: "Sand and cement stay visible as separate bits."
  },
  {
    id: "fruit-salad-mix",
    label: "Fruit salad",
    emoji: "🍇",
    uniform: false,
    reason: "Every spoonful is different — clearly not uniform."
  }
];
