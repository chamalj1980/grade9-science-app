import { useMemo, useState } from "react";
import type { LearningModule } from "../types";
import { chapters, subjects, type Subject } from "../data/curriculum";
import {
  getStat,
  hasQuiz,
  loadQuizStats,
  questionsForModule,
  recordResult,
  saveQuizStats,
  shuffle,
  type QuizMode
} from "../utils/quiz";
import { ChapterArt } from "./ChapterArt";
import { QuizRunner, type QuizRunResult } from "./QuizRunner";

interface QuizArenaProps {
  modules: LearningModule[];
}

type View = "menu" | "run" | "result";

const MODES: { id: QuizMode; label: string; icon: string; blurb: string }[] = [
  {
    id: "practice",
    label: "Module Quiz",
    icon: "🎯",
    blurb: "Relaxed — instant feedback and an explanation after every question."
  },
  {
    id: "time-attack",
    label: "Time Attack",
    icon: "⏱️",
    blurb: "90 seconds on the clock. Fast, correct answers stack a speed bonus."
  }
];

function accentFor(subject: Subject): string {
  return `var(--${subject})`;
}

export function QuizArena({ modules }: QuizArenaProps) {
  const [view, setView] = useState<View>("menu");
  const [mode, setMode] = useState<QuizMode>("practice");
  const [activeModuleId, setActiveModuleId] = useState<string | null>(null);
  const [deck, setDeck] = useState<ReturnType<typeof questionsForModule>>([]);
  const [result, setResult] = useState<(QuizRunResult & { isNewBest: boolean }) | null>(
    null
  );
  const [stats, setStats] = useState(() => loadQuizStats());

  // Only the built chapters that actually have a question set.
  const quizChapters = useMemo(
    () =>
      chapters
        .filter((chapter) => chapter.moduleId && hasQuiz(chapter.moduleId))
        .map((chapter) => ({
          chapter,
          module: modules.find((m) => m.id === chapter.moduleId)
        }))
        .filter((entry): entry is { chapter: (typeof chapters)[number]; module: LearningModule } =>
          Boolean(entry.module)
        ),
    [modules]
  );

  const activeModule = modules.find((m) => m.id === activeModuleId);
  const activeChapter = chapters.find((c) => c.moduleId === activeModuleId);

  function start(moduleId: string) {
    setActiveModuleId(moduleId);
    setDeck(shuffle(questionsForModule(moduleId)));
    setResult(null);
    setView("run");
  }

  function handleComplete(runResult: QuizRunResult) {
    if (!activeModuleId) {
      return;
    }
    const previousBest = getStat(stats, activeModuleId, mode).bestScore;
    const nextStats = recordResult(stats, {
      moduleId: activeModuleId,
      mode,
      score: runResult.score,
      correct: runResult.correct,
      total: runResult.total
    });
    setStats(nextStats);
    saveQuizStats(nextStats);
    setResult({ ...runResult, isNewBest: runResult.score > previousBest });
    setView("result");
  }

  // ---------- Run ----------
  if (view === "run" && activeModule && activeChapter) {
    return (
      <QuizRunner
        questions={deck}
        mode={mode}
        moduleTitle={activeModule.title}
        accent={accentFor(activeChapter.subject)}
        onComplete={handleComplete}
        onQuit={() => setView("menu")}
      />
    );
  }

  // ---------- Result ----------
  if (view === "result" && result && activeModule && activeChapter) {
    const accuracy =
      result.total > 0 ? Math.round((result.correct / result.total) * 100) : 0;
    const best = getStat(stats, activeModuleId!, mode);

    return (
      <div className="qa-result" style={{ ["--accent" as string]: accentFor(activeChapter.subject) }}>
        <div className="qa-result-card">
          {result.isNewBest && <p className="qa-newbest">🎉 New personal best!</p>}
          <p className="eyebrow">{activeModule.title}</p>
          <h2>{mode === "time-attack" ? "Time's up!" : "Quiz complete!"}</h2>
          <div className="qa-bigscore">{result.score}</div>
          <p className="qa-score-label">points</p>

          <div className="qa-result-stats">
            <div>
              <strong>
                {result.correct}/{result.total}
              </strong>
              <span>correct</span>
            </div>
            <div>
              <strong>{accuracy}%</strong>
              <span>accuracy</span>
            </div>
            <div>
              <strong>{best.bestScore}</strong>
              <span>best score</span>
            </div>
          </div>

          <div className="qa-result-actions">
            <button type="button" className="qa-primary" onClick={() => start(activeModuleId!)}>
              Play again
            </button>
            <button type="button" className="qa-secondary" onClick={() => setView("menu")}>
              Choose another chapter
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ---------- Menu ----------
  return (
    <div className="qa-menu">
      <header className="qa-hero">
        <p className="eyebrow">Quiz Arena</p>
        <h1>
          Test yourself, <span className="qa-pop">beat the clock</span>
        </h1>
        <p className="qa-lede">
          Pick a mode, choose a chapter, and turn revision into a game. Your best scores
          are saved on this device.
        </p>
      </header>

      <div className="qa-modes" role="group" aria-label="Choose a quiz mode">
        {MODES.map((m) => (
          <button
            key={m.id}
            type="button"
            className={`qa-mode ${mode === m.id ? "is-active" : ""}`}
            aria-pressed={mode === m.id}
            onClick={() => setMode(m.id)}
          >
            <span className="qa-mode-ic" aria-hidden="true">
              {m.icon}
            </span>
            <span className="qa-mode-body">
              <strong>{m.label}</strong>
              <span>{m.blurb}</span>
            </span>
          </button>
        ))}
      </div>

      <h2 className="qa-pick-title">Choose a chapter</h2>
      <div className="qa-chapter-grid">
        {quizChapters.map(({ chapter, module }) => {
          const stat = getStat(stats, module.id, mode);
          const count = questionsForModule(module.id).length;
          return (
            <button
              key={module.id}
              type="button"
              className={`qa-chapter ${chapter.subject}`}
              onClick={() => start(module.id)}
            >
              <span className="qa-chapter-art">
                <ChapterArt art={chapter.art} />
              </span>
              <span className="qa-chapter-body">
                <span className="qa-chapter-num">Chapter {chapter.n}</span>
                <strong>{module.title}</strong>
                <span className="qa-chapter-meta">
                  {count} questions
                  {stat.bestScore > 0 && (
                    <span className="qa-chapter-best"> · best {stat.bestScore}</span>
                  )}
                </span>
              </span>
              <span className="qa-chapter-go" aria-hidden="true">
                {stat.plays > 0 ? "Play again →" : "Start →"}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
