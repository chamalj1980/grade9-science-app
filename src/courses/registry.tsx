import { PlaceholderCard } from "../components/PlaceholderCard";
import { recaps } from "../data/recaps";
import type { LearningModule, LearningSection } from "../types";
import { CirculatoryLesson } from "./circulatory/CirculatoryLesson";
import { HeartSimulation } from "./circulatory/HeartSimulation";
import { LabelTheHeart } from "./circulatory/LabelTheHeart";
import { TransfusionLab } from "./circulatory/TransfusionLab";
import { PressureLesson } from "./pressure/PressureLesson";
import { PressurePlayground } from "./pressure/PressurePlayground";
import { PressureSortAndCalc } from "./pressure/PressureSortAndCalc";
import { EyeSimulation } from "./sensory-system/EyeSimulation";
import { LabelTheSenses } from "./sensory-system/LabelTheSenses";
import { SenseClinic } from "./sensory-system/SenseClinic";
import { SensoryLesson } from "./sensory-system/SensoryLesson";
import { RecapView } from "./RecapView";
import type { SectionViewProps } from "./section";

// Central place that decides which view renders for a given module + section.
// Sections that are not built yet fall back to the placeholder card, so new content
// can be dropped in one entry at a time.
export function renderSection(
  module: LearningModule,
  section: LearningSection,
  progressProps: SectionViewProps
) {
  if (section.type === "recap") {
    const recap = recaps[module.id];

    if (recap) {
      return (
        <RecapView
          theme={module.theme}
          eyebrow={section.eyebrow}
          title={section.title}
          intro={recap.intro}
          points={recap.points}
          onProgress={progressProps.onProgress}
        />
      );
    }
  }

  if (module.id === "pressure-solids") {
    if (section.id === "lesson") {
      return <PressureLesson onProgress={progressProps.onProgress} />;
    }
    if (section.id === "exercise-1") {
      return <PressurePlayground onProgress={progressProps.onProgress} />;
    }
    if (section.id === "exercise-2") {
      return <PressureSortAndCalc onProgress={progressProps.onProgress} />;
    }
  }

  if (module.id === "circulatory-system") {
    if (section.id === "lesson") {
      return <CirculatoryLesson onProgress={progressProps.onProgress} />;
    }
    if (section.id === "simulation") {
      return <HeartSimulation onProgress={progressProps.onProgress} />;
    }
    if (section.id === "exercise-1") {
      return <LabelTheHeart onProgress={progressProps.onProgress} />;
    }
    if (section.id === "exercise-2") {
      return <TransfusionLab onProgress={progressProps.onProgress} />;
    }
  }

  if (module.id === "sensory-system") {
    if (section.id === "lesson") {
      return <SensoryLesson onProgress={progressProps.onProgress} />;
    }
    if (section.id === "simulation") {
      return <EyeSimulation onProgress={progressProps.onProgress} />;
    }
    if (section.id === "exercise-1") {
      return <LabelTheSenses onProgress={progressProps.onProgress} />;
    }
    if (section.id === "exercise-2") {
      return <SenseClinic onProgress={progressProps.onProgress} />;
    }
  }

  return <PlaceholderCard module={module} section={section} />;
}
