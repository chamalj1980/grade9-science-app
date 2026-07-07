import type { LearningModule } from "../types";
import type { ModuleProgress, SectionProgress } from "../utils/progress";
import { calculateModuleProgress, createEmptySectionProgress } from "../utils/progress";

interface ProgressIndicatorProps {
  id: string;
  label: string;
  module: LearningModule;
  progress: ModuleProgress;
}

// Short human-readable status shown next to each section in the progress panel.
function describeSection(section: SectionProgress): string {
  if (section.status === "completed") {
    return "Complete";
  }

  if (section.total > 0 && section.score > 0) {
    return `${section.score}/${section.total}`;
  }

  return section.status === "viewed" ? "In progress" : "Not yet";
}

export function ProgressIndicator({
  id,
  label,
  module,
  progress
}: ProgressIndicatorProps) {
  const value = calculateModuleProgress(module, progress);
  const labelId = `${id}-label`;

  return (
    <section className="progress-panel" aria-labelledby={labelId}>
      <div className="progress-heading">
        <h3 id={labelId}>{label}</h3>
        <span className="progress-percent">{value}%</span>
      </div>

      <div
        className="progress-track"
        role="progressbar"
        aria-labelledby={labelId}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={value}
      >
        <span className="progress-fill" style={{ width: `${value}%` }} />
      </div>

      <ul className="progress-steps" aria-label={`${label} progress details`}>
        {module.sections.map((section) => {
          const sectionProgress =
            progress[section.id] ?? createEmptySectionProgress();
          const status = describeSection(sectionProgress);

          return (
            <li key={section.id}>
              <span
                className={
                  sectionProgress.status === "completed"
                    ? "status-dot is-complete"
                    : sectionProgress.status === "viewed"
                      ? "status-dot is-partial"
                      : "status-dot"
                }
                aria-hidden="true"
              />
              <span>{section.navLabel}</span>
              <strong>{status}</strong>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
