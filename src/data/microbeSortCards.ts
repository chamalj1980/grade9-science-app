// Sort-the-scene cards for Exercise 2. Each scene is either a beneficial (favourable)
// or an adverse (harmful) effect of micro-organisms, from the textbook's section 1.3.
export type MicrobeEffect = "beneficial" | "harmful";

export interface MicrobeSortCard {
  id: string;
  label: string;
  emoji: string;
  effect: MicrobeEffect;
  reason: string;
}

export const microbeSortCards: MicrobeSortCard[] = [
  // ---- Beneficial ----
  {
    id: "rhizobium",
    label: "Rhizobium in root nodules",
    emoji: "🌱",
    effect: "beneficial",
    reason: "It fixes atmospheric nitrogen, enriching the soil for legumes."
  },
  {
    id: "yeast-bread",
    label: "Yeast making bread rise",
    emoji: "🍞",
    effect: "beneficial",
    reason: "Saccharomyces is used in the bakery industry and to make alcohol."
  },
  {
    id: "yoghurt",
    label: "Lactobacillus making yoghurt",
    emoji: "🥛",
    effect: "beneficial",
    reason: "It turns lactose into lactic acid to make yoghurt and curd."
  },
  {
    id: "penicillin",
    label: "Penicillium making penicillin",
    emoji: "💊",
    effect: "beneficial",
    reason: "This antibiotic destroys harmful bacteria."
  },
  {
    id: "biogas",
    label: "Bacteria producing biogas",
    emoji: "🔥",
    effect: "beneficial",
    reason: "Anaerobic bacteria produce methane that is used as an energy source."
  },
  {
    id: "oil-cleanup",
    label: "Pseudomonas cleaning an oil spill",
    emoji: "🛢️",
    effect: "beneficial",
    reason: "Bio-remediation breaks down the hydrocarbons in the oil layer."
  },

  // ---- Harmful ----
  {
    id: "anthrax",
    label: "Bacillus anthracis causing anthrax",
    emoji: "☠️",
    effect: "harmful",
    reason: "It is a pathogen and even used as a biological weapon."
  },
  {
    id: "malaria",
    label: "Plasmodium causing malaria",
    emoji: "🦟",
    effect: "harmful",
    reason: "This protozoan pathogen is carried to humans by mosquito vectors."
  },
  {
    id: "food-spoilage",
    label: "Fungi spoiling bread and fruit",
    emoji: "🍞",
    effect: "harmful",
    reason: "Microbes change the food and make it unfit to eat — food spoilage."
  },
  {
    id: "cholera",
    label: "Vibrio cholerae causing cholera",
    emoji: "💧",
    effect: "harmful",
    reason: "This bacterium spreads through polluted water and food."
  },
  {
    id: "powdery-mildew",
    label: "Powdery mildew on crops",
    emoji: "🍇",
    effect: "harmful",
    reason: "A fungus damages the leaves, stem, flowers and fruit of the plant."
  },
  {
    id: "dengue",
    label: "Dengue virus causing dengue fever",
    emoji: "🦟",
    effect: "harmful",
    reason: "The virus is the pathogen; mosquitoes are the vectors that spread it."
  }
];
