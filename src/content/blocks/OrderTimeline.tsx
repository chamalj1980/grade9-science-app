import { useEffect, useMemo, useState } from "react";
import { useReportProgress } from "../progress";
import type { OrderTimelineBlock } from "../schema";
import { isOrderComplete, orderCorrectness, totalOrderItems } from "./logic";

function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

// Tap pool chips to drop them into the next slot, earliest first; tap a placed chip to
// send it back. Arranging a round correctly counts it as solved immediately.
export function OrderTimeline({
  block,
  blockId
}: {
  block: OrderTimelineBlock;
  blockId: string;
}) {
  const report = useReportProgress();
  const rounds = block.rounds;
  const total = useMemo(() => totalOrderItems(block), [block]);

  const [roundIndex, setRoundIndex] = useState(0);
  const [placed, setPlaced] = useState<string[]>([]);
  const [checked, setChecked] = useState(false);
  const [solvedRounds, setSolvedRounds] = useState<Record<string, boolean>>({});

  const round = rounds[roundIndex];
  const shuffledPool = useMemo(() => shuffle(round.order), [round]);

  const remaining = shuffledPool.filter((item) => !placed.includes(item.id));
  const isComplete = placed.length === round.order.length;
  const correct = isComplete && isOrderComplete(round, placed);
  const marks = checked ? orderCorrectness(round, placed) : [];

  const solvedItems = useMemo(
    () =>
      rounds
        .filter((candidate) => solvedRounds[candidate.id])
        .reduce((sum, candidate) => sum + candidate.order.length, 0),
    [rounds, solvedRounds]
  );
  const allSolved = solvedItems === total;

  useEffect(() => {
    report(blockId, { score: solvedItems, total, complete: allSolved, required: true });
  }, [report, blockId, solvedItems, total, allSolved]);

  // A round going fully correct is itself the "check" — record it without a button press.
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
    if (roundIndex + 1 < rounds.length) {
      setRoundIndex(roundIndex + 1);
    }
  }

  function labelFor(id: string) {
    return round.order.find((item) => item.id === id)!;
  }

  const isLastRound = roundIndex === rounds.length - 1;

  return (
    <>
      <div className="sort-header">
        <h3>{round.title}</h3>
        <p className="solved-count" aria-live="polite">
          Placed {solvedItems}/{total}
        </p>
      </div>
      <p className="sort-help">{round.prompt}</p>

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

      {allSolved && block.successNote && (
        <p className="sort-complete">{block.successNote}</p>
      )}
    </>
  );
}
