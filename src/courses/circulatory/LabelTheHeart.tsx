import { useEffect, useMemo, useState, type DragEvent } from "react";
import { heartLevels, heartParts, type HeartPart } from "../../data/heartParts";
import { HeartFigure } from "./HeartFigure";
import type { SectionViewProps } from "../section";

interface LabelFeedback {
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

const partById = new Map(heartParts.map((part) => [part.id, part]));

// Level 4 textbook short-answer prompts (spec 21).
const shortAnswers = [
  {
    prompt: "Identify the two veins that open into the right atrium.",
    answer: "Superior vena cava and inferior vena cava."
  },
  {
    prompt: "Find the bicuspid and tricuspid valves — where is each one?",
    answer:
      "The bicuspid (mitral) valve is between the left atrium and left ventricle. The tricuspid valve is between the right atrium and right ventricle."
  },
  {
    prompt: "Name the four chambers of the heart.",
    answer: "Right atrium, left atrium, right ventricle, and left ventricle."
  }
];

export function LabelTheHeart({ onProgress }: SectionViewProps) {
  const [placed, setPlaced] = useState<Record<string, boolean>>({});
  const [levelIndex, setLevelIndex] = useState(0);
  const [selectedName, setSelectedName] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<LabelFeedback | null>(null);
  const [hint, setHint] = useState<string | null>(null);
  const [revealed, setRevealed] = useState<number | null>(null);

  const placedCount = Object.values(placed).filter(Boolean).length;
  const allPlaced = placedCount === heartParts.length;

  useEffect(() => {
    onProgress({
      score: placedCount,
      total: heartParts.length,
      completed: allPlaced
    });
  }, [placedCount, allPlaced, onProgress]);

  const currentLevel = heartLevels[levelIndex];
  const currentParts = currentLevel.partIds.map((id) => partById.get(id) as HeartPart);

  // Shuffle each level's name chips once.
  const shuffledNamesByLevel = useMemo(
    () => heartLevels.map((level) => shuffle(level.partIds.map((id) => partById.get(id) as HeartPart))),
    []
  );
  const levelNames = shuffledNamesByLevel[levelIndex].filter(
    (part) => !placed[part.id]
  );

  // Advance to the next level when the current one is fully labelled.
  useEffect(() => {
    const levelDone = currentLevel.partIds.every((id) => placed[id]);
    if (levelDone && levelIndex < heartLevels.length - 1) {
      const timer = window.setTimeout(() => setLevelIndex((index) => index + 1), 700);
      return () => window.clearTimeout(timer);
    }
    return undefined;
  }, [placed, currentLevel, levelIndex]);

  function attemptPlace(markerPartId: string, name: string) {
    if (placed[markerPartId]) {
      return;
    }

    const namedPart = heartParts.find((part) => part.label === name);
    if (!namedPart) {
      return;
    }

    if (namedPart.id === markerPartId) {
      setPlaced((current) => ({ ...current, [markerPartId]: true }));
      setFeedback({ isCorrect: true, message: `${namedPart.label}: ${namedPart.fact}` });
      setHint(null);
    } else {
      const target = partById.get(markerPartId) as HeartPart;
      setFeedback({
        isCorrect: false,
        message: `That marker is the ${target.label.toLowerCase()}, not the ${name.toLowerCase()}. Try again.`
      });
    }
    setSelectedName(null);
  }

  function handleDrop(event: DragEvent<SVGGElement>, markerPartId: string) {
    event.preventDefault();
    const name = event.dataTransfer.getData("text/plain");
    attemptPlace(markerPartId, name);
  }

  function revealHint() {
    const target = currentParts.find((part) => !placed[part.id]);
    setHint(target ? `Hint — ${target.label}: ${target.fact}` : null);
  }

  return (
    <article className="lesson">
      <header className="lesson-hero circulatory">
        <p className="eyebrow">Exercise 1</p>
        <h2>Label the Heart</h2>
        <p>
          Drag each name onto the matching marker, or tap a name then a marker. Work
          through chambers, then vessels, then valves.
        </p>
      </header>

      <section className="lesson-block" aria-labelledby="label-title">
        <div className="sort-header">
          <h3 id="label-title">{currentLevel.title}</h3>
          <p className="solved-count" aria-live="polite">
            Labelled {placedCount}/{heartParts.length}
          </p>
        </div>

        <div className="heart-explore">
          <HeartFigure title="Heart diagram to label">
            {heartParts.map((part, index) => {
              const isPlaced = placed[part.id];
              const isCurrentLevel = currentLevel.partIds.includes(part.id);
              const interactive = !isPlaced && isCurrentLevel;

              return (
                <g
                  key={part.id}
                  className={[
                    "label-marker",
                    isPlaced ? "is-placed" : "",
                    interactive ? "is-active" : "is-dim"
                  ].join(" ")}
                  role={interactive ? "button" : undefined}
                  tabIndex={interactive ? 0 : undefined}
                  aria-label={
                    isPlaced ? `${part.label} labelled` : `Marker ${index + 1}`
                  }
                  onDragOver={(event) => interactive && event.preventDefault()}
                  onDrop={(event) => interactive && handleDrop(event, part.id)}
                  onClick={() => {
                    if (interactive && selectedName) {
                      attemptPlace(part.id, selectedName);
                    }
                  }}
                  onKeyDown={(event) => {
                    if (interactive && selectedName && (event.key === "Enter" || event.key === " ")) {
                      event.preventDefault();
                      attemptPlace(part.id, selectedName);
                    }
                  }}
                >
                  <circle cx={part.marker.x} cy={part.marker.y} r="12" />
                  <text x={part.marker.x} y={part.marker.y + 4}>
                    {isPlaced ? "✓" : index + 1}
                  </text>
                  {isPlaced && (
                    <text
                      className="marker-label"
                      x={part.side === "left" ? part.marker.x - 16 : part.marker.x + 16}
                      y={part.marker.y + 3}
                      textAnchor={part.side === "left" ? "end" : "start"}
                    >
                      {part.label}
                    </text>
                  )}
                </g>
              );
            })}
          </HeartFigure>

          <div className="heart-info">
            <p className="label-help">
              {selectedName
                ? `Selected: ${selectedName}. Now click a numbered marker.`
                : "Pick a name below, then click a marker — or drag it across."}
            </p>
            <div className="names-pool" aria-label={`${currentLevel.title} names`}>
              {levelNames.map((part) => (
                <button
                  key={part.id}
                  type="button"
                  draggable
                  className={selectedName === part.label ? "is-selected" : ""}
                  aria-pressed={selectedName === part.label}
                  onDragStart={(event) =>
                    event.dataTransfer.setData("text/plain", part.label)
                  }
                  onClick={() =>
                    setSelectedName((current) =>
                      current === part.label ? null : part.label
                    )
                  }
                >
                  {part.label}
                </button>
              ))}
              {levelNames.length === 0 && !allPlaced && (
                <p className="sort-complete">Level complete — moving on…</p>
              )}
            </div>

            <button type="button" className="drill-hint" onClick={revealHint}>
              💡 Reveal a hint
            </button>
            {hint && <p className="hint-text">{hint}</p>}

            {feedback && (
              <div
                className={
                  feedback.isCorrect
                    ? "feedback-panel is-correct"
                    : "feedback-panel"
                }
                role="status"
                aria-live="polite"
              >
                <strong>{feedback.isCorrect ? "Snap!" : "Try again"}</strong>
                <p>{feedback.message}</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Level 4: short-answer prompts */}
      <section className="lesson-block" aria-labelledby="short-title">
        <h3 id="short-title">Level 4 · Textbook prompts</h3>
        {!allPlaced && (
          <p className="sort-help">
            Finish labelling the diagram to unlock these questions.
          </p>
        )}
        <ol className="short-answers">
          {shortAnswers.map((item, index) => (
            <li key={item.prompt}>
              <p>{item.prompt}</p>
              {revealed === index ? (
                <p className="short-answer-text">✔ {item.answer}</p>
              ) : (
                <button
                  type="button"
                  className="drill-hint"
                  disabled={!allPlaced}
                  onClick={() => setRevealed(index)}
                >
                  Show answer
                </button>
              )}
            </li>
          ))}
        </ol>
      </section>
    </article>
  );
}
