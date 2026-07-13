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
  },
  "sensory-system": {
    intro: "The eye, the ear, how they focus and hear, and how to protect them.",
    points: [
      {
        term: "The eye",
        detail:
          "Light enters through the cornea and pupil, the lens focuses it, and a real, inverted image forms on the retina; the brain reads it as upright."
      },
      {
        term: "Focusing",
        detail:
          "The ciliary muscle changes the lens curvature (accommodation) so near and far objects both focus on the retina without moving it."
      },
      {
        term: "Vision defects",
        detail:
          "Short sight (myopia) is corrected with a concave lens; long sight (hypermetropia) is corrected with a convex lens."
      },
      {
        term: "Eye diseases",
        detail:
          "Cataract clouds the lens; glaucoma damages the optic nerve and is irreversible. Protect eyes from strong light and injury."
      },
      {
        term: "The ear",
        detail:
          "Sound vibrates the eardrum, the ossicles pass it to the cochlea, and the auditory nerve carries the signal to the brain."
      },
      {
        term: "Balance & safety",
        detail:
          "Semicircular canals keep balance. Humans hear 20 Hz–20,000 Hz; very loud sounds damage the ear, so protect it."
      }
    ]
  },
  "micro-organisms": {
    intro: "The groups, the beneficial uses, the harmful effects, and the key terms in one place.",
    points: [
      {
        term: "Five groups",
        detail:
          "Bacteria, fungi, protozoa, and algae are micro-organisms; viruses show both living and non-living characteristics and are studied with them."
      },
      {
        term: "Agriculture",
        detail:
          "Rhizobium and Azotobacter fix nitrogen, microbes make compost and bio-pesticides, and gene technology improves crops."
      },
      {
        term: "Medicine",
        detail:
          "Antibiotics (e.g. penicillin from Penicillium) kill bacteria and fungi but not viruses; vaccines and anti-toxins prevent disease."
      },
      {
        term: "Industry",
        detail:
          "Yeast makes bread and alcohol, Lactobacillus makes dairy, Acetobacter makes vinegar, plus biogas, metal extraction, and plant fibres."
      },
      {
        term: "Environment",
        detail:
          "Bio-remediation uses microbes to clean polluted water, break down oil spills, and remove heavy metals."
      },
      {
        term: "Harmful effects",
        detail:
          "Microbes cause disease (a pathogen spread by a vector to a host), spoil food, and can be used as biological weapons."
      }
    ]
  }
};
