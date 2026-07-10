// Parts of the human ear for the cross-section figure (textbook figure 2.28 / table 2.2).
// Marker coordinates are in a 0 0 360 300 viewBox (outer ear / pinna on the left, inner
// ear on the right). Coordinates are placeholders tuned to EarFigure in Phase 3.
// "region" groups parts as outer / middle / inner; "side" positions the locked label.
export type EarRegion = "outer" | "middle" | "inner";

export interface EarPart {
  id: string;
  label: string;
  short: string;
  fact: string;
  region: EarRegion;
  marker: { x: number; y: number };
  side: "left" | "right";
}

export const earParts: EarPart[] = [
  {
    id: "pinna",
    label: "Pinna (ear lobe)",
    short:
      "The cartilage flap on the outside of the head. It catches sound waves and directs them into the auditory canal.",
    fact: "Directs sound waves into the auditory canal.",
    region: "outer",
    marker: { x: 42, y: 150 },
    side: "left"
  },
  {
    id: "external-auditory-canal",
    label: "External auditory canal",
    short:
      "The tube leading inward from the pinna. It carries sound to the tympanic membrane.",
    fact: "Carries sound to the tympanic membrane.",
    region: "outer",
    marker: { x: 116, y: 150 },
    side: "left"
  },
  {
    id: "tympanic-membrane",
    label: "Tympanic membrane",
    short:
      "The eardrum. It vibrates in response to sound waves, turning them into movement.",
    fact: "The eardrum; vibrates in response to sound waves.",
    region: "outer",
    marker: { x: 166, y: 154 },
    side: "left"
  },
  {
    id: "ossicles",
    label: "Ossicles",
    short:
      "Three tiny bones — the malleus, incus and stapes. They pass the eardrum's vibration on to the cochlea.",
    fact: "Three bones (malleus, incus, stapes) that pass vibration to the cochlea.",
    region: "middle",
    marker: { x: 198, y: 118 },
    side: "right"
  },
  {
    id: "eustachian-tube",
    label: "Eustachian tube",
    short:
      "An open tube connected to the pharynx. It balances the air pressure on both sides of the eardrum.",
    fact: "Balances the air pressure on both sides of the eardrum.",
    region: "middle",
    marker: { x: 206, y: 214 },
    side: "right"
  },
  {
    id: "cochlea",
    label: "Cochlea",
    short:
      "The spiral organ of the inner ear. The nerve endings of the auditory nerve connect here and turn vibrations into signals.",
    fact: "Turns vibrations into signals for the auditory nerve.",
    region: "inner",
    marker: { x: 250, y: 182 },
    side: "right"
  },
  {
    id: "auditory-nerve",
    label: "Auditory nerve",
    short:
      "The nerve that carries the sound signals from the cochlea to the hearing area of the brain.",
    fact: "Carries sound signals from the cochlea to the brain.",
    region: "inner",
    marker: { x: 320, y: 196 },
    side: "right"
  },
  {
    id: "semicircular-canals",
    label: "Semicircular canals",
    short:
      "Three looped tubes in the inner ear. They help the body keep its balance, not hearing.",
    fact: "Help maintain the body's balance.",
    region: "inner",
    marker: { x: 262, y: 90 },
    side: "right"
  }
];

// Region grouping used by the lesson info panels and the Label the Ear exercise.
export interface EarRegionGroup {
  id: EarRegion;
  title: string;
  partIds: string[];
}

export const earRegions: EarRegionGroup[] = [
  {
    id: "outer",
    title: "Outer ear",
    partIds: ["pinna", "external-auditory-canal", "tympanic-membrane"]
  },
  {
    id: "middle",
    title: "Middle ear",
    partIds: ["ossicles", "eustachian-tube"]
  },
  {
    id: "inner",
    title: "Inner ear",
    partIds: ["cochlea", "auditory-nerve", "semicircular-canals"]
  }
];
