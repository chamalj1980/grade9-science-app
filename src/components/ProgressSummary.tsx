import type { LearningModule, SectionId } from "../types";
import type { ProgressState } from "../utils/progress";
import {
  calculateModuleProgress,
  calculateOverallProgress,
  getRevisionSuggestions
} from "../utils/progress";
import { ProgressIndicator } from "./ProgressIndicator";

interface ProgressSummaryProps {
  modules: LearningModule[];
  progress: ProgressState;
  onSelectSection: (moduleId: string, sectionId: SectionId) => void;
}

export function ProgressSummary({
  modules,
  progress,
  onSelectSection
}: ProgressSummaryProps) {
  const overall = calculateOverallProgress(modules, progress);
  const revisionSuggestions = getRevisionSuggestions(modules, progress);

  return (
    <section className="progress-summary" aria-labelledby="progress-title">
      <div className="page-heading">
        <p className="eyebrow">Progress</p>
        <h1 id="progress-title">Your science journey</h1>
        <p>{overall}% of your Grade 9 Science chapters are complete.</p>
      </div>

      <div className="summary-grid">
        {modules.map((module) => {
          const moduleProgress = progress[module.id];
          // First section this module hasn't completed yet.
          const nextSection = module.sections.find(
            (section) => moduleProgress[section.id].status !== "completed"
          );

          return (
            <article className="summary-card" key={module.id}>
              <ProgressIndicator
                id={`${module.id}-summary-progress`}
                label={`${module.icon} ${module.title}`}
                module={module}
                progress={moduleProgress}
              />

              {calculateModuleProgress(module, moduleProgress) === 100 ? (
                <p className="completion-copy">Chapter complete. Great work!</p>
              ) : (
                nextSection && (
                  <button
                    type="button"
                    className="secondary-action"
                    onClick={() => onSelectSection(module.id, nextSection.id)}
                  >
                    Continue with {nextSection.navLabel}
                  </button>
                )
              )}
            </article>
          );
        })}
      </div>

      <section className="revision-panel" aria-labelledby="revision-title">
        <h2 id="revision-title">Suggested revision areas</h2>
        {revisionSuggestions.length === 0 ? (
          <p className="completion-copy">
            Everything is complete. Revisit any chapter any time to stay sharp.
          </p>
        ) : (
          <ul className="revision-list">
            {revisionSuggestions.map((suggestion) => (
              <li key={`${suggestion.moduleId}-${suggestion.sectionId}`}>
                <div>
                  <strong>{suggestion.sectionTitle}</strong>
                  <span>
                    {suggestion.moduleTitle} · {suggestion.reason}
                  </span>
                </div>
                <button
                  type="button"
                  className="secondary-action"
                  onClick={() =>
                    onSelectSection(suggestion.moduleId, suggestion.sectionId)
                  }
                >
                  Open
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </section>
  );
}
