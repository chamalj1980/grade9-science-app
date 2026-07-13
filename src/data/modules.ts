import type { LearningModule } from "../types";

export const modules: LearningModule[] = [
  {
    id: "pressure-solids",
    chapter: 5,
    title: "Pressure Exerted by Solids",
    shortTitle: "Pressure",
    icon: "🧱",
    theme: "pressure",
    summary:
      "Explore how force and contact area change the pressure made by solid objects.",
    sections: [
      {
        id: "lesson",
        navLabel: "Lesson",
        title: "Pressure Lesson",
        eyebrow: "Concept builder",
        type: "lesson",
        summary:
          "Meet pressure through the school bag, soap-and-wire, and sponge activities, then P = F / A."
      },
      {
        id: "exercise-1",
        navLabel: "Exercise 1",
        title: "Pressure Playground",
        eyebrow: "Simulation",
        type: "simulation",
        summary:
          "Experiment with force, contact area, and live pressure feedback, then beat three challenges."
      },
      {
        id: "exercise-2",
        navLabel: "Exercise 2",
        title: "Increase or Decrease?",
        eyebrow: "Sort and calculate",
        type: "mixed-exercise",
        summary:
          "Sort real-life scenes by their pressure, then solve P = F / A calculation drills."
      },
      {
        id: "recap",
        navLabel: "Recap",
        title: "Pressure Recap",
        eyebrow: "Key ideas",
        type: "recap",
        summary: "The two factors, the formula, and the units in one quick card."
      }
    ]
  },
  {
    id: "circulatory-system",
    chapter: 6,
    title: "The Human Circulatory System",
    shortTitle: "Circulation",
    icon: "❤️",
    theme: "circulatory",
    summary:
      "Meet the heart, blood vessels, blood components, and safe transfusion rules.",
    sections: [
      {
        id: "lesson",
        navLabel: "Lesson",
        title: "Circulatory Lesson",
        eyebrow: "Concept builder",
        type: "lesson",
        summary:
          "Explore heart parts, blood flow, vessels, blood cells, and blood groups with animations."
      },
      {
        id: "simulation",
        navLabel: "3D Heart",
        title: "3D Heart Simulation",
        eyebrow: "Explore in 3D",
        type: "simulation",
        summary:
          "Rotate an interactive 3D heart, watch it beat, follow blood flow, and click parts to learn more."
      },
      {
        id: "exercise-1",
        navLabel: "Exercise 1",
        title: "Label the Heart",
        eyebrow: "Diagram practice",
        type: "labeling",
        summary:
          "Identify chambers, main vessels, and valves on a heart diagram, level by level."
      },
      {
        id: "exercise-2",
        navLabel: "Exercise 2",
        title: "Transfusion Lab",
        eyebrow: "Compatibility practice",
        type: "simulation",
        summary:
          "Check ABO and Rh compatibility for each patient, with instant agglutination feedback."
      },
      {
        id: "recap",
        navLabel: "Recap",
        title: "Circulatory Recap",
        eyebrow: "Key ideas",
        type: "recap",
        summary:
          "Chambers, vessels, valves, blood parts, and transfusion rules in one quick card."
      }
    ]
  },
  {
    id: "sensory-system",
    chapter: 2,
    title: "Eye and Ear",
    shortTitle: "Senses",
    icon: "👁️",
    theme: "sensory-system",
    summary:
      "Explore how the eye sees and the ear hears — structure, focusing, defects, and safe habits.",
    sections: [
      {
        id: "lesson",
        navLabel: "Lesson",
        title: "How We See and Hear",
        eyebrow: "Concept builder",
        type: "lesson",
        summary:
          "Click through the eye and ear, focus light on the retina, correct vision defects, and follow sound to the brain."
      },
      {
        id: "simulation",
        navLabel: "3D Eye",
        title: "3D Eye Simulation",
        eyebrow: "Explore in 3D",
        type: "simulation",
        summary:
          "Rotate an interactive 3D eye, follow light forming an image on the retina, and see vision defects and their correction."
      },
      {
        id: "exercise-1",
        navLabel: "Exercise 1",
        title: "Label It!",
        eyebrow: "Diagram practice",
        type: "labeling",
        summary:
          "Drag the names onto the eye and ear diagrams, level by level."
      },
      {
        id: "exercise-2",
        navLabel: "Exercise 2",
        title: "The Sense Clinic",
        eyebrow: "Diagnose and quiz",
        type: "mixed-exercise",
        summary:
          "Diagnose each patient's vision defect and prescribe the right lens, then take the recap quiz."
      },
      {
        id: "recap",
        navLabel: "Recap",
        title: "Eye & Ear Recap",
        eyebrow: "Key ideas",
        type: "recap",
        summary:
          "Eye and ear parts, focusing, defects, and safe habits in one quick card."
      }
    ]
  },
  {
    id: "micro-organisms",
    chapter: 1,
    title: "Applications of Micro-organisms",
    shortTitle: "Microbes",
    icon: "🦠",
    theme: "microbes",
    summary:
      "Meet the five groups of microbes and see how they help us — and sometimes harm us.",
    sections: [
      {
        id: "lesson",
        navLabel: "Lesson",
        title: "Applications of Micro-organisms",
        eyebrow: "Concept builder",
        type: "lesson",
        summary:
          "Explore bacteria, fungi, protozoa, algae, and viruses, then how microbes help farming, medicine, industry, and the environment."
      },
      {
        id: "simulation",
        navLabel: "3D Lab",
        title: "3D Microbe Lab",
        eyebrow: "Explore in 3D",
        type: "simulation",
        summary:
          "Build each microbe group in 3D, click parts to learn them, compare their sizes, and watch yeast ferment sugar into gas."
      },
      {
        id: "exercise-1",
        navLabel: "Exercise 1",
        title: "Match the Microbe",
        eyebrow: "Matching practice",
        type: "labeling",
        summary:
          "Match each microbe to the job it does, level by level: food, farming and medicine, then industry and environment."
      },
      {
        id: "exercise-2",
        navLabel: "Exercise 2",
        title: "Useful or Harmful?",
        eyebrow: "Sort and quiz",
        type: "mixed-exercise",
        summary:
          "Sort each scene by whether the microbe helps or harms, then take the recap quiz."
      },
      {
        id: "recap",
        navLabel: "Recap",
        title: "Micro-organisms Recap",
        eyebrow: "Key ideas",
        type: "recap",
        summary:
          "The five groups, beneficial uses, harmful effects, and key terms in one quick card."
      }
    ]
  }
];
