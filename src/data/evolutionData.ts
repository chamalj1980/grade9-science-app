// Content for Chapter 9 (The Evolutionary Process). Everything follows the Grade 9
// textbook: the origin of the Earth and life, the theories, the sequence of life,
// fossils, and natural selection.

// ---- 9.1 Origin of the Earth ----
export interface OriginTheory {
  id: string;
  name: string;
  emoji: string;
  summary: string;
  status: "first-scientific" | "modern";
}

export const earthTheories: OriginTheory[] = [
  {
    id: "nebular",
    name: "Nebular theory",
    emoji: "🌫️",
    summary:
      "The first scientific explanation. Tiny particles in the universe were drawn together by gravity, clumped up, and formed the galaxies, the Sun and the planets.",
    status: "first-scientific"
  },
  {
    id: "big-bang",
    name: "Big Bang theory",
    emoji: "💥",
    summary:
      "The modern theory. A single source of enormous energy exploded, creating huge clouds of dust that clumped into galaxies. Our solar system formed in the Milky Way.",
    status: "modern"
  }
];

export const earthFacts: { id: string; title: string; detail: string; emoji: string }[] = [
  {
    id: "age",
    title: "About 4.5 billion years old",
    detail: "The Earth is believed to have formed around 4.5 billion years ago.",
    emoji: "🌍"
  },
  {
    id: "cooling",
    title: "From molten to layered",
    detail:
      "At first the Earth was intensely hot and volcanic. As it cooled, dense metals sank to form the core and light silicon rocks formed the crust.",
    emoji: "🌋"
  },
  {
    id: "atmosphere",
    title: "No oxygen at first",
    detail:
      "The early atmosphere held carbon dioxide (CO₂), methane (CH₄) and hydrogen sulphide (H₂S). The absence of oxygen (O₂) is a key fact.",
    emoji: "☁️"
  },
  {
    id: "oceans",
    title: "Oceans from endless rain",
    detail:
      "Evaporated water condensed into clouds and fell as heavy rain for years. This mineral-rich water collected in low lands to form the oceans.",
    emoji: "🌊"
  }
];

// ---- 9.2 Origin of life: the four theories ----
export interface LifeTheory {
  id: string;
  name: string;
  emoji: string;
  claim: string;
  verdict: string;
  accepted: boolean;
}

export const lifeTheories: LifeTheory[] = [
  {
    id: "special-creation",
    name: "Special creation",
    emoji: "✨",
    claim: "All living things were created by a supernatural power.",
    verdict: "There is no scientific evidence, so scientists do not consider it.",
    accepted: false
  },
  {
    id: "spontaneous",
    name: "Spontaneous generation",
    emoji: "🐀",
    claim:
      "Life arose from non-living things by itself — rats from cloth, maggots from rotten meat, weevils from decayed wood.",
    verdict: "Disproved by Louis Pasteur's swan-neck flask experiment (accepted as false in 1862).",
    accepted: false
  },
  {
    id: "cosmozoic",
    name: "Cosmozoic theory",
    emoji: "☄️",
    claim: "Life reached Earth from space — on a fallen meteor or a spacecraft from another planet.",
    verdict: "Has not been proved scientifically.",
    accepted: false
  },
  {
    id: "biochemical",
    name: "Bio-chemical evolution",
    emoji: "🧪",
    claim:
      "Atmospheric gases reacted (energy from lightning, volcanoes and UV), dissolved in the rain and collected in the sea as the 'primordial soup', where the first cell formed.",
    verdict:
      "The accepted theory today. Proposed by Haldane & Oparin and proved by Stanley Miller.",
    accepted: true
  }
];

export const lifeScientists: { name: string; contribution: string }[] = [
  { name: "Louis Pasteur", contribution: "Disproved spontaneous generation with the swan-neck flask experiment." },
  { name: "Haldane & Oparin", contribution: "Proposed the theory of bio-chemical evolution." },
  { name: "Stanley Miller", contribution: "Proved bio-chemical evolution in the laboratory." },
  { name: "Charles Darwin", contribution: "The father of evolution; put forward the theory of natural selection." }
];

// ---- The sequence of life — used by the lesson AND Exercise 1 (ordering) ----
export interface OrderItem {
  id: string;
  label: string;
  emoji: string;
}

export interface TimelineRound {
  id: string;
  title: string;
  prompt: string;
  // items given in the CORRECT order (earliest first)
  order: OrderItem[];
}

export const timelineRounds: TimelineRound[] = [
  {
    id: "earth-to-life",
    title: "Level 1 · From Earth to first life",
    prompt: "Put these events in order, earliest first.",
    order: [
      { id: "earth", label: "The Earth forms (4.5 billion yrs ago)", emoji: "🌍" },
      { id: "atmos", label: "Early atmosphere: CO₂, CH₄ — no oxygen", emoji: "☁️" },
      { id: "oceans", label: "Rain collects to form the oceans", emoji: "🌊" },
      { id: "soup", label: "The 'primordial soup' forms", emoji: "🥣" },
      { id: "cell", label: "The first living cell appears (3.5 billion yrs ago)", emoji: "🦠" }
    ]
  },
  {
    id: "animals",
    title: "Level 2 · The march of animal life",
    prompt: "Order these life forms from earliest to most recent.",
    order: [
      { id: "bacteria", label: "Unicellular bacteria", emoji: "🦠" },
      { id: "algae", label: "Unicellular algae (first to photosynthesise)", emoji: "🟢" },
      { id: "multi", label: "Multicellular organisms", emoji: "🪸" },
      { id: "fish", label: "Fish — the first vertebrates", emoji: "🐟" },
      { id: "amph", label: "Amphibians — first onto land", emoji: "🐸" },
      { id: "rept", label: "Reptiles", emoji: "🦎" },
      { id: "birds", label: "Birds and mammals", emoji: "🦅" }
    ]
  },
  {
    id: "plants",
    title: "Level 3 · How plants appeared",
    prompt: "Order the plant groups from earliest to most recent.",
    order: [
      { id: "p-algae", label: "Photosynthetic algae in the oceans", emoji: "🌿" },
      { id: "p-simple", label: "Simple, less-developed plants", emoji: "🌱" },
      { id: "p-nonflower", label: "Non-flowering plants", emoji: "🌲" },
      { id: "p-flower", label: "Flowering plants", emoji: "🌸" }
    ]
  }
];

export const totalTimelineItems = timelineRounds.reduce(
  (sum, round) => sum + round.order.length,
  0
);

// ---- 9.3 Fossils ----
export const fossilFormation: { step: number; title: string; detail: string; emoji: string }[] = [
  { step: 1, title: "An organism dies", detail: "A plant or animal dies and its soft parts begin to decay.", emoji: "💀" },
  { step: 2, title: "It is buried", detail: "The hard parts (bones, teeth, shells) are quickly buried in mud or sand.", emoji: "🏔️" },
  { step: 3, title: "Minerals seep in", detail: "Over ages, mineral-rich mud seeps into the pores and pressure builds.", emoji: "💧" },
  { step: 4, title: "It turns to stone", detail: "The remains harden into a bony rock — a fossil — keeping the original shape.", emoji: "🪨" }
];

export const livingFossils: { id: string; name: string; emoji: string; note: string }[] = [
  { id: "coelacanth", name: "Coelacanth", emoji: "🐟", note: "A fish thought extinct for 70 million years — found alive off South Africa in 1938." },
  { id: "lingula", name: "Lingula", emoji: "🐚", note: "Found around Thambalagamuwa bay in Trincomalee, Sri Lanka." },
  { id: "dragonfly", name: "Dragonfly", emoji: "🪰", note: "Little changed for millions of years." },
  { id: "cockroach", name: "Cockroach", emoji: "🪳", note: "One of the great survivors — barely changed." },
  { id: "lungfish", name: "Lungfish", emoji: "🐠", note: "A fish that can breathe air, almost unchanged." },
  { id: "treefern", name: "Tree fern ('Ginihota')", emoji: "🌿", note: "A living plant fossil." }
];

export const evidenceTypes: { id: string; name: string; detail: string; emoji: string }[] = [
  { id: "biogeography", name: "Biogeography", detail: "Where animals and plants are found across the world.", emoji: "🗺️" },
  { id: "anatomy", name: "Comparative anatomy", detail: "Comparing the body structures of different organisms.", emoji: "🦴" },
  { id: "fossils", name: "Fossils (paleontology)", detail: "The main, most detailed evidence — the record in the rocks.", emoji: "🦕" }
];

// ---- 9.4 Bio-diversity & natural selection ----
export const naturalSelection: string =
  "Organisms compete for limited resources. The ones that succeed are naturally selected and become established; their population grows. Over time this — and speciation, where new species arise from old ones — builds the huge bio-diversity we see today.";

// ---- Exercise 2: true / false statements ----
export interface EvoStatement {
  id: string;
  text: string;
  isTrue: boolean;
  reason: string;
}

export const evoStatements: EvoStatement[] = [
  { id: "s1", text: "The Earth formed about 4.5 billion years ago.", isTrue: true, reason: "Correct — the Earth is about 4.5 billion years old." },
  { id: "s2", text: "The early Earth's atmosphere was rich in oxygen.", isTrue: false, reason: "False — the early atmosphere had CO₂, CH₄ and H₂S, but NO oxygen." },
  { id: "s3", text: "Louis Pasteur disproved spontaneous generation.", isTrue: true, reason: "Correct — his swan-neck flask experiment showed life does not appear by itself." },
  { id: "s4", text: "Bio-chemical evolution is the accepted theory of the origin of life.", isTrue: true, reason: "Correct — proposed by Haldane & Oparin and proved by Stanley Miller." },
  { id: "s5", text: "The first living organism was a multicellular plant.", isTrue: false, reason: "False — the first organism was a unicellular bacterium." },
  { id: "s6", text: "Fossils are the ONLY evidence used to study evolution.", isTrue: false, reason: "False — biogeography and comparative anatomy are also used." },
  { id: "s7", text: "Lingula, found in Sri Lanka, is a living fossil.", isTrue: true, reason: "Correct — it is found around Trincomalee and is barely changed." },
  { id: "s8", text: "Modern humans appeared about 4.5 billion years ago.", isTrue: false, reason: "False — modern humans appeared about 5 million years ago." },
  { id: "s9", text: "Living fossils change rapidly over millions of years.", isTrue: false, reason: "False — living fossils are organisms that have hardly changed." },
  { id: "s10", text: "Charles Darwin proposed the theory of natural selection.", isTrue: true, reason: "Correct — he is called the father of evolution." },
  { id: "s11", text: "In rock layers, the oldest fossils lie at the bottom.", isTrue: true, reason: "Correct — rocks are deposited on top of each other, so the deepest are oldest." },
  { id: "s12", text: "Evolution means simple organisms developing into complex ones over time.", isTrue: true, reason: "Correct — that gradual change from simple to complex is evolution." }
];

export const evolutionTerms: { term: string; meaning: string }[] = [
  { term: "Evolution", meaning: "The gradual development of simple organisms into modern, complex ones over time." },
  { term: "Nebular theory", meaning: "The first scientific idea for the origin of the solar system, by gravity pulling particles together." },
  { term: "Big Bang theory", meaning: "The modern theory: a giant explosion of energy created the galaxies." },
  { term: "Primordial soup", meaning: "The mineral- and chemical-rich early sea in which the first cell is thought to have formed." },
  { term: "Bio-chemical evolution", meaning: "The accepted theory of the origin of life from chemical reactions in the primordial soup." },
  { term: "Fossil", meaning: "The preserved remains, part or trace of a dead organism." },
  { term: "Living fossil", meaning: "An organism that has survived almost unchanged for millions of years, e.g. the Coelacanth." },
  { term: "Natural selection", meaning: "The process where better-suited organisms survive, reproduce and become established." },
  { term: "Speciation", meaning: "The forming of a new species from a former one, adding to bio-diversity." }
];
