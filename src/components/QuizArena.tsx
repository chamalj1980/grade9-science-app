import { useMemo, useState } from "react";
import type { LearningModule } from "../types";
import { chapters, subjects, type Subject } from "../data/curriculum";
import { totalMarks, type TestPack } from "../data/testModel";
import { builtInPacks } from "../data/termTests";
import { loadPacks } from "../utils/testBank";
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
import { TestPlayer } from "./TestPlayer";

interface QuizArenaProps {
  modules: LearningModule[];
}

type View = "menu" | "run" | "result" | "test";
type Tab = QuizMode | "term";

const MODES: { id: Tab; label: string; icon: string; blurb: string }[] = [
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
  },
  {
    id: "term",
    label: "Term Test",
    icon: "📝",
    blurb: "A whole-term mock paper — MCQs and written answers, then a report card."
  }
];

function accentFor(subject: Subject): string {
  return `var(--${subject})`;
}

export function QuizArena({ modules }: QuizArenaProps) {
  const [view, setView] = useState<View>("menu");
  const [tab, setTab] = useState<Tab>("practice");
  const [activePack, setActivePack] = useState<TestPack | null>(null);
  const [activeModuleId, setActiveModuleId] = useState<string | null>(null);
  const [deck, setDeck] = useState<ReturnType<typeof questionsForModule>>([]);
  const [result, setResult] = useState<(QuizRunResult & { isNewBest: boolean }) | null>(
    null
  );
  const [stats, setStats] = useState(() => loadQuizStats());

  // The Term Test tab isn't a quiz mode; scores/stats always use a real quiz mode.
  const quizMode: QuizMode = tab === "term" ? "practice" : tab;

  // Built-in mock plus any term tests a teacher saved or imported on this device.
  const termTests = useMemo<TestPack[]>(
    () => [...builtInPacks, ...loadPacks().filter((pack) => pack.kind === "term")],
    []
  );

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
    const previousBest = getStat(stats, activeModuleId, quizMode).bestScore;
    const nextStats = recordResult(stats, {
      moduleId: activeModuleId,
      mode: quizMode,
      score: runResult.score,
      correct: runResult.correct,
      total: runResult.total
    });
    setStats(nextStats);
    saveQuizStats(nextStats);
    setResult({ ...runResult, isNewBest: runResult.score > previousBest });
    setView("result");
  }

  // ---------- Term test ----------
  if (view === "test" && activePack) {
    return <TestPlayer pack={activePack} onExit={() => setView("menu")} />;
  }

  // ---------- Run ----------
  if (view === "run" && activeModule && activeChapter) {
    return (
      <QuizRunner
        questions={deck}
        mode={quizMode}
        moduleTitle={activeModule.title}
        art={activeChapter.art}
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
    const best = getStat(stats, activeModuleId!, quizMode);

    return (
      <div className="qa-result" style={{ ["--accent" as string]: accentFor(activeChapter.subject) }}>
        <div className="qa-result-card">
          {result.isNewBest && <p className="qa-newbest">🎉 New personal best!</p>}
          <p className="eyebrow">{activeModule.title}</p>
          <h2>{quizMode === "time-attack" ? "Time's up!" : "Quiz complete!"}</h2>
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
            className={`qa-mode ${tab === m.id ? "is-active" : ""}`}
            aria-pressed={tab === m.id}
            onClick={() => setTab(m.id)}
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

      {tab === "term" ? (
        <>
          <h2 className="qa-pick-title">Choose a test</h2>
          <div className="qa-chapter-grid">
            {termTests.map((pack) => (
              <button
                key={pack.id}
                type="button"
                className="qa-chapter energy qa-term"
                onClick={() => {
                  setActivePack(pack);
                  setView("test");
                }}
              >
                <span className="qa-chapter-art qa-term-art" aria-hidden="true">
                  📝
                </span>
                <span className="qa-chapter-body">
                  <span className="qa-chapter-num">
                    {pack.source === "builtin" ? "Built-in" : "Your test"}
                  </span>
                  <strong>{pack.title}</strong>
                  <span className="qa-chapter-meta">
                    {pack.questions.length} questions · {totalMarks(pack.questions)} marks
                  </span>
                </span>
                <span className="qa-chapter-go" aria-hidden="true">
                  Start test →
                </span>
              </button>
            ))}
          </div>
          <p className="qa-term-hint">
            Term tests mix every chapter, just like the real paper. Teachers can add more
            in the Teacher studio.
          </p>
        </>
      ) : (
        <>
      <h2 className="qa-pick-title">Choose a chapter</h2>
      <div className="qa-chapter-grid">
        {quizChapters.map(({ chapter, module }) => {
          const stat = getStat(stats, module.id, quizMode);
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
        </>
      )}
    </div>
  );
}
