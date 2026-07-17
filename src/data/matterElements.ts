// Element data for Chapter 3 (Nature and Properties of Matter). Symbols, Latin origins
// and proton/neutron counts follow the Grade 9 textbook tables 3.1–3.4, 3.7 and 3.8.

export type SymbolOrigin = "single" | "double" | "latin";

export interface ElementInfo {
  symbol: string;
  name: string;
  latin?: string; // only for symbols that come from the Latin name
  z: number; // atomic number = number of protons
  neutrons: number; // neutrons in the common isotope
  origin: SymbolOrigin;
  note?: string;
}

// Ordered by atomic number.
export const elements: ElementInfo[] = [
  { symbol: "H", name: "Hydrogen", z: 1, neutrons: 0, origin: "single" },
  { symbol: "C", name: "Carbon", z: 6, neutrons: 6, origin: "single" },
  { symbol: "N", name: "Nitrogen", z: 7, neutrons: 7, origin: "single" },
  { symbol: "O", name: "Oxygen", z: 8, neutrons: 8, origin: "single" },
  { symbol: "F", name: "Fluorine", z: 9, neutrons: 10, origin: "single" },
  { symbol: "Ne", name: "Neon", z: 10, neutrons: 10, origin: "double" },
  {
    symbol: "Na",
    name: "Sodium",
    latin: "Natrium",
    z: 11,
    neutrons: 12,
    origin: "latin"
  },
  { symbol: "Mg", name: "Magnesium", z: 12, neutrons: 12, origin: "double" },
  { symbol: "Al", name: "Aluminium", z: 13, neutrons: 14, origin: "double" },
  { symbol: "Si", name: "Silicon", z: 14, neutrons: 14, origin: "double" },
  { symbol: "P", name: "Phosphorous", z: 15, neutrons: 16, origin: "single" },
  { symbol: "S", name: "Sulphur", z: 16, neutrons: 16, origin: "single" },
  { symbol: "Cl", name: "Chlorine", z: 17, neutrons: 18, origin: "double" },
  { symbol: "Ar", name: "Argon", z: 18, neutrons: 22, origin: "double" },
  { symbol: "Ca", name: "Calcium", z: 20, neutrons: 20, origin: "double" },
  {
    symbol: "Fe",
    name: "Iron",
    latin: "Ferrum",
    z: 26,
    neutrons: 30,
    origin: "latin"
  },
  {
    symbol: "Cu",
    name: "Copper",
    latin: "Cuprum",
    z: 29,
    neutrons: 35,
    origin: "latin"
  },
  { symbol: "Zn", name: "Zinc", z: 30, neutrons: 35, origin: "double" },
  { symbol: "Br", name: "Bromine", z: 35, neutrons: 45, origin: "double" },
  {
    symbol: "Ag",
    name: "Silver",
    latin: "Argentum",
    z: 47,
    neutrons: 61,
    origin: "latin"
  },
  { symbol: "I", name: "Iodine", z: 53, neutrons: 74, origin: "single" },
  {
    symbol: "Au",
    name: "Gold",
    latin: "Aurum",
    z: 79,
    neutrons: 118,
    origin: "latin"
  },
  {
    symbol: "Hg",
    name: "Mercury",
    latin: "Hydrargyrum",
    z: 80,
    neutrons: 121,
    origin: "latin"
  },
  {
    symbol: "Pb",
    name: "Lead",
    latin: "Plumbum",
    z: 82,
    neutrons: 125,
    origin: "latin"
  }
];

// How each kind of symbol is formed — used by the lesson's symbol explorer.
export const originRules: Record<
  SymbolOrigin,
  { title: string; rule: string; emoji: string }
> = {
  single: {
    title: "One capital letter",
    rule: "The first letter of the English name, always written as a capital.",
    emoji: "🔤"
  },
  double: {
    title: "Two letters",
    rule: "When several elements start with the same letter, a second (small) letter from the name is added.",
    emoji: "🔡"
  },
  latin: {
    title: "From the Latin name",
    rule: "Some symbols come from the element's old Latin name, not its English one.",
    emoji: "🏛️"
  }
};

// ---- Subatomic particles (table 3.6) ----
export interface ParticleInfo {
  id: "proton" | "neutron" | "electron";
  name: string;
  location: string;
  mass: string;
  charge: string;
  fact: string;
}

export const particles: ParticleInfo[] = [
  {
    id: "proton",
    name: "Proton",
    location: "In the nucleus",
    mass: "1",
    charge: "+1",
    fact: "The number of protons is the atomic number — it decides which element the atom is."
  },
  {
    id: "neutron",
    name: "Neutron",
    location: "In the nucleus",
    mass: "1",
    charge: "0",
    fact: "Neutrons add mass but no charge. Protons + neutrons give the mass number."
  },
  {
    id: "electron",
    name: "Electron",
    location: "Moving around the nucleus",
    mass: "1/1840",
    charge: "-1",
    fact: "Electrons are about 1840 times lighter than a proton. In a neutral atom they equal the protons."
  }
];

// ---- Molecules (tables 3.5 and 3.9) ----
export interface MoleculeInfo {
  id: string;
  name: string;
  formula: string;
  kind: "homo" | "hetero";
  atoms: { symbol: string; count: number }[];
  note: string;
}

export const molecules: MoleculeInfo[] = [
  {
    id: "o2",
    name: "Oxygen",
    formula: "O₂",
    kind: "homo",
    atoms: [{ symbol: "O", count: 2 }],
    note: "Two oxygen atoms of the SAME kind — a homo-atomic molecule. This is the smallest form oxygen can exist in on its own."
  },
  {
    id: "h2",
    name: "Hydrogen",
    formula: "H₂",
    kind: "homo",
    atoms: [{ symbol: "H", count: 2 }],
    note: "Two hydrogen atoms joined together — still an element, because both atoms are the same."
  },
  {
    id: "n2",
    name: "Nitrogen",
    formula: "N₂",
    kind: "homo",
    atoms: [{ symbol: "N", count: 2 }],
    note: "Nitrogen gas travels as N₂. It makes up most of the air you are breathing."
  },
  {
    id: "cl2",
    name: "Chlorine",
    formula: "Cl₂",
    kind: "homo",
    atoms: [{ symbol: "Cl", count: 2 }],
    note: "Chlorine also exists as a homo-atomic molecule, Cl₂."
  },
  {
    id: "hcl",
    name: "Hydrogen chloride",
    formula: "HCl",
    kind: "hetero",
    atoms: [
      { symbol: "H", count: 1 },
      { symbol: "Cl", count: 1 }
    ],
    note: "One hydrogen atom joined to one chlorine atom — different atoms, so it is hetero-atomic: a compound."
  },
  {
    id: "h2o",
    name: "Water",
    formula: "H₂O",
    kind: "hetero",
    atoms: [
      { symbol: "H", count: 2 },
      { symbol: "O", count: 1 }
    ],
    note: "Two hydrogen atoms and one oxygen atom. Water is a compound, not an element."
  },
  {
    id: "co2",
    name: "Carbon dioxide",
    formula: "CO₂",
    kind: "hetero",
    atoms: [
      { symbol: "C", count: 1 },
      { symbol: "O", count: 2 }
    ],
    note: "One carbon atom with two oxygen atoms — the gas you breathe out."
  },
  {
    id: "ch4",
    name: "Methane",
    formula: "CH₄",
    kind: "hetero",
    atoms: [
      { symbol: "C", count: 1 },
      { symbol: "H", count: 4 }
    ],
    note: "One carbon atom with four hydrogen atoms — the main gas in biogas."
  },
  {
    id: "nh3",
    name: "Ammonia",
    formula: "NH₃",
    kind: "hetero",
    atoms: [
      { symbol: "N", count: 1 },
      { symbol: "H", count: 3 }
    ],
    note: "One nitrogen atom with three hydrogen atoms."
  }
];

// Same elements, different compounds (textbook examples on page 45).
export interface FamilyInfo {
  elements: string;
  members: { formula: string; name: string; use: string }[];
}

export const compoundFamilies: FamilyInfo[] = [
  {
    elements: "C and H",
    members: [
      { formula: "CH₄", name: "Methane", use: "a component of biogas" },
      { formula: "C₆H₁₄", name: "Hexane", use: "a solvent" },
      { formula: "C₆H₆", name: "Benzene", use: "a solvent" },
      { formula: "C₂H₂", name: "Acetylene", use: "burnt to weld metals" },
      { formula: "C₂H₄", name: "Ethene", use: "raw material for polythene" }
    ]
  },
  {
    elements: "C, H and O",
    members: [
      { formula: "C₆H₁₂O₆", name: "Glucose", use: "a simple sugar" },
      { formula: "CH₃COOH", name: "Acetic acid", use: "found in vinegar" },
      { formula: "C₂H₅OH", name: "Ethanol", use: "found in alcoholic drinks" },
      { formula: "CH₃OCH₃", name: "Dimethyl ether", use: "an anaesthetic" },
      { formula: "C₁₂H₂₂O₁₁", name: "Sucrose", use: "found in sugar cane" }
    ]
  }
];

// ---- Separation methods (page 47) ----
export const separationMethods: { method: string; use: string; emoji: string }[] = [
  { method: "Panning", use: "Separating sand from rice; gems from ores", emoji: "🥘" },
  { method: "Winnowing", use: "Separating chaff from rice", emoji: "🌬️" },
  { method: "Floating on water", use: "Separating sterile seeds from seed paddy", emoji: "💧" },
  { method: "Sifting", use: "Separating gravel from sand", emoji: "🕸️" },
  { method: "Vapourisation", use: "Obtaining salt from sea water", emoji: "☀️" },
  { method: "Fractional distillation", use: "Separating fuels from crude oil", emoji: "🛢️" },
  { method: "Steam distillation", use: "Separating cinnamon oil from cinnamon leaves", emoji: "🍃" },
  { method: "Crystallization", use: "Separating sugar from cane sugar syrup", emoji: "🍬" },
  { method: "Using a magnet", use: "Separating some minerals from mineral sands", emoji: "🧲" }
];
