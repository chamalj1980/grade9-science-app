// Content for Chapter 7 (Plant Growth Substances). Everything follows the Grade 9
// textbook: the apex experiments, the growth-promoting hormones (auxin, gibberellin,
// cytokinin), the inhibitors and other substances (abscisic acid, ethene), phototropism,
// and the artificial growth substances used in agriculture and horticulture.

export type HormoneId =
  | "auxin"
  | "gibberellin"
  | "cytokinin"
  | "abscisic"
  | "ethene";

export type HormoneKind = "promoter" | "inhibitor" | "other";

export interface Hormone {
  id: HormoneId;
  name: string;
  emoji: string;
  kind: HormoneKind;
  tagline: string; // one-line "what it does"
  detail: string; // fuller explanation for the lesson panel
  madeIn: string; // where it is produced / how it appears
}

// The three promoters come first (they are the core of the lesson), then the two extra
// substances from the "For extra knowledge" box.
export const hormones: Hormone[] = [
  {
    id: "auxin",
    name: "Auxin",
    emoji: "🌿",
    kind: "promoter",
    tagline: "Stretches cells so the shoot grows up and bends toward light.",
    detail:
      "Made in the tips (apex) of shoots and roots, auxin diffuses downwards and speeds up the elongation of new cells, so the shoot grows upwards. When light comes from one side, auxin collects on the darker side, those cells grow longer, and the tip curves toward the light. Auxin also stops lateral buds from growing. IAA is the natural auxin found in plants.",
    madeIn: "Tips of shoots and roots (the apex)"
  },
  {
    id: "gibberellin",
    name: "Gibberellin",
    emoji: "📏",
    kind: "promoter",
    tagline: "Makes stems longer and fruits bigger.",
    detail:
      "Gibberellin mainly promotes the elongation of the stem and the growth of fruits, so a plant grows taller and its fruits swell.",
    madeIn: "Young tissues of the plant"
  },
  {
    id: "cytokinin",
    name: "Cytokinin",
    emoji: "✂️",
    kind: "promoter",
    tagline: "Speeds up cell division; delays ageing.",
    detail:
      "Cytokinin accelerates cell division, so the growth of flowers, leaves, fruits and roots speeds up. It also stimulates seed germination and delays plant ageing, and is used to increase the rate of rooting in plants.",
    madeIn: "Roots and dividing tissues"
  },
  {
    id: "abscisic",
    name: "Abscisic acid",
    emoji: "🚱",
    kind: "inhibitor",
    tagline: "A growth inhibitor — closes stomata when water is short.",
    detail:
      "Abscisic acid is a growth inhibitor. When a plant is short of water it causes the stomata to close, which decreases transpiration and helps the plant save water.",
    madeIn: "Leaves and roots under stress"
  },
  {
    id: "ethene",
    name: "Ethene",
    emoji: "🍌",
    kind: "other",
    tagline: "Ripens fruit and heals wounds.",
    detail:
      "Ethene (ethylene) is a simple organic compound produced in small amounts. It is needed for the ripening of fruits — the stored starch turns to sugar. If a plant is wounded, ethene is released to the wound so that new tissue forms to heal it.",
    madeIn: "Ripening fruits and wounded tissue"
  }
];

export function getHormone(id: HormoneId): Hormone {
  return hormones.find((hormone) => hormone.id === id) as Hormone;
}

export const promoterIds: HormoneId[] = ["auxin", "gibberellin", "cytokinin"];

// ---- The two apex experiments (Activity 7.1 and 7.2) ----
export interface ApexExperiment {
  id: "height" | "light";
  title: string;
  emoji: string;
  method: string;
  withApex: string; // what the plant WITH its apex does
  withoutApex: string; // what the plant WITHOUT its apex does
  conclusion: string;
}

export const apexExperiments: ApexExperiment[] = [
  {
    id: "height",
    title: "Activity 1 · Does the apex affect height?",
    emoji: "📐",
    method:
      "Take two similar potted plants. Cut off the apex (tip) of one. Give both the same conditions and measure their heights daily for a week.",
    withApex: "Keeps growing — its height increases day by day.",
    withoutApex: "Barely changes — its height stays almost the same.",
    conclusion:
      "The apex increases the height of the plant, because growth substances are made there."
  },
  {
    id: "light",
    title: "Activity 2 · Does the apex affect direction?",
    emoji: "🔦",
    method:
      "Put both plants in a box that lets light in from one side only. Watch which way each plant grows.",
    withApex: "Bends and grows toward the light.",
    withoutApex: "Does not turn — it cannot respond to the light.",
    conclusion:
      "The apex lets the plant grow toward light. The chemical made there is a plant growth substance."
  }
];

// ---- Exercise 2: sort each effect under the hormone that causes it ----
export interface HormoneScenario {
  id: string;
  label: string;
  emoji: string;
  hormone: HormoneId;
  reason: string;
}

export const hormoneScenarios: HormoneScenario[] = [
  { id: "bend-light", label: "A shoot bends toward light", emoji: "🔦", hormone: "auxin", reason: "Auxin gathers on the shaded side and stretches those cells, so the tip curves to the light." },
  { id: "cell-elong", label: "Cells in the stem stretch longer", emoji: "🌱", hormone: "auxin", reason: "Auxin speeds up cell elongation, pushing the shoot upwards." },
  { id: "no-lateral", label: "Side (lateral) buds are held back", emoji: "🚧", hormone: "auxin", reason: "Auxin from the apex inhibits the growth of lateral buds." },

  { id: "tall-stem", label: "The stem grows much taller", emoji: "📏", hormone: "gibberellin", reason: "Gibberellin promotes elongation of the stem." },
  { id: "big-fruit", label: "Fruits grow bigger", emoji: "🍎", hormone: "gibberellin", reason: "Gibberellin promotes the growth of fruits." },

  { id: "cell-div", label: "Cells divide faster", emoji: "✂️", hormone: "cytokinin", reason: "Cytokinin accelerates cell division." },
  { id: "seed-germ", label: "Seeds germinate", emoji: "🌰", hormone: "cytokinin", reason: "Cytokinin stimulates seed germination." },
  { id: "delay-age", label: "The plant stays young for longer", emoji: "🕰️", hormone: "cytokinin", reason: "Cytokinin delays plant ageing." },

  { id: "close-stomata", label: "Stomata close when water is short", emoji: "🚱", hormone: "abscisic", reason: "Abscisic acid closes the stomata to cut transpiration and save water." },
  { id: "inhibit-growth", label: "Growth is slowed down", emoji: "🛑", hormone: "abscisic", reason: "Abscisic acid is a growth inhibitor." },

  { id: "ripen-fruit", label: "A green banana ripens", emoji: "🍌", hormone: "ethene", reason: "Ethene ripens fruit — stored starch turns into sugar." },
  { id: "heal-wound", label: "A wound grows new tissue", emoji: "🩹", hormone: "ethene", reason: "Ethene is released to a wound so new healing tissue forms." }
];

export const hormoneBinInfo: Record<HormoneId, { title: string; emoji: string; hint: string }> = {
  auxin: { title: "Auxin", emoji: "🌿", hint: "elongation · phototropism" },
  gibberellin: { title: "Gibberellin", emoji: "📏", hint: "stem & fruit growth" },
  cytokinin: { title: "Cytokinin", emoji: "✂️", hint: "cell division" },
  abscisic: { title: "Abscisic acid", emoji: "🚱", hint: "inhibitor · stomata" },
  ethene: { title: "Ethene", emoji: "🍌", hint: "ripening · healing" }
};

// ---- 7.2 Artificial growth substances (Table 7.1) ----
export interface ArtificialSubstance {
  id: string;
  short: string; // abbreviation
  full: string; // full chemical name
  use: string;
  emoji: string;
}

export const artificialSubstances: ArtificialSubstance[] = [
  {
    id: "24d",
    short: "2,4-D",
    full: "2,4 Dichloro Phenoxyacetic Acid",
    use: "A broad-leaf weedicide for paddy fields.",
    emoji: "🌾"
  },
  {
    id: "245t",
    short: "2,4,5-T",
    full: "2,4,5 Trichloro Phenoxyacetic Acid",
    use: "A weedicide used to control weeds.",
    emoji: "🌿"
  },
  {
    id: "iaa",
    short: "IAA",
    full: "Indoleacetic Acid",
    use: "Induces root formation in stem cuttings and grows fruit quickly.",
    emoji: "🪴"
  },
  {
    id: "iba",
    short: "IBA",
    full: "Indolebutyric Acid",
    use: "Induces root formation in stem cuttings and grows fruit quickly.",
    emoji: "🌱"
  },
  {
    id: "naa",
    short: "NAA",
    full: "Naphthaleneacetic Acid",
    use: "Prevents pre-mature fruit drop; induces off-season flowering in pineapple.",
    emoji: "🍍"
  },
  {
    id: "cytocell",
    short: "Cytocell",
    full: "Cytocell",
    use: "Used to get mango fruits in the off-season.",
    emoji: "🥭"
  }
];

export const plantGrowthTerms: { term: string; meaning: string }[] = [
  { term: "Plant growth substance", meaning: "An organic chemical made in a plant that controls how it grows." },
  { term: "Growth promoter", meaning: "A substance that speeds growth up — auxin, gibberellin, cytokinin." },
  { term: "Growth inhibitor", meaning: "A substance that slows growth down — e.g. abscisic acid." },
  { term: "Apex", meaning: "The growing tip of a shoot or root, where growth substances are made." },
  { term: "Phototropic movement", meaning: "A plant growing toward (positive) a light source." },
  { term: "Stem elongation", meaning: "The lengthening of the stem as its cells stretch." },
  { term: "Seed germination", meaning: "The sprouting of a seed into a young plant." },
  { term: "Abscission layer", meaning: "The layer that forms so a ripe leaf or fruit can fall off." },
  { term: "Artificial growth substance", meaning: "A man-made growth substance used in farming and gardening." }
];
