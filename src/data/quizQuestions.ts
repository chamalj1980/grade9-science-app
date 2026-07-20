// The MCQ question bank for Quiz Arena (Phase 1). Questions are tagged to a built
// module id so the Module Quiz and Time Attack modes can pull a chapter's set. Every
// question has four options, the index of the correct one, and a short explanation
// shown as feedback. Facts follow the Grade 9 textbook for each chapter.

export type Difficulty = "easy" | "medium" | "hard";

export interface QuizQuestion {
  id: string;
  moduleId: string; // matches a LearningModule id in modules.ts
  prompt: string;
  options: string[]; // four choices
  answer: number; // index (0-3) of the correct option
  explanation: string; // revealed after answering
  difficulty: Difficulty;
}

export const quizQuestions: QuizQuestion[] = [
  // ------------------------------------------------------------------
  // The Evolutionary Process (chapter 9)
  // ------------------------------------------------------------------
  {
    id: "ev-1",
    moduleId: "evolution",
    prompt: "About how long ago is the Earth believed to have formed?",
    options: ["4.5 billion years", "3.5 million years", "5 000 years", "54 million years"],
    answer: 0,
    explanation: "The Earth formed about 4.5 billion years ago; life appeared about 3.5 billion years ago.",
    difficulty: "easy"
  },
  {
    id: "ev-2",
    moduleId: "evolution",
    prompt: "The first scientific theory of the origin of the solar system was the…",
    options: ["Big Bang theory", "Nebular theory", "Cosmozoic theory", "Special creation"],
    answer: 1,
    explanation: "The Nebular theory came first; the Big Bang theory is the modern explanation.",
    difficulty: "medium"
  },
  {
    id: "ev-3",
    moduleId: "evolution",
    prompt: "Which gas was ABSENT from the early Earth's atmosphere?",
    options: ["Carbon dioxide", "Methane", "Oxygen", "Hydrogen sulphide"],
    answer: 2,
    explanation: "The early atmosphere had CO₂, CH₄ and H₂S — the absence of oxygen is a key fact.",
    difficulty: "medium"
  },
  {
    id: "ev-4",
    moduleId: "evolution",
    prompt: "The accepted theory of the origin of life today is…",
    options: [
      "special creation",
      "spontaneous generation",
      "the cosmozoic theory",
      "bio-chemical evolution"
    ],
    answer: 3,
    explanation: "Bio-chemical evolution (the primordial soup) is accepted — proposed by Haldane & Oparin, proved by Stanley Miller.",
    difficulty: "medium"
  },
  {
    id: "ev-5",
    moduleId: "evolution",
    prompt: "Who disproved the spontaneous generation theory?",
    options: ["Charles Darwin", "Louis Pasteur", "Stanley Miller", "Ernest Rutherford"],
    answer: 1,
    explanation: "Louis Pasteur's swan-neck flask experiment showed life does not appear from non-living things by itself.",
    difficulty: "medium"
  },
  {
    id: "ev-6",
    moduleId: "evolution",
    prompt: "Which shows the correct order of evolution, earliest first?",
    options: [
      "Fish → bacteria → amphibians → reptiles",
      "Bacteria → algae → fish → amphibians → reptiles",
      "Reptiles → fish → bacteria → birds",
      "Algae → fish → bacteria → mammals"
    ],
    answer: 1,
    explanation: "Life went unicellular bacteria → algae → multicellular → fish → amphibians → reptiles → birds and mammals.",
    difficulty: "hard"
  },
  {
    id: "ev-7",
    moduleId: "evolution",
    prompt: "A 'living fossil', such as the Coelacanth, is an organism that…",
    options: [
      "is known only from fossils",
      "has survived almost unchanged for millions of years",
      "changes rapidly over time",
      "lived before the Earth formed"
    ],
    answer: 1,
    explanation: "Living fossils like the Coelacanth and Lingula have hardly changed over millions of years.",
    difficulty: "medium"
  },
  {
    id: "ev-8",
    moduleId: "evolution",
    prompt: "Who is considered the father of evolution?",
    options: ["Louis Pasteur", "Charles Darwin", "John Dalton", "Stanley Miller"],
    answer: 1,
    explanation: "Charles Darwin put forward the theory of natural selection — the accepted explanation of how evolution works.",
    difficulty: "easy"
  },

  // ------------------------------------------------------------------
  // Support and Movements of Organisms (chapter 8)
  // ------------------------------------------------------------------
  {
    id: "mv-1",
    moduleId: "support-movement",
    prompt: "Which appendage does an Amoeba use to move?",
    options: ["Cilia", "Flagellum", "Pseudopodia", "Limbs"],
    answer: 2,
    explanation: "Amoeba pushes out finger-like 'false feet' called pseudopodia to creep along.",
    difficulty: "easy"
  },
  {
    id: "mv-2",
    moduleId: "support-movement",
    prompt: "Paramecium moves using…",
    options: ["Cilia", "A flagellum", "A muscular foot", "Wings"],
    answer: 0,
    explanation: "Paramecium is covered in tiny hair-like cilia that beat to move it through water.",
    difficulty: "medium"
  },
  {
    id: "mv-3",
    moduleId: "support-movement",
    prompt: "Human movements need…",
    options: ["only bones", "only muscles", "both bones and muscles", "neither"],
    answer: 2,
    explanation: "Vertebrates like us move using muscles pulling on bones together.",
    difficulty: "easy"
  },
  {
    id: "mv-4",
    moduleId: "support-movement",
    prompt: "At the elbow, which muscle contracts to BEND (lift) the arm?",
    options: ["The triceps", "The biceps", "The humerus", "The tendon"],
    answer: 1,
    explanation: "The biceps contracts and pulls the radius, bending the arm; the triceps relaxes.",
    difficulty: "medium"
  },
  {
    id: "mv-5",
    moduleId: "support-movement",
    prompt: "What keeps a soft, non-woody plant standing upright?",
    options: [
      "Cellulose and lignin",
      "Water filling its cells (turgor)",
      "Its roots only",
      "Air pressure"
    ],
    answer: 1,
    explanation: "Soft plants stay erect through water/turgor and wilt when they dry out. Woody plants use cellulose and lignin.",
    difficulty: "medium"
  },
  {
    id: "mv-6",
    moduleId: "support-movement",
    prompt: "A stem growing towards light is an example of…",
    options: [
      "positive phototropism",
      "negative geotropism",
      "a haptonastic movement",
      "a nyctinastic movement"
    ],
    answer: 0,
    explanation: "Growth towards light is positive phototropism — a tropic movement.",
    difficulty: "medium"
  },
  {
    id: "mv-7",
    moduleId: "support-movement",
    prompt: "Mimosa leaves folding the instant they are touched is a…",
    options: [
      "nyctinastic movement",
      "haptonastic movement",
      "positive geotropic movement",
      "photonastic movement"
    ],
    answer: 1,
    explanation: "A response to touch, in a fixed direction, is a haptonastic (nastic) movement — a turgor change, not growth.",
    difficulty: "hard"
  },
  {
    id: "mv-8",
    moduleId: "support-movement",
    prompt: "How does a tropic movement differ from a nastic movement?",
    options: [
      "A tropic movement is faster",
      "A tropic movement's direction is linked to the stimulus; a nastic one is fixed",
      "A nastic movement is caused by growth substances",
      "There is no difference"
    ],
    answer: 1,
    explanation: "Tropic = growth whose direction depends on the stimulus. Nastic = a fixed response (usually a turgor change), whatever the stimulus direction.",
    difficulty: "hard"
  },

  // ------------------------------------------------------------------
  // Basic Concepts Associated with Force (chapter 4)
  // ------------------------------------------------------------------
  {
    id: "fo-1",
    moduleId: "force-basics",
    prompt: "A force is best described as…",
    options: ["A push or a pull", "Only a push", "A type of energy", "The weight of an object"],
    answer: 0,
    explanation: "A force is simply a push or a pull applied to an object.",
    difficulty: "easy"
  },
  {
    id: "fo-2",
    moduleId: "force-basics",
    prompt: "The SI unit used to measure the magnitude of a force is the…",
    options: ["Kilogram (kg)", "Newton (N)", "Pascal (Pa)", "Joule (J)"],
    answer: 1,
    explanation: "Force is measured in newtons (N). Spring balances in the lab are calibrated in N.",
    difficulty: "easy"
  },
  {
    id: "fo-3",
    moduleId: "force-basics",
    prompt: "Force is a vector quantity because it has…",
    options: [
      "only a magnitude",
      "only a direction",
      "a magnitude and a direction",
      "a point of application only"
    ],
    answer: 2,
    explanation:
      "A vector has both a magnitude and a direction — and a force has both, so it is a vector.",
    difficulty: "medium"
  },
  {
    id: "fo-4",
    moduleId: "force-basics",
    prompt: "Which instrument measures the magnitude of a force?",
    options: ["A stopwatch", "A measuring cylinder", "A Newton spring balance", "A thermometer"],
    answer: 2,
    explanation:
      "A spring balance's spring stretches in proportion to the force, and the scale reads it in newtons.",
    difficulty: "easy"
  },
  {
    id: "fo-5",
    moduleId: "force-basics",
    prompt: "When a force is drawn as an arrow, the LENGTH of the arrow shows the…",
    options: [
      "point of application",
      "magnitude of the force",
      "direction of the force",
      "speed of the object"
    ],
    answer: 1,
    explanation:
      "Length = magnitude (a 10 N arrow is twice as long as a 5 N one). The arrow head shows direction; the dot shows the point of application.",
    difficulty: "medium"
  },
  {
    id: "fo-6",
    moduleId: "force-basics",
    prompt: "Catching a moving cricket ball shows a force being used to…",
    options: [
      "start something moving",
      "stop something moving",
      "change the shape of an object",
      "change the direction of motion"
    ],
    answer: 1,
    explanation: "Your hands apply a force that stops the ball's motion.",
    difficulty: "medium"
  },
  {
    id: "fo-7",
    moduleId: "force-basics",
    prompt: "The weight of an object is…",
    options: [
      "the amount of matter in it",
      "the gravitational force the Earth pulls it with",
      "its size",
      "always measured in kilograms only"
    ],
    answer: 1,
    explanation:
      "Weight is the gravitational force pulling an object down — a force, measured in newtons.",
    difficulty: "medium"
  },
  {
    id: "fo-8",
    moduleId: "force-basics",
    prompt: "Fitting a handle to a cart so you can push higher up mainly changes the force's…",
    options: [
      "magnitude",
      "point of application",
      "unit",
      "weight"
    ],
    answer: 1,
    explanation:
      "Moving where the force is applied changes its point of application, making the job easier.",
    difficulty: "hard"
  },

  // ------------------------------------------------------------------
  // Nature and Properties of Matter (chapter 3)
  // ------------------------------------------------------------------
  {
    id: "ma-1",
    moduleId: "matter-properties",
    prompt: "The number of protons in the nucleus of an atom is called its…",
    options: ["Mass number", "Atomic number", "Neutron number", "Molecule number"],
    answer: 1,
    explanation:
      "The atomic number (Z) is the number of protons, and it is unique to each element.",
    difficulty: "easy"
  },
  {
    id: "ma-2",
    moduleId: "matter-properties",
    prompt: "The mass number of an atom is the sum of its…",
    options: [
      "Protons and electrons",
      "Neutrons and electrons",
      "Protons and neutrons",
      "Protons, neutrons and electrons"
    ],
    answer: 2,
    explanation: "Mass number (A) = protons + neutrons, the particles in the nucleus.",
    difficulty: "easy"
  },
  {
    id: "ma-3",
    moduleId: "matter-properties",
    prompt: "The numbers of protons, neutrons and electrons in a ³⁵₁₇Cl atom are…",
    options: ["17, 18, 18", "17, 18, 17", "17, 17, 18", "17, 17, 17"],
    answer: 1,
    explanation:
      "Z = 17 protons. Neutrons = 35 − 17 = 18. A neutral atom has electrons = protons = 17.",
    difficulty: "hard"
  },
  {
    id: "ma-4",
    moduleId: "matter-properties",
    prompt: "Which of these is a pure substance?",
    options: ["Air", "Salt solution", "Vinegar", "Copper sulphate"],
    answer: 3,
    explanation:
      "Copper sulphate is a compound — a pure substance. The others are mixtures.",
    difficulty: "medium"
  },
  {
    id: "ma-5",
    moduleId: "matter-properties",
    prompt: "The symbol Na for sodium comes from its Latin name…",
    options: ["Natrium", "Nautium", "Sodius", "Natron"],
    answer: 0,
    explanation:
      "Some symbols come from Latin names: Na (Natrium), Cu (Cuprum), Fe (Ferrum), Au (Aurum).",
    difficulty: "medium"
  },
  {
    id: "ma-6",
    moduleId: "matter-properties",
    prompt: "A molecule of oxygen, O₂, is described as…",
    options: [
      "Hetero-atomic, because it has two atoms",
      "Homo-atomic, because both atoms are the same",
      "A compound, because it is a molecule",
      "A mixture of two oxygen atoms"
    ],
    answer: 1,
    explanation:
      "Both atoms are oxygen, so O₂ is homo-atomic — it is still the element oxygen, not a compound.",
    difficulty: "medium"
  },
  {
    id: "ma-7",
    moduleId: "matter-properties",
    prompt: "Which statement about an atom is FALSE?",
    options: [
      "Atoms are the building units of matter.",
      "A large portion of an atom is empty space.",
      "There is a positively charged nucleus at its centre.",
      "An atom cannot be divided any further."
    ],
    answer: 3,
    explanation:
      "Atoms ARE divisible — they are made of protons, neutrons and electrons. Dalton's original idea was later corrected.",
    difficulty: "medium"
  },
  {
    id: "ma-8",
    moduleId: "matter-properties",
    prompt: "Muddy water is a heterogeneous mixture because…",
    options: [
      "It can be separated chemically",
      "Its composition is not uniform throughout",
      "It contains only one constituent",
      "It is a pure substance"
    ],
    answer: 1,
    explanation:
      "In a heterogeneous mixture the colour and composition change from place to place — unlike a salt solution.",
    difficulty: "easy"
  },

  // ------------------------------------------------------------------
  // Pressure Exerted by Solids (chapter 5)
  // ------------------------------------------------------------------
  {
    id: "pr-1",
    moduleId: "pressure-solids",
    prompt: "Pressure exerted by a solid is calculated as…",
    options: ["Force × Area", "Force ÷ Area", "Area ÷ Force", "Force + Area"],
    answer: 1,
    explanation: "Pressure = Force ÷ Area (P = F / A). The same force on a smaller area gives more pressure.",
    difficulty: "easy"
  },
  {
    id: "pr-2",
    moduleId: "pressure-solids",
    prompt: "The SI unit used to measure pressure is the…",
    options: ["Newton (N)", "Pascal (Pa)", "Joule (J)", "Watt (W)"],
    answer: 1,
    explanation: "Pressure is measured in pascals (Pa), where 1 Pa = 1 N/m².",
    difficulty: "easy"
  },
  {
    id: "pr-3",
    moduleId: "pressure-solids",
    prompt: "To INCREASE the pressure made by a force, you should…",
    options: [
      "Increase the contact area",
      "Decrease the contact area",
      "Keep the area the same",
      "Remove the force"
    ],
    answer: 1,
    explanation: "Smaller area → higher pressure. This is why knives and nails are made sharp.",
    difficulty: "medium"
  },
  {
    id: "pr-4",
    moduleId: "pressure-solids",
    prompt: "A force of 20 N acts on an area of 4 m². The pressure is…",
    options: ["5 Pa", "16 Pa", "24 Pa", "80 Pa"],
    answer: 0,
    explanation: "P = F / A = 20 N ÷ 4 m² = 5 Pa.",
    difficulty: "medium"
  },
  {
    id: "pr-5",
    moduleId: "pressure-solids",
    prompt: "A camel has wide, flat feet mainly to…",
    options: [
      "Increase pressure on the sand",
      "Reduce pressure on the sand",
      "Run faster",
      "Stay warm"
    ],
    answer: 1,
    explanation: "Wide feet spread the weight over a larger area, reducing pressure so the camel doesn't sink.",
    difficulty: "medium"
  },
  {
    id: "pr-6",
    moduleId: "pressure-solids",
    prompt: "A school bag with wide straps is more comfortable because wide straps…",
    options: [
      "Reduce the total force",
      "Increase the contact area, lowering pressure",
      "Increase the pressure on the shoulder",
      "Make the bag lighter"
    ],
    answer: 1,
    explanation: "Wider straps spread the same weight over a bigger area, so the pressure on your shoulders is lower.",
    difficulty: "medium"
  },
  {
    id: "pr-7",
    moduleId: "pressure-solids",
    prompt: "Three identical bricks rest on the ground in different positions. Which face down gives the GREATEST pressure?",
    options: [
      "The largest face",
      "The smallest face",
      "The medium face",
      "Pressure is the same for all"
    ],
    answer: 1,
    explanation: "Same weight on the smallest face = smallest area = greatest pressure.",
    difficulty: "hard"
  },
  {
    id: "pr-8",
    moduleId: "pressure-solids",
    prompt: "1 pascal (Pa) is the same as…",
    options: ["1 N", "1 N/m²", "1 N·m", "1 m²/N"],
    answer: 1,
    explanation: "One pascal is one newton acting on one square metre: 1 Pa = 1 N/m².",
    difficulty: "easy"
  },

  // ------------------------------------------------------------------
  // The Human Circulatory System (chapter 6)
  // ------------------------------------------------------------------
  {
    id: "ci-1",
    moduleId: "circulatory-system",
    prompt: "The two upper chambers of the heart are called the…",
    options: ["Ventricles", "Atria", "Valves", "Arteries"],
    answer: 1,
    explanation: "The upper chambers are the atria (they receive blood); the lower chambers are the ventricles.",
    difficulty: "easy"
  },
  {
    id: "ci-2",
    moduleId: "circulatory-system",
    prompt: "Which chamber has the thickest, most muscular wall?",
    options: ["Right atrium", "Left atrium", "Right ventricle", "Left ventricle"],
    answer: 3,
    explanation: "The left ventricle pumps blood all around the body, so it needs the thickest muscle.",
    difficulty: "medium"
  },
  {
    id: "ci-3",
    moduleId: "circulatory-system",
    prompt: "Blood vessels that carry blood TOWARD the heart are…",
    options: ["Arteries", "Veins", "Capillaries", "Ventricles"],
    answer: 1,
    explanation: "Veins carry blood toward the heart; arteries carry it away.",
    difficulty: "easy"
  },
  {
    id: "ci-4",
    moduleId: "circulatory-system",
    prompt: "The blood component that carries oxygen is the…",
    options: ["White blood cell", "Platelet", "Red blood cell", "Plasma"],
    answer: 2,
    explanation: "Red blood cells contain haemoglobin, which binds and carries oxygen.",
    difficulty: "easy"
  },
  {
    id: "ci-5",
    moduleId: "circulatory-system",
    prompt: "The pulmonary artery is unusual because it carries…",
    options: [
      "Oxygenated blood to the body",
      "Deoxygenated blood to the lungs",
      "Oxygenated blood to the lungs",
      "Deoxygenated blood to the body"
    ],
    answer: 1,
    explanation: "It's the only artery carrying deoxygenated (low-oxygen) blood — from the right ventricle to the lungs.",
    difficulty: "hard"
  },
  {
    id: "ci-6",
    moduleId: "circulatory-system",
    prompt: "Which blood group is known as the universal donor?",
    options: ["AB positive", "O negative", "A positive", "B negative"],
    answer: 1,
    explanation: "O negative has no A, B or Rh antigens, so it can be given to almost anyone.",
    difficulty: "medium"
  },
  {
    id: "ci-7",
    moduleId: "circulatory-system",
    prompt: "The straw-coloured liquid part of blood is called…",
    options: ["Plasma", "Serum wax", "Lymph oil", "Haemoglobin"],
    answer: 0,
    explanation: "Plasma is the liquid that carries the blood cells, nutrients and wastes.",
    difficulty: "easy"
  },
  {
    id: "ci-8",
    moduleId: "circulatory-system",
    prompt: "Valves in the heart and veins are important because they…",
    options: [
      "Speed the blood up",
      "Stop blood flowing backwards",
      "Add oxygen to blood",
      "Make blood red"
    ],
    answer: 1,
    explanation: "Valves are one-way doors that prevent backflow, keeping blood moving in the right direction.",
    difficulty: "medium"
  },

  // ------------------------------------------------------------------
  // Eye and Ear (chapter 2)
  // ------------------------------------------------------------------
  {
    id: "se-1",
    moduleId: "sensory-system",
    prompt: "The part of the eye that focuses light onto the retina is the…",
    options: ["Cornea", "Iris", "Lens", "Pupil"],
    answer: 2,
    explanation: "The lens changes shape to focus light sharply on the retina (accommodation).",
    difficulty: "easy"
  },
  {
    id: "se-2",
    moduleId: "sensory-system",
    prompt: "The light-sensitive layer at the back of the eye is the…",
    options: ["Retina", "Cornea", "Sclera", "Iris"],
    answer: 0,
    explanation: "The retina holds light receptors that turn light into nerve signals.",
    difficulty: "easy"
  },
  {
    id: "se-3",
    moduleId: "sensory-system",
    prompt: "The coloured part of the eye that controls the size of the pupil is the…",
    options: ["Lens", "Iris", "Retina", "Cornea"],
    answer: 1,
    explanation: "The iris widens or narrows the pupil to control how much light enters.",
    difficulty: "easy"
  },
  {
    id: "se-4",
    moduleId: "sensory-system",
    prompt: "Short-sightedness (myopia) is corrected using a…",
    options: [
      "Convex (converging) lens",
      "Concave (diverging) lens",
      "Flat glass",
      "Coloured lens"
    ],
    answer: 1,
    explanation: "A concave lens spreads light slightly so the image forms on the retina, not in front of it.",
    difficulty: "hard"
  },
  {
    id: "se-5",
    moduleId: "sensory-system",
    prompt: "The part of the ear that contains the hearing receptors is the…",
    options: ["Eardrum", "Cochlea", "Ear canal", "Pinna"],
    answer: 1,
    explanation: "The spiral cochlea in the inner ear turns sound vibrations into nerve signals.",
    difficulty: "medium"
  },
  {
    id: "se-6",
    moduleId: "sensory-system",
    prompt: "Which part of the ear helps us keep our balance?",
    options: [
      "The three semicircular canals",
      "The eardrum",
      "The ear lobe",
      "The outer ear"
    ],
    answer: 0,
    explanation: "The semicircular canals detect movement of the head and help us balance.",
    difficulty: "medium"
  },
  {
    id: "se-7",
    moduleId: "sensory-system",
    prompt: "The three tiny ear bones (ossicles) are found in the…",
    options: ["Outer ear", "Middle ear", "Inner ear", "Ear canal"],
    answer: 1,
    explanation: "The hammer, anvil and stirrup in the middle ear pass vibrations from the eardrum to the cochlea.",
    difficulty: "medium"
  },
  {
    id: "se-8",
    moduleId: "sensory-system",
    prompt: "The 'blind spot' of the eye is the point where…",
    options: [
      "The lens sits",
      "The optic nerve leaves the eye",
      "Light first enters",
      "Tears are made"
    ],
    answer: 1,
    explanation: "There are no light receptors where the optic nerve leaves the retina, so that spot cannot see.",
    difficulty: "hard"
  },

  // ------------------------------------------------------------------
  // Applications of Micro-organisms (chapter 1)
  // ------------------------------------------------------------------
  {
    id: "mi-1",
    moduleId: "micro-organisms",
    prompt: "A group of autotrophic micro-organisms (they make their own food) is…",
    options: ["Viruses", "Fungi", "Algae", "Protozoa"],
    answer: 2,
    explanation: "Algae have chloroplasts and photosynthesise, so they are autotrophs.",
    difficulty: "medium"
  },
  {
    id: "mi-2",
    moduleId: "micro-organisms",
    prompt: "Chemicals produced by microbes to destroy other microbes are called…",
    options: ["Antibodies", "Antiseptics", "Antibiotics", "Anti-nutrients"],
    answer: 2,
    explanation: "Antibiotics (like penicillin from Penicillium) are used as medicines against bacteria.",
    difficulty: "easy"
  },
  {
    id: "mi-3",
    moduleId: "micro-organisms",
    prompt: "A disease caused by bacteria is…",
    options: ["Malaria", "Tuberculosis", "Rabies", "Dengue"],
    answer: 1,
    explanation: "Tuberculosis is bacterial. Malaria is protozoan; rabies and dengue are viral.",
    difficulty: "medium"
  },
  {
    id: "mi-4",
    moduleId: "micro-organisms",
    prompt: "Using microbes to remove pollutants from the environment is called…",
    options: ["Bio-control", "Bio-remediation", "Bio-leaching", "Bio-fixing"],
    answer: 1,
    explanation: "Bio-remediation, e.g. Pseudomonas breaking down oil spills, cleans up pollution.",
    difficulty: "hard"
  },
  {
    id: "mi-5",
    moduleId: "micro-organisms",
    prompt: "Which bacterium fixes atmospheric nitrogen in the root nodules of legumes?",
    options: ["Azotobacter", "Rhizobium", "Lactobacillus", "Acetobacter"],
    answer: 1,
    explanation: "Rhizobium lives in legume root nodules and fixes nitrogen, enriching the soil.",
    difficulty: "medium"
  },
  {
    id: "mi-6",
    moduleId: "micro-organisms",
    prompt: "Antibiotics can fight bacteria and fungi, but they do NOT work against…",
    options: ["Viruses", "Bacteria", "Fungi", "All microbes"],
    answer: 0,
    explanation: "Viruses are not affected by antibiotics; viral illnesses need vaccines or antivirals.",
    difficulty: "medium"
  },
  {
    id: "mi-7",
    moduleId: "micro-organisms",
    prompt: "Yeast, a single-celled fungus, reproduces mainly by…",
    options: ["Budding", "Nitrogen fixation", "Binary fission only", "Making spores in the air"],
    answer: 0,
    explanation: "A small bud grows out of the parent yeast cell and breaks off — this is budding.",
    difficulty: "easy"
  },
  {
    id: "mi-8",
    moduleId: "micro-organisms",
    prompt: "Which microbe is used to turn milk into yoghurt?",
    options: ["Rhizobium", "Lactobacillus", "Penicillium", "Methanococcus"],
    answer: 1,
    explanation: "Lactobacillus turns lactose into lactic acid, thickening and souring milk into yoghurt.",
    difficulty: "easy"
  },

  // ------------------------------------------------------------------
  // Plant Growth Substances (chapter 7)
  // ------------------------------------------------------------------
  {
    id: "pg-1",
    moduleId: "plant-growth",
    prompt: "Chemical substances a plant makes to control its own growth are called…",
    options: [
      "Plant growth substances",
      "Minerals",
      "Enzymes only",
      "Pigments"
    ],
    answer: 0,
    explanation: "Plant growth substances are organic chemicals, made in the apex, that regulate how a plant grows.",
    difficulty: "easy"
  },
  {
    id: "pg-2",
    moduleId: "plant-growth",
    prompt: "In which part of the plant are growth substances mainly made?",
    options: ["The apex (growing tip)", "The old leaves", "The bark", "The dead wood"],
    answer: 0,
    explanation: "Cutting off the apex stops a plant gaining height, showing the growth substances are made there.",
    difficulty: "easy"
  },
  {
    id: "pg-3",
    moduleId: "plant-growth",
    prompt: "Which hormone makes a shoot bend toward light by collecting on its shaded side?",
    options: ["Auxin", "Gibberellin", "Cytokinin", "Abscisic acid"],
    answer: 0,
    explanation: "Auxin gathers on the darker side, stretches those cells, and the tip curves toward the light.",
    difficulty: "medium"
  },
  {
    id: "pg-4",
    moduleId: "plant-growth",
    prompt: "A plant curving toward a one-directional light source shows…",
    options: [
      "Positive phototropic movement",
      "Seed germination",
      "Ripening",
      "Wilting"
    ],
    answer: 0,
    explanation: "Growing toward light is a positive phototropic movement, driven by auxin.",
    difficulty: "medium"
  },
  {
    id: "pg-5",
    moduleId: "plant-growth",
    prompt: "Which growth substance mainly speeds up cell division?",
    options: ["Cytokinin", "Auxin", "Gibberellin", "Ethene"],
    answer: 0,
    explanation: "Cytokinin accelerates cell division, and also stimulates seed germination and delays ageing.",
    difficulty: "medium"
  },
  {
    id: "pg-6",
    moduleId: "plant-growth",
    prompt: "Which substance is a growth INHIBITOR that closes stomata when water is short?",
    options: ["Abscisic acid", "Auxin", "Gibberellin", "Cytokinin"],
    answer: 0,
    explanation: "Abscisic acid closes the stomata to cut transpiration and save water.",
    difficulty: "hard"
  },
  {
    id: "pg-7",
    moduleId: "plant-growth",
    prompt: "Which gas-like substance is needed for the ripening of fruits?",
    options: ["Ethene", "Auxin", "Oxygen", "Nitrogen"],
    answer: 0,
    explanation: "Ethene ripens fruit — the stored starch is turned into sugar — and helps heal wounds.",
    difficulty: "medium"
  },
  {
    id: "pg-8",
    moduleId: "plant-growth",
    prompt: "Which artificial growth substance is used as a broad-leaf weedicide in paddy fields?",
    options: ["2,4-D", "IAA", "NAA", "Cytocell"],
    answer: 0,
    explanation: "2,4-D (2,4 Dichloro Phenoxyacetic Acid) kills broad-leaf weeds in paddy fields.",
    difficulty: "hard"
  }
];
