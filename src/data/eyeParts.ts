// Parts of the human eye for the cross-section figure (textbook figure 2.2 / table 2.1).
// Marker coordinates are in the 0 0 360 300 viewBox used by EyeFigure (front/cornea on the
// left, where light enters; retina and optic nerve at the back on the right). "side"
// positions the locked-in label in the Label the Eye exercise.
export type EyeLevel = "major" | "support";

export interface EyePart {
  id: string;
  label: string;
  short: string;
  fact: string;
  level: EyeLevel;
  marker: { x: number; y: number };
  side: "left" | "right";
}

export const eyeParts: EyePart[] = [
  {
    id: "cornea",
    label: "Cornea",
    short:
      "The transparent front of the eye. The sclerotic layer becomes thin and clear here, and it begins bending the light that enters.",
    fact: "The transparent front layer where light first enters and starts to refract.",
    level: "major",
    marker: { x: 56, y: 150 },
    side: "left"
  },
  {
    id: "pupil",
    label: "Pupil",
    short:
      "The hole in the centre of the iris. It lets light pass through to the lens.",
    fact: "The opening in the middle of the iris that lets light through.",
    level: "major",
    marker: { x: 96, y: 150 },
    side: "left"
  },
  {
    id: "iris",
    label: "Iris",
    short:
      "The coloured ring around the pupil. It controls how much light enters the eye by changing the pupil's size.",
    fact: "Controls the amount of light entering the eye.",
    level: "major",
    marker: { x: 96, y: 106 },
    side: "left"
  },
  {
    id: "lens",
    label: "Lens",
    short:
      "A transparent biconvex lens that can change its curvature to focus images sharply on the retina.",
    fact: "A biconvex lens that changes shape to focus images on the retina.",
    level: "major",
    marker: { x: 150, y: 150 },
    side: "left"
  },
  {
    id: "retina",
    label: "Retina",
    short:
      "The light-sensitive inner layer at the back of the eye. It holds the rod cells and cone cells that detect light.",
    fact: "The light-sensitive layer where the image forms; holds rod and cone cells.",
    level: "major",
    marker: { x: 288, y: 120 },
    side: "right"
  },
  {
    id: "optic-nerve",
    label: "Optic nerve",
    short:
      "The nerve that connects the eye to the brain. It carries the visual message from the retina to be interpreted.",
    fact: "Carries the visual message from the retina to the brain.",
    level: "major",
    marker: { x: 338, y: 206 },
    side: "right"
  },
  {
    id: "sclerotic-layer",
    label: "Sclerotic layer",
    short:
      "The tough, white outermost layer of the eye. Light does not pass through it; it protects and holds the eye's shape.",
    fact: "The tough white outer layer; light does not pass through it.",
    level: "support",
    marker: { x: 196, y: 40 },
    side: "right"
  },
  {
    id: "choroid",
    label: "Choroid layer",
    short:
      "The layer just inside the sclerotic layer. It supplies blood to the eye.",
    fact: "Supplies blood to the eye; lies inside the sclerotic layer.",
    level: "support",
    marker: { x: 258, y: 72 },
    side: "right"
  },
  {
    id: "ciliary-muscle",
    label: "Ciliary muscle",
    short:
      "The muscle that holds the lens and changes its curvature so the eye can focus on near and far objects.",
    fact: "Holds the lens and changes its curvature to focus.",
    level: "support",
    marker: { x: 168, y: 100 },
    side: "left"
  },
  {
    id: "aqueous-humour",
    label: "Aqueous humour",
    short:
      "A transparent watery liquid that fills the space between the cornea and the lens.",
    fact: "Watery liquid filling the space between the cornea and lens.",
    level: "support",
    marker: { x: 122, y: 118 },
    side: "left"
  },
  {
    id: "vitreous-humour",
    label: "Vitreous humour",
    short:
      "A transparent jelly-like substance filling the large space behind the lens. It helps keep the eye's round shape.",
    fact: "Jelly-like substance that keeps the eye's spherical shape.",
    level: "support",
    marker: { x: 212, y: 176 },
    side: "right"
  },
  {
    id: "fovea",
    label: "Fovea (yellow spot)",
    short:
      "The most sensitive part of the retina, where the sharpest images are formed.",
    fact: "The sharpest-vision spot on the retina.",
    level: "support",
    marker: { x: 298, y: 152 },
    side: "right"
  },
  {
    id: "blind-spot",
    label: "Blind spot",
    short:
      "The area of the retina where the optic nerve leaves. It has no light-sensitive cells, so no image is seen there.",
    fact: "Where the optic nerve leaves; no light-sensitive cells, so no vision.",
    level: "support",
    marker: { x: 300, y: 186 },
    side: "right"
  }
];

// Level grouping used by the Label the Eye exercise (spec Exercise 1).
export interface EyeLevelGroup {
  id: EyeLevel;
  title: string;
  partIds: string[];
}

export const eyeLevels: EyeLevelGroup[] = [
  {
    id: "major",
    title: "Level 1 · Main parts",
    partIds: ["cornea", "pupil", "iris", "lens", "retina", "optic-nerve"]
  },
  {
    id: "support",
    title: "Level 2 · Supporting parts",
    partIds: [
      "sclerotic-layer",
      "choroid",
      "ciliary-muscle",
      "aqueous-humour",
      "vitreous-humour",
      "fovea",
      "blind-spot"
    ]
  }
];
