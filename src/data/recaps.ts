import type { RecapPoint } from "../courses/RecapView";

// Recap bullet content per module. Kept as data so the RecapView stays generic and
// new chapters can add their own recap without new components.
export const recaps: Record<
  string,
  { intro: string; points: RecapPoint[] }
> = {
  electrolysis: {
    intro:
      "Why liquids conduct, what a current does to them, and how we plate metals — in one place.",
    points: [
      {
        term: "Electrolytes & non-electrolytes",
        detail:
          "Liquids that conduct (electrolytes) contain mobile ions; those that don't (non-electrolytes) have none. Salt solution, copper sulphate and acidified water conduct; distilled water and kerosene do not."
      },
      {
        term: "Ionic compounds",
        detail:
          "Ionic solids (NaCl, CuSO₄) hold ions, but in the solid state they can't move — so solids don't conduct. Dissolved in water or melted (fused), the ions are free and the compound conducts."
      },
      {
        term: "Electrolysis",
        detail:
          "Passing a current through an electrolyte causes a chemical change that splits it into simpler substances. Electrodes carry the current in and out; inert electrodes (carbon, platinum) don't react."
      },
      {
        term: "Splitting water",
        detail:
          "Electrolysing acidified water gives hydrogen at the negative electrode (about twice the volume, burns with a 'pop') and oxygen at the positive electrode (relights a glowing splint)."
      },
      {
        term: "Electroplating",
        detail:
          "Coating one metal with another by electrolysis. The plating metal is the positive electrode, the object is the negative electrode, and the electrolyte is a salt of the plating metal."
      },
      {
        term: "Quality & uses",
        detail:
          "A slow change — a dilute solution and a low current — gives a thin, even, shiny coat. Electrolysis also extracts reactive metals (sodium, aluminium) and makes caustic soda."
      }
    ]
  },
  evolution: {
    intro:
      "The origins, the theories, the sequence of life, and the evidence in one place.",
    points: [
      {
        term: "Origin of the Earth",
        detail:
          "About 4.5 billion years ago. The Nebular theory was the first scientific idea; the Big Bang theory is the modern one. The early atmosphere had CO₂, CH₄ and H₂S but NO oxygen; rain formed the oceans."
      },
      {
        term: "Origin of life",
        detail:
          "About 3.5 billion years ago. Of the theories (special creation, spontaneous generation, cosmozoic, bio-chemical), bio-chemical evolution is accepted — the first cell formed in the 'primordial soup'."
      },
      {
        term: "Key scientists",
        detail:
          "Louis Pasteur disproved spontaneous generation; Haldane & Oparin proposed and Stanley Miller proved bio-chemical evolution; Charles Darwin gave the theory of natural selection."
      },
      {
        term: "The sequence of life",
        detail:
          "Unicellular bacteria → unicellular algae → multicellular organisms → fish → amphibians → reptiles → birds and mammals. This gradual change from simple to complex is evolution."
      },
      {
        term: "Fossils",
        detail:
          "The preserved remains, part or trace of a dead organism — the main evidence for evolution. In rock layers the oldest are at the bottom; ¹⁴C dates them. Living fossils (Coelacanth, Lingula) are barely changed."
      },
      {
        term: "Bio-diversity",
        detail:
          "Competition and natural selection establish the best-suited organisms; speciation creates new species. Together these build the bio-diversity of life."
      }
    ]
  },
  "support-movement": {
    intro:
      "How animals move, how bones and muscles work, and how plants move — in one place.",
    points: [
      {
        term: "Movement & locomotion",
        detail: "A movement is a change of position in response to a stimulus. Locomotion is the whole organism moving from place to place."
      },
      {
        term: "Animal appendages",
        detail: "Amoeba uses pseudopodia, Euglena a flagellum, Paramecium cilia; limbs, wings and flippers are used by larger animals; snails use a muscular foot and worms and snakes use body muscles."
      },
      {
        term: "Bones & muscles",
        detail: "Invertebrates move with muscles; vertebrates use bones and muscles together. A muscle can contract, relax and return to its length — and it can only pull, so muscles work in antagonistic pairs."
      },
      {
        term: "The elbow joint",
        detail: "The biceps contracts to bend the arm (pulling the radius); the triceps contracts to straighten it (pulling the ulna). Tendons join muscle to bone."
      },
      {
        term: "Plant support",
        detail: "Soft plants stay erect through water (turgor) and wilt when dry; woody plants stay rigid because of cellulose and lignin."
      },
      {
        term: "Tropic movements",
        detail: "Growth linked to the stimulus direction, caused by growth substances. Roots show positive geotropism and hydrotropism; stems show negative geotropism and positive phototropism; tendrils show thigmotropism; pollen tubes show chemotropism."
      },
      {
        term: "Nastic movements",
        detail: "A fixed-direction response, whatever the stimulus direction — a turgor change in the pulvinus, not growth. Mimosa folds on touch (haptonastic) or a shock (seismonastic); leaves 'sleep' in the dark (nyctinastic); flowers open at sunrise (photonastic)."
      },
      {
        term: "In-situ conservation",
        detail: "Because plants can't move away from danger, we conserve them in their own habitat — for example in strictly reserved forests protecting ebony, satinwood and vitex."
      }
    ]
  },
  "force-basics": {
    intro:
      "What a force can do, how big it is, and how to draw it — in one place.",
    points: [
      {
        term: "Force",
        detail: "A push or a pull. It can move a resting object, stop a moving one, change its speed or direction, or change its shape."
      },
      {
        term: "Magnitude",
        detail: "How big a force is, measured in newtons (N) with a spring balance, whose spring stretches further for a bigger force."
      },
      {
        term: "Weight",
        detail: "The gravitational force the Earth pulls an object down with — a force, measured in newtons."
      },
      {
        term: "Force is a vector",
        detail: "It has both a magnitude and a direction. The point where it acts is the point of application."
      },
      {
        term: "Drawing a force",
        detail: "An arrow: its LENGTH shows the magnitude, its ARROW HEAD shows the direction, and the DOT at its start shows the point of application. A 10 N arrow is twice as long as a 5 N one."
      },
      {
        term: "Working cleverly",
        detail: "We change a force's direction or point of application to make everyday jobs easier, like fitting a handle to a cart."
      }
    ]
  },
  "matter-properties": {
    intro:
      "How matter is classified, how symbols work, and what an atom is made of — in one place.",
    points: [
      {
        term: "Classifying matter",
        detail:
          "Matter is either a pure substance or a mixture. Pure substances split into elements and compounds; mixtures into homogeneous and heterogeneous."
      },
      {
        term: "Element",
        detail:
          "A pure substance made of only one kind of atom. It cannot be broken into anything simpler by physical or chemical means. About 120 are known."
      },
      {
        term: "Compound",
        detail:
          "Two or more elements chemically combined in a fixed ratio, e.g. water (H₂O), sodium chloride (NaCl), glucose (C₆H₁₂O₆)."
      },
      {
        term: "Mixture",
        detail:
          "Two or more constituents simply mixed — they keep their own properties and can be separated by physical methods such as sifting, winnowing or distillation."
      },
      {
        term: "Symbols",
        detail:
          "One capital letter (C, O, S), or two letters with the second one small (Cl, Ca, Mg). Some come from Latin: Na (Natrium), Cu (Cuprum), Fe (Ferrum), Au (Aurum), Pb (Plumbum), Ag (Argentum), Hg (Hydrargyrum)."
      },
      {
        term: "Atoms and molecules",
        detail:
          "Atoms are the building units of elements. A molecule is joined atoms: homo-atomic if the atoms are the same (O₂), hetero-atomic if different (H₂O)."
      },
      {
        term: "Inside the atom",
        detail:
          "Mostly empty space, with a positively charged nucleus at the centre holding protons and neutrons. Electrons (about 1840× lighter) move around it."
      },
      {
        term: "Atomic number (Z)",
        detail:
          "The number of protons. It is unique to each element. In a neutral atom, electrons = protons."
      },
      {
        term: "Mass number (A)",
        detail:
          "Protons + neutrons. Written as ²³₁₁Na — mass number at the top-left, atomic number at the bottom-left."
      }
    ]
  },
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
  },
  "plant-growth": {
    intro:
      "What the apex does, the growth promoters and inhibitors, phototropism, and man-made substances in one place.",
    points: [
      {
        term: "Plant growth substances",
        detail:
          "Organic chemicals made in the apex that control how a plant grows. Some promote growth, some inhibit it."
      },
      {
        term: "The apex",
        detail:
          "The growing tip. Remove it and the plant stops gaining height and can't grow toward light — proof that growth substances are made there."
      },
      {
        term: "Auxin",
        detail:
          "Made in shoot and root tips (natural auxin is IAA). It stretches cells so the shoot grows up, collects on the shaded side to bend the tip toward light (positive phototropism), and holds lateral buds back."
      },
      {
        term: "Gibberellin & cytokinin",
        detail:
          "Gibberellin lengthens stems and grows fruit; cytokinin speeds cell division, stimulates seed germination, and delays ageing."
      },
      {
        term: "Inhibitors & others",
        detail:
          "Abscisic acid closes stomata when water is short. Ethene ripens fruit and heals wounds. As leaves and fruits mature, falling growth substances form an abscission layer so they drop."
      },
      {
        term: "Artificial substances",
        detail:
          "Man-made growth substances: 2,4-D and 2,4,5-T (weedicides), IAA/IBA (rooting), NAA (stops fruit drop, off-season pineapple flowering), Cytocell (off-season mango)."
      }
    ]
  }
};
