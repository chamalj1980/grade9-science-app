// Heart parts for the longitudinal section (spec figure 6.2). Marker coordinates are
// in the 0 0 360 340 viewBox used by HeartFigure. "side" positions the locked-in label.
export type HeartLevel = "chamber" | "vessel" | "valve";

export interface HeartPart {
  id: string;
  label: string;
  short: string;
  fact: string;
  level: HeartLevel;
  marker: { x: number; y: number };
  side: "left" | "right";
}

export const heartParts: HeartPart[] = [
  {
    id: "aorta",
    label: "Aorta",
    short: "The body's biggest artery. It leaves the left ventricle and carries oxygen-rich blood to the body.",
    fact: "Carries oxygen-rich blood from the left ventricle to the body.",
    level: "vessel",
    marker: { x: 135, y: 40 },
    side: "left"
  },
  {
    id: "pulmonary-artery",
    label: "Pulmonary artery",
    short: "Leaves the right ventricle and carries oxygen-poor blood to the lungs. The only artery with blue blood.",
    fact: "Carries oxygen-poor blood from the right ventricle to the lungs.",
    level: "vessel",
    marker: { x: 196, y: 40 },
    side: "right"
  },
  {
    id: "superior-vena-cava",
    label: "Superior vena cava",
    short: "A large vein bringing oxygen-poor blood from the upper body into the right atrium.",
    fact: "Brings blood from the upper body into the right atrium.",
    level: "vessel",
    marker: { x: 222, y: 30 },
    side: "right"
  },
  {
    id: "inferior-vena-cava",
    label: "Inferior vena cava",
    short: "A large vein bringing oxygen-poor blood from the lower body into the right atrium.",
    fact: "Brings blood from the lower body into the right atrium.",
    level: "vessel",
    marker: { x: 106, y: 292 },
    side: "left"
  },
  {
    id: "pulmonary-veins",
    label: "Pulmonary veins",
    short: "Bring oxygen-rich blood from the lungs into the left atrium. The only veins with red blood.",
    fact: "Bring oxygen-rich blood from the lungs into the left atrium.",
    level: "vessel",
    marker: { x: 258, y: 108 },
    side: "right"
  },
  {
    id: "right-atrium",
    label: "Right atrium",
    short: "Top-right chamber. It receives oxygen-poor blood from the vena cavae and sends it to the right ventricle.",
    fact: "Receives oxygen-poor blood from the two vena cavae.",
    level: "chamber",
    marker: { x: 128, y: 128 },
    side: "left"
  },
  {
    id: "left-atrium",
    label: "Left atrium",
    short: "Top-left chamber. It receives oxygen-rich blood from the pulmonary veins and sends it to the left ventricle.",
    fact: "Receives oxygen-rich blood from the pulmonary veins.",
    level: "chamber",
    marker: { x: 224, y: 128 },
    side: "right"
  },
  {
    id: "right-ventricle",
    label: "Right ventricle",
    short: "Lower-right chamber. It pumps oxygen-poor blood into the pulmonary artery to the lungs.",
    fact: "Pumps oxygen-poor blood to the lungs.",
    level: "chamber",
    marker: { x: 128, y: 226 },
    side: "left"
  },
  {
    id: "left-ventricle",
    label: "Left ventricle",
    short: "Lower-left chamber with the thickest wall. It pumps oxygen-rich blood into the aorta to the whole body.",
    fact: "Pumps oxygen-rich blood to the body — it has the thickest wall.",
    level: "chamber",
    marker: { x: 224, y: 226 },
    side: "right"
  },
  {
    id: "tricuspid-valve",
    label: "Tricuspid valve",
    short: "Sits between the right atrium and right ventricle and stops blood flowing backwards.",
    fact: "Between the right atrium and right ventricle.",
    level: "valve",
    marker: { x: 132, y: 176 },
    side: "left"
  },
  {
    id: "bicuspid-valve",
    label: "Bicuspid (mitral) valve",
    short: "Sits between the left atrium and left ventricle and stops blood flowing backwards.",
    fact: "Between the left atrium and left ventricle.",
    level: "valve",
    marker: { x: 226, y: 174 },
    side: "right"
  },
  {
    id: "semilunar-valves",
    label: "Semilunar valves",
    short: "Sit at the start of the aorta and pulmonary artery and stop blood returning to the ventricles.",
    fact: "At the start of the aorta and pulmonary artery.",
    level: "valve",
    marker: { x: 170, y: 86 },
    side: "left"
  }
];

// Level grouping used by the Label the Heart exercise (spec section 21).
export interface HeartLevelGroup {
  id: HeartLevel;
  title: string;
  partIds: string[];
}

export const heartLevels: HeartLevelGroup[] = [
  {
    id: "chamber",
    title: "Level 1 · Four chambers",
    partIds: ["right-atrium", "left-atrium", "right-ventricle", "left-ventricle"]
  },
  {
    id: "vessel",
    title: "Level 2 · Main vessels",
    partIds: [
      "aorta",
      "pulmonary-artery",
      "pulmonary-veins",
      "superior-vena-cava",
      "inferior-vena-cava"
    ]
  },
  {
    id: "valve",
    title: "Level 3 · Valves",
    partIds: ["tricuspid-valve", "bicuspid-valve", "semilunar-valves"]
  }
];
