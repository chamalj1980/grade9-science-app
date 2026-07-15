import { useMemo, useState } from "react";
import type { LearningModule, SectionId } from "../types";
import type { ProgressState } from "../utils/progress";
import {
  calculateModuleProgress,
  calculateOverallProgress
} from "../utils/progress";
import { chapters, subjectOrder, subjects, type Subject } from "../data/curriculum";
import { ChapterArt } from "./ChapterArt";

interface HomeDashboardProps {
  modules: LearningModule[];
  progress: ProgressState;
  onSelectSection: (moduleId: string, sectionId: SectionId) => void;
  onShowProgress: () => void;
}

type Filter = "all" | Subject;

export function HomeDashboard({
  modules,
  progress,
  onSelectSection,
  onShowProgress
}: HomeDashboardProps) {
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");

  const overallProgress = calculateOverallProgress(modules, progress);
  const readyCount = chapters.filter((chapter) => chapter.moduleId).length;

  const trimmedQuery = query.trim().toLowerCase();
  const visibleChapters = useMemo(
    () =>
      chapters.filter((chapter) => {
        const matchesSubject = filter === "all" || chapter.subject === filter;
        const matchesQuery =
          trimmedQuery === "" ||
          `${chapter.title} ${chapter.blurb}`.toLowerCase().includes(trimmedQuery);
        return matchesSubject && matchesQuery;
      }),
    [filter, trimmedQuery]
  );

  return (
    <div className="discovery">
      <section className="disco-hero" aria-labelledby="home-title">
        <div className="disco-hero-copy">
          <p className="eyebrow">Grade 9 Science</p>
          <h1 id="home-title">
            <span className="disco-pop">Fun</span> Science Learning
          </h1>
          <p>
            All 19 chapters in one place. Filter by subject, search a topic, or jump
            straight back into what you started.
          </p>
        </div>

        <button
          type="button"
          className="disco-ring-button"
          onClick={onShowProgress}
          aria-label={`Overall progress ${overallProgress} percent. View progress.`}
        >
          <ProgressRing value={overallProgress} />
          <span className="disco-ring-caption">
            {readyCount} of {chapters.length} chapters ready
          </span>
        </button>
      </section>

      <div className="disco-controls">
        <label className="disco-search">
          <SearchIcon />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search a chapter or topic…"
            aria-label="Search chapters"
          />
        </label>

        <div className="disco-chips" role="group" aria-label="Filter by subject">
          <button
            type="button"
            className="disco-chip all"
            aria-pressed={filter === "all"}
            onClick={() => setFilter("all")}
          >
            All
          </button>
          {subjectOrder.map((subjectId) => (
            <button
              key={subjectId}
              type="button"
              className={`disco-chip ${subjectId}`}
              aria-pressed={filter === subjectId}
              onClick={() => setFilter(subjectId)}
            >
              {subjects[subjectId].name}
            </button>
          ))}
        </div>
      </div>

      {visibleChapters.length === 0 ? (
        <p className="disco-empty">No chapters match that search yet.</p>
      ) : (
        <section className="disco-deck" aria-label="Science chapters">
          {visibleChapters.map((chapter) => {
            const module = chapter.moduleId
              ? modules.find((candidate) => candidate.id === chapter.moduleId)
              : undefined;
            const pct =
              module && progress[module.id]
                ? calculateModuleProgress(module, progress[module.id])
                : 0;

            const statusLabel =
              pct >= 100 ? "Done ✓" : pct > 0 ? "Continue" : "Start";

            const inner = (
              <>
                <div className={`dcard-art ${chapter.subject}`}>
                  <ChapterArt art={chapter.art} />
                  <span className={`dcard-badge ${chapter.subject}`}>{chapter.n}</span>
                </div>
                <div className="dcard-body">
                  <p className="dcard-num">Chapter {chapter.n}</p>
                  <h2>{chapter.title}</h2>
                  <p className="dcard-blurb">{chapter.blurb}</p>

                  {module && pct > 0 && (
                    <div className="dcard-progress" aria-hidden="true">
                      <span style={{ width: `${pct}%` }} />
                    </div>
                  )}

                  <div className="dcard-foot">
                    <span className={`subj-tag ${chapter.subject}`}>
                      {subjects[chapter.subject].name}
                    </span>
                    {module ? (
                      <span className={`pill ${pct >= 100 ? "done" : "play"}`}>
                        {statusLabel}
                      </span>
                    ) : (
                      <span className="pill soon">Coming soon</span>
                    )}
                  </div>
                </div>
              </>
            );

            if (module) {
              return (
                <button
                  key={chapter.n}
                  type="button"
                  className={`dcard ${chapter.subject}`}
                  onClick={() => onSelectSection(module.id, "lesson")}
                >
                  {inner}
                </button>
              );
            }

            return (
              <div key={chapter.n} className={`dcard ${chapter.subject} is-soon`}>
                {inner}
              </div>
            );
          })}
        </section>
      )}
    </div>
  );
}

// Circular progress meter used in the hero. Purely presentational.
function ProgressRing({ value }: { value: number }) {
  const radius = 26;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - value / 100);

  return (
    <svg className="disco-ring" viewBox="0 0 64 64" aria-hidden="true">
      <circle className="disco-ring-bg" cx="32" cy="32" r={radius} />
      <circle
        className="disco-ring-fg"
        cx="32"
        cy="32"
        r={radius}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
      />
      <text x="32" y="32" textAnchor="middle" dominantBaseline="central">
        {value}%
      </text>
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
      <path d="M21 21l-4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
