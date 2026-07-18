import { useCallback, useEffect, useMemo, useState } from "react";
import { HomeDashboard } from "./components/HomeDashboard";
import { ModuleNav } from "./components/ModuleNav";
import { ModulesOverview } from "./components/ModulesOverview";
import { ProgressIndicator } from "./components/ProgressIndicator";
import { ProgressSummary } from "./components/ProgressSummary";
import { QuizArena } from "./components/QuizArena";
import { TeacherStudio } from "./components/TeacherStudio";
import { renderSection } from "./courses/registry";
import { modules } from "./data/modules";
import type { SectionId } from "./types";
import {
  loadProgress,
  markSectionViewed,
  saveProgress,
  updateSectionProgress,
  type ProgressState,
  type SectionProgressUpdate
} from "./utils/progress";

type Screen =
  | { name: "home" }
  | { name: "modules" }
  | { name: "quiz" }
  | { name: "teacher" }
  | { name: "progress" }
  | { name: "module"; moduleId: string; sectionId: SectionId };

function App() {
  const [screen, setScreen] = useState<Screen>({ name: "home" });
  const [progress, setProgress] = useState<ProgressState>(() =>
    loadProgress(modules)
  );

  useEffect(() => {
    saveProgress(progress);
  }, [progress]);

  const selectedModule = useMemo(() => {
    if (screen.name !== "module") {
      return undefined;
    }

    return modules.find((module) => module.id === screen.moduleId);
  }, [screen]);

  const selectedSection = useMemo(() => {
    if (!selectedModule || screen.name !== "module") {
      return undefined;
    }

    return selectedModule.sections.find((section) => section.id === screen.sectionId);
  }, [screen, selectedModule]);

  function selectSection(moduleId: string, sectionId: SectionId) {
    setScreen({ name: "module", moduleId, sectionId });
    // Opening a section marks it "viewed"; completion is set later by the section itself.
    setProgress((currentProgress) =>
      markSectionViewed(currentProgress, moduleId, sectionId)
    );
  }

  // Stable callback bound to the currently open section, handed to each section view
  // so it can report score / streak / completion. Kept stable per module+section so
  // child effects that depend on it do not loop.
  const moduleId = screen.name === "module" ? screen.moduleId : undefined;
  const sectionId = screen.name === "module" ? screen.sectionId : undefined;
  const reportProgress = useCallback(
    (update: SectionProgressUpdate) => {
      if (!moduleId || !sectionId) {
        return;
      }

      setProgress((currentProgress) =>
        updateSectionProgress(currentProgress, moduleId, sectionId, update)
      );
    },
    [moduleId, sectionId]
  );

  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>

      <header className="site-header">
        <div className="site-header-inner">
          <div className="brand-mark" aria-hidden="true">
            G9
          </div>
          <div className="brand-copy">
            <strong>Fun Science Learning</strong>
            <span>Grade 9 · English medium</span>
          </div>

          <nav className="top-nav" aria-label="Primary navigation">
            <button
              type="button"
              aria-current={screen.name === "home" ? "page" : undefined}
              onClick={() => setScreen({ name: "home" })}
            >
              Home
            </button>
            <button
              type="button"
              aria-current={
                screen.name === "modules" || screen.name === "module"
                  ? "page"
                  : undefined
              }
              onClick={() => setScreen({ name: "modules" })}
            >
              Modules
            </button>
            <button
              type="button"
              aria-current={screen.name === "quiz" ? "page" : undefined}
              onClick={() => setScreen({ name: "quiz" })}
            >
              Quiz
            </button>
            <button
              type="button"
              aria-current={screen.name === "progress" ? "page" : undefined}
              onClick={() => setScreen({ name: "progress" })}
            >
              Progress
            </button>
            <button
              type="button"
              aria-current={screen.name === "teacher" ? "page" : undefined}
              onClick={() => setScreen({ name: "teacher" })}
            >
              Teacher
            </button>
          </nav>
        </div>
      </header>

      <main id="main-content" className="main-content">
        {screen.name === "home" && (
          <HomeDashboard
            modules={modules}
            progress={progress}
            onSelectSection={selectSection}
            onShowProgress={() => setScreen({ name: "progress" })}
          />
        )}

        {screen.name === "modules" && (
          <ModulesOverview
            modules={modules}
            progress={progress}
            onSelectSection={selectSection}
          />
        )}

        {screen.name === "quiz" && <QuizArena modules={modules} />}

        {screen.name === "teacher" && <TeacherStudio modules={modules} />}

        {screen.name === "progress" && (
          <ProgressSummary
            modules={modules}
            progress={progress}
            onSelectSection={selectSection}
          />
        )}

        {screen.name === "module" && selectedModule && selectedSection && (
          <section className="module-screen" aria-labelledby="module-title">
            <div className="module-heading">
              <button
                type="button"
                className="back-button"
                onClick={() => setScreen({ name: "modules" })}
              >
                Back to modules
              </button>
              <p className="chapter-label">
                {selectedModule.icon} Chapter {selectedModule.chapter}
              </p>
              <h1 id="module-title">{selectedModule.title}</h1>
              <p>{selectedModule.summary}</p>
            </div>

            <div className="module-layout">
              <div className="module-workspace">
                <ModuleNav
                  module={selectedModule}
                  selectedSectionId={selectedSection.id}
                  onSelect={(nextSectionId) =>
                    selectSection(selectedModule.id, nextSectionId)
                  }
                />
                {renderSection(selectedModule, selectedSection, {
                  onProgress: reportProgress
                })}
              </div>

              <aside className="module-aside" aria-label="Chapter progress">
                <ProgressIndicator
                  id={`${selectedModule.id}-active-progress`}
                  label={`${selectedModule.shortTitle} progress`}
                  module={selectedModule}
                  progress={progress[selectedModule.id]}
                />
              </aside>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

export default App;
