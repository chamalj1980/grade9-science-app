import type { LearningModule, SectionId } from "../types";
import type { ModuleProgress } from "../utils/progress";
import { ModuleIllustration } from "./ModuleIllustration";
import { ProgressIndicator } from "./ProgressIndicator";

interface ModuleCardProps {
  module: LearningModule;
  progress: ModuleProgress;
  onSelectSection: (moduleId: string, sectionId: SectionId) => void;
}

export function ModuleCard({
  module,
  progress,
  onSelectSection
}: ModuleCardProps) {
  return (
    <article className={`module-card ${module.theme}`}>
      <div className="module-card-top">
        <div>
          <p className="chapter-label">Chapter {module.chapter}</p>
          <h2>{module.title}</h2>
          <p>{module.summary}</p>
        </div>
        <ModuleIllustration theme={module.theme} />
      </div>

      <div className="section-actions" aria-label={`${module.title} navigation`}>
        {module.sections.map((section) => (
          <button
            key={section.id}
            type="button"
            onClick={() => onSelectSection(module.id, section.id)}
          >
            {section.navLabel}
          </button>
        ))}
      </div>

      <ProgressIndicator
        id={`${module.id}-card-progress`}
        label={`${module.shortTitle} progress`}
        module={module}
        progress={progress}
      />
    </article>
  );
}