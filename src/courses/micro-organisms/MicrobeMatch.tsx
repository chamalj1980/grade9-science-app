import { useEffect, useMemo, useState, type DragEvent } from "react";
import { microbeMatchLevels } from "../../data/microbeMatch";
import {
  getMatch,
  isCorrectMatch,
  matchesForField,
  totalMatches
} from "../../utils/microbes";
import { MicrobeFigure } from "./MicrobeFigure";
import type { SectionViewProps } from "../section";

interface MatchFeedback {
  isCorrect: boolean;
  message: string;
}

function shuffle<T>(values: T[]): T[] {
  const copy = [...values];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function MicrobeMatch({ onProgress }: SectionViewProps) {
  const [matched, setMatched] = useState<Record<string, boolean>>({});
  const [levelIndex, setLevelIndex] = useState(0);
  const [selectedMicrobe, setSelectedMicrobe] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<MatchFeedback | null>(null);
  const [hint, setHint] = useState<string | null>(null);

  const matchedCount = Object.values(matched).filter(Boolean).length;
  const allMatched = matchedCount === totalMatches;

  useEffect(() => {
    onProgress({ score: matchedCount, total: totalMatches, completed: allMatched });
  }, [matchedCount, allMatched, onProgress]);

  const currentLevel = microbeMatchLevels[levelIndex];
  const jobCards = matchesForField(currentLevel.id);
  const selectedMatch = selectedMicrobe ? getMatch(selectedMicrobe) : undefined;

  // Shuffle the microbe chips once per level so the pairing is not top-to-bottom obvious.
  const shuffledChipsByLevel = useMemo(
    () => microbeMatchLevels.map((level) => shuffle(matchesForField(level.id))),
    []
  );
  const levelChips = shuffledChipsByLevel[levelIndex].filter(
    (match) => !matched[match.id]
  );

  // Advance to the next level once every job in the current one is matched.
  useEffect(() => {
    const levelDone = currentLevel.matchIds.every((id) => matched[id]);
    if (levelDone && levelIndex < microbeMatchLevels.length - 1) {
      const timer = window.setTimeout(() => {
        setLevelIndex((index) => index + 1);
        setSelectedMicrobe(null);
        setFeedback(null);
        setHint(null);
      }, 700);
      return () => window.clearTimeout(timer);
    }
    return undefined;
  }, [matched, currentLevel, levelIndex]);

  function attemptMatch(jobId: string, microbeId: string) {
    if (matched[jobId]) {
      return;
    }

    if (isCorrectMatch(microbeId, jobId)) {
      const match = getMatch(jobId);
      setMatched((current) => ({ ...current, [jobId]: true }));
      setFeedback({ isCorrect: true, message: match ? match.fact : "Correct!" });
      setHint(null);
    } else {
      const microbe = getMatch(microbeId);
      const job = getMatch(jobId);
      setFeedback({
        isCorrect: false,
        message: `${microbe?.microbe ?? "That microbe"} is not used for ${(
          job?.job ?? "this job"
        ).toLowerCase()}. Try again.`
      });
    }
    setSelectedMicrobe(null);
  }

  function handleDrop(event: DragEvent<HTMLDivElement>, jobId: string) {
    event.preventDefault();
    const microbeId = event.dataTransfer.getData("text/plain");
    attemptMatch(jobId, microbeId);
  }

  function revealHint() {
    const target = jobCards.find((card) => !matched[card.id]);
    setHint(target ? `Hint — ${target.microbe} → ${target.job}.` : null);
  }

  return (
    <article className="lesson">
      <header className="lesson-hero microbes">
        <p className="eyebrow">Exercise 1</p>
        <h2>Match the Microbe</h2>
        <p>
          Drag each microbe onto the job it does, or tap a microbe then a job card. Work
          through food, then farming and medicine, then industry and the environment.
        </p>
      </header>

      <section className="lesson-block" aria-labelledby="match-title">
        <div className="sort-header">
          <h3 id="match-title">{currentLevel.title}</h3>
          <p className="solved-count" aria-live="polite">
            Matched {matchedCount}/{totalMatches}
          </p>
        </div>

        <p className="label-help">
          {selectedMicrobe
            ? `Selected: ${getMatch(selectedMicrobe)?.microbe}. Now click a job card.`
            : "Pick a microbe below, then click its job — or drag it across."}
        </p>

        {/* Microscope: previews the selected microbe as a live specimen */}
        <div className="microscope">
          <div className="microscope-lens">
            {selectedMatch ? (
              <MicrobeFigure
                key={selectedMatch.id}
                type={selectedMatch.category}
                title={`Specimen: ${selectedMatch.microbe}`}
              />
            ) : (
              <div className="microscope-empty" aria-hidden="true">
                🔬
              </div>
            )}
          </div>
          <p className="microscope-caption" aria-live="polite">
            {selectedMatch ? (
              <>
                <strong>{selectedMatch.microbe}</strong> — a{" "}
                {selectedMatch.category === "fungi" ? "fungus" : selectedMatch.category}.
                Match it to its job.
              </>
            ) : (
              "Select a microbe to view it under the microscope."
            )}
          </p>
        </div>

        {/* Microbe chips */}
        <div className="names-pool" aria-label={`${currentLevel.title} microbes`}>
          {levelChips.map((match) => (
            <button
              key={match.id}
              type="button"
              draggable
              className={`microbe-chip${selectedMicrobe === match.id ? " is-selected" : ""}`}
              aria-pressed={selectedMicrobe === match.id}
              onDragStart={(event) =>
                event.dataTransfer.setData("text/plain", match.id)
              }
              onClick={() =>
                setSelectedMicrobe((current) =>
                  current === match.id ? null : match.id
                )
              }
            >
              <span aria-hidden="true">{match.emoji}</span> {match.microbe}
            </button>
          ))}
          {levelChips.length === 0 && !allMatched && (
            <p className="sort-complete">Level complete — moving on…</p>
          )}
          {allMatched && <p className="sort-complete">🎉 Every microbe matched!</p>}
        </div>

        {/* Job target cards */}
        <div className="match-grid">
          {jobCards.map((card) => {
            const isMatched = matched[card.id];
            const matchedMicrobe = isMatched ? getMatch(card.id) : undefined;

            return (
              <div
                key={card.id}
                className={`match-slot ${isMatched ? "is-matched" : ""}`}
                onDragOver={(event) => !isMatched && event.preventDefault()}
                onDrop={(event) => !isMatched && handleDrop(event, card.id)}
                role={!isMatched && selectedMicrobe ? "button" : undefined}
                tabIndex={!isMatched && selectedMicrobe ? 0 : undefined}
                aria-label={
                  isMatched
                    ? `${card.job} matched with ${matchedMicrobe?.microbe}`
                    : `Job: ${card.job}`
                }
                onClick={() => {
                  if (!isMatched && selectedMicrobe) {
                    attemptMatch(card.id, selectedMicrobe);
                  }
                }}
                onKeyDown={(event) => {
                  if (
                    !isMatched &&
                    selectedMicrobe &&
                    (event.key === "Enter" || event.key === " ")
                  ) {
                    event.preventDefault();
                    attemptMatch(card.id, selectedMicrobe);
                  }
                }}
              >
                <span className="match-job-emoji" aria-hidden="true">
                  {card.emoji}
                </span>
                <span className="match-job-name">{card.job}</span>
                {isMatched && (
                  <span className="match-done">✓ {matchedMicrobe?.microbe}</span>
                )}
              </div>
            );
          })}
        </div>

        <button type="button" className="drill-hint" onClick={revealHint}>
          💡 Reveal a hint
        </button>
        {hint && <p className="hint-text">{hint}</p>}

        {feedback && (
          <div
            className={feedback.isCorrect ? "feedback-panel is-correct" : "feedback-panel"}
            role="status"
            aria-live="polite"
          >
            <strong>{feedback.isCorrect ? "Correct!" : "Try again"}</strong>
            <p>{feedback.message}</p>
          </div>
        )}
      </section>
    </article>
  );
}
