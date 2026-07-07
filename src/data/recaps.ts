import type { RecapPoint } from "../courses/RecapView";

// Recap bullet content per module. Kept as data so the RecapView stays generic and
// new chapters can add their own recap without new components.
export const recaps: Record<
  string,
  { intro: string; points: RecapPoint[] }
> = {
  "pressure-solids": {
    intro: "The two factors, the formula, and the units in one place.",
    points: [
      {
        term: "Pressure",
        detail: "The perpendicular force acting on a unit area."
      },
      {
        term: "Formula",
        detail: "P = F / A (pressure = force ÷ area)."
      },
      {
        term: "Units",
        detail: "F in N, A in m², P in Nm⁻² or Pa. 1 Nm⁻² = 1 Pa."
      },
      {
        term: "More force",
        detail: "When area stays the same, more force means more pressure."
      },
      {
        term: "More area",
        detail: "When force stays the same, more contact area means less pressure."
      }
    ]
  },
  "circulatory-system": {
    intro: "The heart, the vessels, the blood, and safe transfusion in one place.",
    points: [
      {
        term: "Four chambers",
        detail:
          "Right and left atria on top receive blood; right and left ventricles below pump it out."
      },
      {
        term: "Main vessels",
        detail:
          "Aorta and pulmonary artery leave the ventricles; pulmonary veins and the two vena cavae return blood."
      },
      {
        term: "Valves",
        detail:
          "Tricuspid (right), bicuspid/mitral (left), and semilunar valves stop backflow."
      },
      {
        term: "Vessels",
        detail:
          "Arteries carry blood away (thick walls, high pressure); veins carry it back (thin walls, valves); capillaries exchange materials."
      },
      {
        term: "Blood",
        detail:
          "Plasma (~55%) plus corpuscles (~45%): erythrocytes carry oxygen, leukocytes defend, platelets clot."
      },
      {
        term: "Transfusion",
        detail:
          "O is the universal donor, AB is the universal recipient, and Rh⁻ recipients receive Rh⁻ only. Mismatches cause agglutination."
      }
    ]
  }
};
