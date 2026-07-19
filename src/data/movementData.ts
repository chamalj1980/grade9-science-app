// Content for Chapter 8 (Support and Movements of Organisms). Everything follows the
// Grade 9 textbook: how animals move, bones/muscles/joints, and the movements of plants
// (tropic and nastic).

// ---- Animal locomotion (8.1) ----
export interface AnimalMover {
  id: string;
  animal: string;
  emoji: string;
  appendage: string; // what it uses to move
  fact: string;
  group: "microscopic" | "limbed" | "no-appendage";
}

export const animalMovers: AnimalMover[] = [
  {
    id: "amoeba",
    animal: "Amoeba",
    emoji: "🦠",
    appendage: "Pseudopodia (false feet)",
    fact: "Amoeba pushes out finger-like 'false feet' to creep along.",
    group: "microscopic"
  },
  {
    id: "euglena",
    animal: "Euglena",
    emoji: "🟢",
    appendage: "Flagellum",
    fact: "Euglena whips a long tail-like flagellum to swim.",
    group: "microscopic"
  },
  {
    id: "paramecium",
    animal: "Paramecium",
    emoji: "🔬",
    appendage: "Cilia",
    fact: "Paramecium is covered in tiny hair-like cilia that beat to move it.",
    group: "microscopic"
  },
  {
    id: "human",
    animal: "Human",
    emoji: "🧑",
    appendage: "Limbs",
    fact: "Humans, cheetahs and toads all move using limbs.",
    group: "limbed"
  },
  {
    id: "cheetah",
    animal: "Cheetah",
    emoji: "🐆",
    appendage: "Limbs",
    fact: "The cheetah's four limbs make it the fastest land animal.",
    group: "limbed"
  },
  {
    id: "toad",
    animal: "Toad",
    emoji: "🐸",
    appendage: "Limbs",
    fact: "A toad's strong hind limbs let it leap.",
    group: "limbed"
  },
  {
    id: "dolphin",
    animal: "Dolphin",
    emoji: "🐬",
    appendage: "Flippers",
    fact: "Dolphins use flippers (and a tail) to swim.",
    group: "limbed"
  },
  {
    id: "crow",
    animal: "Crow",
    emoji: "🐦",
    appendage: "Wings",
    fact: "Birds like the crow fly using wings.",
    group: "limbed"
  },
  {
    id: "snail",
    animal: "Snail",
    emoji: "🐌",
    appendage: "Muscular foot",
    fact: "A snail glides on a single muscular foot — no special limb.",
    group: "no-appendage"
  },
  {
    id: "earthworm",
    animal: "Earthworm",
    emoji: "🪱",
    appendage: "Body muscles",
    fact: "An earthworm has no special appendage — it moves by squeezing its body muscles.",
    group: "no-appendage"
  },
  {
    id: "leech",
    animal: "Leech",
    emoji: "🩸",
    appendage: "Body muscles",
    fact: "A leech loops along using its body muscles and suckers.",
    group: "no-appendage"
  },
  {
    id: "cobra",
    animal: "Cobra",
    emoji: "🐍",
    appendage: "Body muscles",
    fact: "A cobra has no limbs — waves of body muscle push it forward.",
    group: "no-appendage"
  }
];

// ---- Exercise 1: match an animal to its mover (one appendage per slot, per level) ----
export interface MoverMatch {
  id: string;
  animal: string;
  emoji: string;
  appendage: string; // the drop-target label
  fact: string;
  level: "microscopic" | "limbed" | "no-appendage";
}

export const moverMatches: MoverMatch[] = [
  // Level 1 — microscopic
  { id: "m-amoeba", animal: "Amoeba", emoji: "🦠", appendage: "Pseudopodia", fact: "Amoeba creeps on 'false feet'.", level: "microscopic" },
  { id: "m-euglena", animal: "Euglena", emoji: "🟢", appendage: "Flagellum", fact: "Euglena swims with a whip-like flagellum.", level: "microscopic" },
  { id: "m-paramecium", animal: "Paramecium", emoji: "🔬", appendage: "Cilia", fact: "Paramecium is covered in beating cilia.", level: "microscopic" },
  // Level 2 — limbs, wings, flippers
  { id: "m-cheetah", animal: "Cheetah", emoji: "🐆", appendage: "Limbs", fact: "The cheetah runs on four limbs.", level: "limbed" },
  { id: "m-crow", animal: "Crow", emoji: "🐦", appendage: "Wings", fact: "Birds fly using wings.", level: "limbed" },
  { id: "m-dolphin", animal: "Dolphin", emoji: "🐬", appendage: "Flippers", fact: "Dolphins swim with flippers.", level: "limbed" },
  // Level 3 — no special appendage
  { id: "m-snail", animal: "Snail", emoji: "🐌", appendage: "Muscular foot", fact: "A snail glides on one muscular foot.", level: "no-appendage" },
  { id: "m-earthworm", animal: "Earthworm", emoji: "🪱", appendage: "Body muscles", fact: "An earthworm moves with body muscles alone.", level: "no-appendage" },
  { id: "m-human", animal: "Human", emoji: "🧑", appendage: "Limbs (bones + muscles)", fact: "Humans move using bones and the muscles attached to them.", level: "no-appendage" }
];

export interface MoverLevel {
  id: MoverMatch["level"];
  title: string;
  matchIds: string[];
}

export const moverLevels: MoverLevel[] = [
  { id: "microscopic", title: "Level 1 · Tiny movers", matchIds: ["m-amoeba", "m-euglena", "m-paramecium"] },
  { id: "limbed", title: "Level 2 · Limbs, wings & flippers", matchIds: ["m-cheetah", "m-crow", "m-dolphin"] },
  { id: "no-appendage", title: "Level 3 · No special appendage", matchIds: ["m-snail", "m-earthworm", "m-human"] }
];

// ---- Muscles, bones & the elbow joint (8.2) ----
export const muscleFeatures: string[] = [
  "The cells in a muscle are arranged as fibres.",
  "A muscle can contract (shorten).",
  "A muscle can relax.",
  "After contracting or stretching, a muscle can return to its original length."
];

export const elbowParts: { id: string; label: string; note: string }[] = [
  { id: "humerus", label: "Humerus", note: "The single upper-arm bone." },
  { id: "ulna", label: "Ulna", note: "A forearm bone. The triceps connects to it." },
  { id: "radius", label: "Radius", note: "The other forearm bone. The biceps connects to it." },
  { id: "biceps", label: "Biceps muscle", note: "Contracts to BEND and lift the arm." },
  { id: "triceps", label: "Triceps muscle", note: "Contracts to STRAIGHTEN the arm." },
  { id: "tendon", label: "Tendons", note: "Tough cords that join muscle to bone." }
];

// ---- Plant support & movements (8.3) ----
export interface Tropism {
  id: string;
  name: string;
  stimulus: string;
  direction: "positive" | "negative";
  example: string;
  emoji: string;
}

export const tropisms: Tropism[] = [
  { id: "geo-pos", name: "Positive geotropism", stimulus: "Gravity", direction: "positive", example: "Roots grow down towards the ground.", emoji: "🌱" },
  { id: "geo-neg", name: "Negative geotropism", stimulus: "Gravity", direction: "negative", example: "The stem grows up, away from the ground.", emoji: "🌿" },
  { id: "photo", name: "Positive phototropism", stimulus: "Light", direction: "positive", example: "The stem grows towards the light.", emoji: "☀️" },
  { id: "hydro", name: "Positive hydrotropism", stimulus: "Water", direction: "positive", example: "Roots grow towards a water source.", emoji: "💧" },
  { id: "chemo", name: "Positive chemotropism", stimulus: "A chemical", direction: "positive", example: "A pollen tube grows down towards the ovule.", emoji: "🧪" },
  { id: "thigmo", name: "Positive thigmotropism", stimulus: "Touch / a support", direction: "positive", example: "A passion-fruit tendril coils around a support.", emoji: "🌀" }
];

export interface NasticMovement {
  id: string;
  name: string;
  trigger: string;
  example: string;
  emoji: string;
}

export const nasticMovements: NasticMovement[] = [
  { id: "nyctinastic", name: "Nyctinastic", trigger: "Nightfall (darkness)", example: "Tamarind and Mimosa leaves 'sleep' as dark falls.", emoji: "🌙" },
  { id: "haptonastic", name: "Haptonastic", trigger: "Touch", example: "Mimosa leaves fold up the moment you touch them.", emoji: "👆" },
  { id: "seismonastic", name: "Seismonastic", trigger: "A shock or vibration", example: "Mimosa leaves fold when the plant is shaken.", emoji: "💥" },
  { id: "photonastic", name: "Photonastic", trigger: "Sunrise (light)", example: "Flowers bloom open at sunrise.", emoji: "🌸" }
];

// ---- Exercise 2: sort a plant movement as tropic or nastic ----
export type PlantMoveType = "tropic" | "nastic";

export interface PlantScenario {
  id: string;
  label: string;
  emoji: string;
  type: PlantMoveType;
  reason: string;
}

export const plantScenarios: PlantScenario[] = [
  { id: "root-down", label: "Roots grow down into the soil", emoji: "🌱", type: "tropic", reason: "Growth directed by gravity — positive geotropism, a tropic movement." },
  { id: "stem-light", label: "A shoot bends towards a sunny window", emoji: "☀️", type: "tropic", reason: "Growth towards the light — positive phototropism, a tropic movement." },
  { id: "root-water", label: "Roots grow towards a leaking pipe", emoji: "💧", type: "tropic", reason: "Growth towards water — positive hydrotropism, a tropic movement." },
  { id: "tendril", label: "A passion-fruit tendril coils around a stick", emoji: "🌀", type: "tropic", reason: "Growth in response to touching a support — positive thigmotropism." },
  { id: "stem-up", label: "The stem grows upwards, away from the ground", emoji: "🌿", type: "tropic", reason: "Growth away from gravity — negative geotropism, a tropic movement." },
  { id: "pollen", label: "A pollen tube grows towards the ovule", emoji: "🧪", type: "tropic", reason: "Growth guided by a chemical — positive chemotropism." },
  { id: "mimosa-touch", label: "Mimosa leaves fold when you touch them", emoji: "👆", type: "nastic", reason: "Direction doesn't depend on the touch's direction — a haptonastic (nastic) movement." },
  { id: "tamarind-night", label: "Tamarind leaves close as night falls", emoji: "🌙", type: "nastic", reason: "A 'sleep' movement triggered by darkness — nyctinastic (nastic)." },
  { id: "mimosa-shake", label: "Mimosa leaves fold when the plant is shaken", emoji: "💥", type: "nastic", reason: "A response to a shock, not its direction — seismonastic (nastic)." },
  { id: "flower-open", label: "Flowers open at sunrise", emoji: "🌸", type: "nastic", reason: "Blooming triggered by light, always in the same way — photonastic (nastic)." },
  { id: "nelli-night", label: "'Nelli' leaves droop at dusk", emoji: "🌒", type: "nastic", reason: "A sleep movement as sunlight fades — nyctinastic (nastic)." }
];

export const plantMoveInfo: Record<PlantMoveType, { title: string; hint: string; emoji: string }> = {
  tropic: { title: "Tropic", hint: "growth, linked to stimulus direction", emoji: "📈" },
  nastic: { title: "Nastic", hint: "fixed response, turgor change", emoji: "💤" }
};

export const movementTerms: { term: string; meaning: string }[] = [
  { term: "Movement", meaning: "A change of location of the whole body or a part, in response to a stimulus." },
  { term: "Locomotion", meaning: "Movement of the whole organism from place to place." },
  { term: "Muscle", meaning: "Tissue of fibre cells that can contract, relax and return to its length." },
  { term: "Tendon", meaning: "A tough cord that joins a muscle to a bone." },
  { term: "Support (in plants)", meaning: "Staying erect — from water (turgor) in soft plants, or cellulose and lignin in woody ones." },
  { term: "Tropic movement", meaning: "A growth movement whose direction is linked to the stimulus. Caused by growth substances." },
  { term: "Nastic movement", meaning: "A movement in a fixed direction, whatever the stimulus direction. Usually a turgor change, not growth." },
  { term: "Pulvinus", meaning: "A swelling at a leaf base whose cells change turgor to drive nastic movements." },
  { term: "In-situ conservation", meaning: "Conserving an organism in its own natural habitat, e.g. a reserved forest." }
];
