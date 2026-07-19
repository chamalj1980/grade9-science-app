import { useEffect, useMemo, useState, type DragEvent } from "react";
import { moverLevels } from "../../data/movementData";
import { getMover, isCorrectMatch, moversForLevel, totalMovers } from "../../utils/movement";
import type { SectionViewProps } from "../section";

interface Feedback {
  isCorrect: boolean;
  message: string;
}

function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

// Exercise 1: match each animal to the appendage it uses to move, level by level.
export function MatchTheMover({ onProgress }: SectionViewProps) {
  const [matched, setMatched] = useState<Record<string, boolean>>({});
  const [levelIndex, setLevelIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<Feedback | null>(null);

  const matchedCount = Object.values(matched).filter(Boolean).length;
  const allMatched = matchedCount === totalMovers;

  useEffect(() => {
    onProgress({ score: matchedCount, total: totalMovers, completed: allMatched });
  }, [matchedCount, allMatched, onProgress]);

  const level = moverLevels[levelIndex];
  const slots = moversForLevel(level.id); // slot label = each mover's appendage

  // Chips shuffled once per level so the pairing isn't top-to-bottom obvious.
  const shuffledByLevel = useMemo(
    () => moverLevels.map((entry) => shuffle(moversForLevel(entry.id))),
    []
  );
  const chips = shuffledByLevel[levelIndex].filter((mover) => !matched[mover.id]);
  const levelDone = slots.every((slot) => matched[slot.id]);

  // Advance to the next level once this one is complete.
  useEffect(() => {
    if (levelDone && levelIndex < moverLevels.length - 1) {
      const timer = window.setTimeout(() => {
        setLevelIndex((index) => index + 1);
        setSelected(null);
        setFeedback(null);
      }, 900);
      return () => window.clearTimeout(timer);
    }
  }, [levelDone, levelIndex]);

  function attempt(animalId: string, appendage: string) {
    if (matched[animalId]) {
      return;
    }
    const mover = getMover(animalId);
    if (!mover) {
      return;
    }
    if (isCorrectMatch(animalId, appendage)) {
      setMatched((current) => ({ ...current, [animalId]: true }));
      setFeedback({ isCorrect: true, message: mover.fact });
      setSelected(null);
    } else {
      setFeedback({
        isCorrect: false,
        message: `${mover.animal} doesn't use ${appendage.toLowerCase()}. Try another slot.`
      });
    }
  }

  function handleDrop(event: DragEvent<HTMLDivElement>, appendage: string) {
    event.preventDefault();
    const animalId = event.dataTransfer.getData("text/plain");
    if (animalId) {
      attempt(animalId, appendage);
    }
  }

  return (
    <article className="lesson">
      <header className="lesson-hero movement">
        <p className="eyebrow">Exercise 1</p>
        <h2>Match the Mover</h2>
        <p>
          Match each animal to the appendage it uses to get around. Pick an animal, then
          its appendage — or drag it across.
        </p>
      </header>

      <section className="lesson-block" aria-labelledby="match-title">
        <div className="sort-header">
          <h3 id="match-title">{level.title}</h3>
          <p className="solved-count" aria-live="polite">
            Matched {matchedCount}/{totalMovers}
          </p>
        </div>

        <p className="label-help">
          {selected
            ? `Selected: ${getMover(selected)?.animal}. Now pick its appendage.`
            : "Pick an animal below, then choose the appendage it moves with."}
        </p>

        {/* animal chips */}
        <div className="names-pool" aria-label={`${level.title} animals`}>
          {chips.map((mover) => (
            <button
              key={mover.id}
              type="button"
              draggable
              className={`microbe-chip${selected === mover.id ? " is-selected" : ""}`}
              aria-pressed={selected === mover.id}
              onDragStart={(event) => event.dataTransfer.setData("text/plain", mover.id)}
              onClick={() =>
                setSelected((current) => (current === mover.id ? null : mover.id))
              }
            >
              <span aria-hidden="true">{mover.emoji}</span> {mover.animal}
            </button>
          ))}
          {chips.length === 0 && !allMatched && (
            <p className="sort-complete">Level complete — moving on…</p>
          )}
          {allMatched && <p className="sort-complete">🎉 Every animal matched!</p>}
        </div>

        {/* appendage slots */}
        <div className="match-grid">
          {slots.map((slot) => {
            const placed = matched[slot.id] ? getMover(slot.id) : undefined;
            return (
              <div
                key={slot.id}
                className={`match-slot ${placed ? "is-matched" : ""}`}
                onDragOver={(event) => event.preventDefault()}
                onDrop={(event) => handleDrop(event, slot.appendage)}
                onClick={() => selected && attempt(selected, slot.appendage)}
              >
                <span className="ms-job">{slot.appendage}</span>
                {placed ? (
                  <span className="ms-name">
                    <span aria-hidden="true">{placed.emoji}</span> {placed.animal} ✅
                  </span>
                ) : (
                  <span className="ms-drop">drop an animal here</span>
                )}
              </div>
            );
          })}
        </div>

        {feedback && (
          <div
            className={feedback.isCorrect ? "feedback-panel is-correct" : "feedback-panel"}
            role="status"
            aria-live="polite"
          >
            <strong>{feedback.isCorrect ? "Correct" : "Try again"}</strong>
            <p>{feedback.message}</p>
          </div>
        )}
      </section>
    </article>
  );
}
