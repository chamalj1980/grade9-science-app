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
  }
];
