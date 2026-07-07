import type { LearningModule, SectionId } from "../types";
import type { ProgressState } from "../utils/progress";
import { ModuleCard } from "./ModuleCard";

interface ModulesOverviewProps {
  modules: LearningModule[];
  progress: ProgressState;
  onSelectSection: (moduleId: string, sectionId: SectionId) => void;
}

// Dedicated "Modules" screen (spec section 10 top-level nav): every chapter with its
// sections and progress, so students can jump straight to any part.
export function ModulesOverview({
  modules,
  progress,
  onSelectSection
}: ModulesOverviewProps) {
  return (
    <section className="modules-overview" aria-labelledby="modules-title">
      <div className="page-heading">
        <p className="eyebrow">Modules</p>
        <h1 id="modules-title">Science chapters</h1>
        <p>Pick a chapter, then open its lesson, exercises, or recap.</p>
      </div>

      <div className="module-grid">
        {modules.map((module) => (
          <ModuleCard
            key={module.id}
            module={module}
            progress={progress[module.id]}
            onSelectSection={onSelectSection}
          />
        ))}
      </div>
    </section>
  );
}
