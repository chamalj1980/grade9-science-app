import type { LearningModule, SectionId } from "../types";
import type { ProgressState } from "../utils/progress";
import { calculateOverallProgress } from "../utils/progress";
import { ModuleCard } from "./ModuleCard";

interface HomeDashboardProps {
  modules: LearningModule[];
  progress: ProgressState;
  onSelectSection: (moduleId: string, sectionId: SectionId) => void;
  onShowProgress: () => void;
}

export function HomeDashboard({
  modules,
  progress,
  onSelectSection,
  onShowProgress
}: HomeDashboardProps) {
  const overallProgress = calculateOverallProgress(modules, progress);

  return (
    <div className="home-dashboard">
      <section className="dashboard-intro" aria-labelledby="home-title">
        <div>
          <p className="eyebrow">Grade 9 Science</p>
          <h1 id="home-title">Learning App</h1>
          <p>
            Choose a chapter, open a lesson, and keep track of each step as you
            learn.
          </p>
        </div>
        <button type="button" className="secondary-action" onClick={onShowProgress}>
          View progress
        </button>
      </section>

      <section className="overall-strip" aria-label="Overall progress">
        <span>Overall progress</span>
        <strong>{overallProgress}%</strong>
        <div className="mini-track" aria-hidden="true">
          <span style={{ width: `${overallProgress}%` }} />
        </div>
      </section>

      <section className="module-grid" aria-label="Science chapters">
        {modules.map((module) => (
          <ModuleCard
            key={module.id}
            module={module}
            progress={progress[module.id]}
            onSelectSection={onSelectSection}
          />
        ))}
      </section>
    </div>
  );
}