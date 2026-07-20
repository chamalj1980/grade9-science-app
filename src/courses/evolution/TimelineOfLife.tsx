import { useEffect, useMemo, useState } from "react";
import { timelineRounds, totalTimelineItems } from "../../data/evolutionData";
import {
  isOrderComplete,
  orderCorrectness
} from "../../utils/evolution";
import type { SectionViewProps } from "../section";

function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

// Exercise 1: build the timeline. Tap pool chips to drop them into the next slot,
// earliest first; tap a placed chip to send it back. Check when the strip is full.
export function TimelineOfLife({ onProgress }: SectionViewProps) {
  const [roundIndex, setRoundIndex] = useState(0);
  const [placed, setPlaced] = useState<string[]>([]);
  const [checked, setChecked] = useState(false);
  const [solvedRounds, setSolvedRounds] = useState<Record<string, boolean>>({});

  const round = timelineRounds[roundIndex];
  const shuffledPool = useMemo(() => shuffle(round.order), [round]);

  const remaining = shuffledPool.filter((item) => !placed.includes(item.id));
  const isComplete = placed.length === round.order.length;
  const correct = isComplete && isOrderComplete(round, placed);
  const marks = checked ? orderCorrectness(round, placed) : [];

  const solvedItems = useMemo(
    () =>
      timelineRounds
        .filter((r) => solvedRounds[r.id])
        .reduce((sum, r) => sum + r.order.length, 0),
    [solvedRounds]
  );
  const allSolved = solvedItems === totalTimelineItems;

  useEffect(() => {
    onProgress({ score: solvedItems, total: totalTimelineItems, completed: allSolved });
  }, [solvedItems, allSolved, onProgress]);

  // Arranging every stage correctly counts as solved immediately — the strip going
  // fully correct is itself the "check", so we show the tick and record progress
  // without needing a separate button press.
  useEffect(() => {
    if (correct) {
      setChecked(true);
      setSolvedRounds((current) =>
        current[round.id] ? current : { ...current, [round.id]: true }
      );
    }
  }, [correct, round.id]);

  function place(id: string) {
    if (correct) {
      return;
    }
    setChecked(false);
    setPlaced((current) => (current.includes(id) ? current : [...current, id]));
  }

  function removeAt(index: number) {
    if (correct) {
      return;
    }
    setChecked(false);
    setPlaced((current) => current.filter((_, i) => i !== index));
  }

  function check() {
    setChecked(true);
    if (isOrderComplete(round, placed)) {
      setSolvedRounds((current) => ({ ...current, [round.id]: true }));
    }
  }

  function nextRound() {
    setPlaced([]);
    setChecked(false);
    if (roundIndex + 1 < timelineRounds.length) {
      setRoundIndex(roundIndex + 1);
    }
  }

  function labelFor(id: string) {
    return round.order.find((item) => item.id === id)!;
  }

  const isLastRound = roundIndex === timelineRounds.length - 1;

  return (
    <article className="lesson">
      <header className="lesson-hero evolution">
        <p className="eyebrow">Exercise 1</p>
        <h2>Timeline of Life</h2>
        <p>
          Tap the stages into the timeline in the right order — earliest first. Fill every
          slot, then check your work.
        </p>
      </header>

      <section className="lesson-block" aria-labelledby="tl-title">
        <div className="sort-header">
          <h3 id="tl-title">{round.title}</h3>
          <p className="solved-count" aria-live="polite">
            Placed {solvedItems}/{totalTimelineItems}
          </p>
        </div>
        <p className="sort-help">{round.prompt}</p>

        {/* the timeline strip */}
        <ol className="tl-strip" aria-label="Your timeline (earliest first)">
          {round.order.map((_, slot) => {
            const id = placed[slot];
            const item = id ? labelFor(id) : null;
            let cls = "tl-slot";
            if (item) cls += " filled";
            if (checked && item) cls += marks[slot] ? " ok" : " no";
            return (
              <li key={slot} className={cls}>
                <span className="tl-num">{slot + 1}</span>
                {item ? (
                  <button
                    type="button"
                    className="tl-placed"
                    onClick={() => removeAt(slot)}
                    aria-label={`Remove ${item.label}`}
                  >
                    <span aria-hidden="true">{item.emoji}</span> {item.label}
                    {checked && <span className="tl-mark">{marks[slot] ? "✅" : "❌"}</span>}
                  </button>
                ) : (
                  <span className="tl-empty">Tap a stage below…</span>
                )}
              </li>
            );
          })}
        </ol>

        {/* the pool */}
        {remaining.length > 0 && (
          <div className="tl-pool" aria-label="Stages to place">
            {remaining.map((item) => (
              <button
                key={item.id}
                type="button"
                className="tl-chip"
                onClick={() => place(item.id)}
              >
                <span aria-hidden="true">{item.emoji}</span> {item.label}
              </button>
            ))}
          </div>
        )}

        <div className="drill-buttons">
          {!correct && (
            <>
              <button
                type="button"
                className="drill-check"
                onClick={check}
                disabled={!isComplete}
              >
                Check the order
              </button>
              <button
                type="button"
                className="drill-next"
                onClick={() => {
                  setPlaced([]);
                  setChecked(false);
                }}
              >
                Clear
              </button>
            </>
          )}
          {correct && !isLastRound && (
            <button type="button" className="drill-check" onClick={nextRound}>
              Next level →
            </button>
          )}
        </div>

        {checked && (
          <div
            className={correct ? "feedback-panel is-correct" : "feedback-panel"}
            role="status"
            aria-live="polite"
          >
            <strong>{correct ? "Perfect order ✅" : "Not quite"}</strong>
            <p>
              {correct
                ? "Every stage is in the right place."
                : "The red slots are out of order — tap them to send them back and try again."}
            </p>
          </div>
        )}

        {allSolved && (
          <p className="sort-complete">
            🎉 Every timeline solved! You can trace life from the first cell to today.
          </p>
        )}
      </section>
    </article>
  );
}
