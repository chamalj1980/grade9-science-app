import { useEffect, useMemo, useState, type DragEvent } from "react";
import { useReportProgress } from "../progress";
import { richText } from "../richText";
import type { SortBinsBlock } from "../schema";
import { isCorrectBin, itemsForBin } from "./logic";

interface SortFeedback {
  isCorrect: boolean;
  message: string;
}

// Sort statement cards into labelled bins. Supports drag-drop, tap-card-then-bin, and
// per-card buttons. Correct cards lock in place; wrong tries give feedback and stay.
export function SortBins({ block, blockId }: { block: SortBinsBlock; blockId: string }) {
  const report = useReportProgress();
  const total = block.items.length;

  const [placements, setPlacements] = useState<Record<string, string>>({});
  const [feedback, setFeedback] = useState<SortFeedback | null>(null);
  const [selected, setSelected] = useState<string | null>(null);

  const sortedCount = Object.keys(placements).length;
  const allSorted = sortedCount === total;

  useEffect(() => {
    report(blockId, { score: sortedCount, total, complete: allSorted, required: true });
  }, [report, blockId, sortedCount, total, allSorted]);

  const unplaced = useMemo(
    () => block.items.filter((item) => !placements[item.id]),
    [block.items, placements]
  );

  function assign(itemId: string, binId: string) {
    if (placements[itemId]) {
      return;
    }
    const item = block.items.find((candidate) => candidate.id === itemId);
    if (!item) {
      return;
    }
    if (isCorrectBin(block, itemId, binId)) {
      setPlacements((current) => ({ ...current, [itemId]: binId }));
      setFeedback(item.reason ? { isCorrect: true, message: item.reason } : null);
      setSelected(null);
    } else {
      setFeedback({
        isCorrect: false,
        message: item.reason ? `Look again — ${item.reason}` : "Look again — not quite."
      });
    }
  }

  function handleDrop(event: DragEvent<HTMLDivElement>, binId: string) {
    event.preventDefault();
    const id = event.dataTransfer.getData("text/plain");
    if (id) {
      assign(id, binId);
    }
  }

  return (
    <>
      <div className="sort-header">
        <h3>{block.title ?? "Sort the cards"}</h3>
        <p className="solved-count" aria-live="polite">
          Sorted {sortedCount}/{total}
        </p>
      </div>
      <p className="sort-help">
        {selected
          ? "Now choose a bin."
          : "Drag a statement into a bin, tap a card then a bin, or use its buttons. Correct cards lock in place."}
      </p>

      <ul className="sort-tray" aria-label="Statements to judge">
        {unplaced.map((item) => (
          <li
            key={item.id}
            className={`sort-card ${selected === item.id ? "is-selected" : ""}`}
            draggable
            onDragStart={(event) => event.dataTransfer.setData("text/plain", item.id)}
          >
            <button
              type="button"
              className="sort-card-face"
              aria-pressed={selected === item.id}
              onClick={() =>
                setSelected((current) => (current === item.id ? null : item.id))
              }
            >
              {item.text}
            </button>
            <span className="sort-card-actions">
              {block.bins.map((bin) => (
                <button
                  key={bin.id}
                  type="button"
                  onClick={() => assign(item.id, bin.id)}
                  aria-label={`Mark as ${bin.title}`}
                  title={bin.title}
                >
                  {bin.emoji}
                </button>
              ))}
            </span>
          </li>
        ))}
        {unplaced.length === 0 && (
          <li className="sort-complete">🎉 Every statement judged correctly!</li>
        )}
      </ul>

      <div className={`sort-bins ${block.wrapperClass ?? ""}`.trim()}>
        {block.bins.map((bin) => {
          const placed = itemsForBin(block, bin.id).filter(
            (item) => placements[item.id] === bin.id
          );
          return (
            <div
              key={bin.id}
              className={`sort-bin bin-${bin.id}`}
              onDragOver={(event) => event.preventDefault()}
              onDrop={(event) => handleDrop(event, bin.id)}
              onClick={() => selected && assign(selected, bin.id)}
            >
              <h4>
                {bin.emoji} {bin.title}
                {bin.hint && <span>{bin.hint}</span>}
              </h4>
              <ul aria-label={bin.title}>
                {placed.map((item) => (
                  <li key={item.id}>
                    <strong>{item.text} ✅</strong>
                    {item.reason && <span>{richText(item.reason)}</span>}
                  </li>
                ))}
              </ul>
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
          <p>{richText(feedback.message)}</p>
        </div>
      )}
    </>
  );
}
