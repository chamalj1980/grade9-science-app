import type { LearningModule, LearningSection } from "../types";
import { ModuleIllustration } from "./ModuleIllustration";

interface PlaceholderCardProps {
  module: LearningModule;
  section: LearningSection;
}

export function PlaceholderCard({ module, section }: PlaceholderCardProps) {
  return (
    <article className={`placeholder-card ${module.theme}`}>
      <div>
        <p className="eyebrow">{section.eyebrow}</p>
        <h2>{section.title}</h2>
        <p>{section.summary}</p>
      </div>
      <ModuleIllustration theme={module.theme} />
      <div className="placeholder-note" role="note">
        Initial shell placeholder. Interactive lesson and exercise content will be added
        in a later phase.
      </div>
    </article>
  );
}