import { useEffect, useMemo, useState, type DragEvent } from "react";
import { earParts } from "../../data/earParts";
import { eyeLevels, eyeParts } from "../../data/eyeParts";
import { EarFigure } from "./EarFigure";
import { EyeFigure } from "./EyeFigure";
import type { SectionViewProps } from "../section";

interface LabelFeedback {
  isCorrect: boolean;
  message: string;
}

// Shared shape of an eye or ear part for labelling (both data sets already match this).
interface LabelPart {
  id: string;
  label: string;
  short: string;
  fact: string;
  marker: { x: number; y: number };
  side: "left" | "right";
}

type SenseFigureName = "eye" | "ear";

interface SenseLevel {
  title: string;
  figure: SenseFigureName;
  partIds: string[];
}

function shuffle<T>(values: T[]): T[] {
  const copy = [...values];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

const eyeLabelParts: LabelPart[] = eyeParts;
const earLabelParts: LabelPart[] = earParts;
const allParts: LabelPart[] = [...eyeLabelParts, ...earLabelParts];
const partById = new Map(allParts.map((part) => [part.id, part]));
const totalParts = allParts.length;

// Four labelling levels: two on the eye, two on the ear.
const senseLevels: SenseLevel[] = [
  {
    title: "Level 1 · Eye — main parts",
    figure: "eye",
    partIds: eyeLevels[0].partIds
  },
  {
    title: "Level 2 · Eye — supporting parts",
    figure: "eye",
    partIds: eyeLevels[1].partIds
  },
  {
    title: "Level 3 · Ear — outer & middle",
    figure: "ear",
    partIds: [
      "pinna",
      "external-auditory-canal",
      "tympanic-membrane",
      "ossicles",
      "eustachian-tube"
    ]
  },
  {
    title: "Level 4 · Ear — inner",
    figure: "ear",
    partIds: ["cochlea", "auditory-nerve", "semicircular-canals"]
  }
];

// Textbook short-answer prompts, unlocked once everything is labelled.
const shortAnswers = [
  {
    prompt: "Which part of the eye does the image focus on?",
    answer: "The retina."
  },
  {
    prompt: "Which lens corrects short sight (myopia)?",
    answer: "A concave lens. (Long sight is corrected with a convex lens.)"
  },
  {
    prompt: "Name the three ossicles of the middle ear.",
    answer: "The malleus, the incus, and the stapes."
  },
  {
    prompt: "Which part of the ear helps maintain balance?",
    answer: "The semicircular canals."
  }
];

export function LabelTheSenses({ onProgress }: SectionViewProps) {
  const [placed, setPlaced] = useState<Record<string, boolean>>({});
  const [levelIndex, setLevelIndex] = useState(0);
  const [selectedName, setSelectedName] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<LabelFeedback | null>(null);
  const [hint, setHint] = useState<string | null>(null);
  const [revealed, setRevealed] = useState<number | null>(null);

  const placedCount = Object.values(placed).filter(Boolean).length;
  const allPlaced = placedCount === totalParts;

  useEffect(() => {
    onProgress({ score: placedCount, total: totalParts, completed: allPlaced });
  }, [placedCount, allPlaced, onProgress]);

  const currentLevel = senseLevels[levelIndex];
  const figureParts = currentLevel.figure === "eye" ? eyeLabelParts : earLabelParts;
  const currentParts = currentLevel.partIds.map((id) => partById.get(id) as LabelPart);

  // Shuffle each level's name chips once.
  const shuffledNamesByLevel = useMemo(
    () =>
      senseLevels.map((level) =>
        shuffle(level.partIds.map((id) => partById.get(id) as LabelPart))
      ),
    []
  );
  const levelNames = shuffledNamesByLevel[levelIndex].filter(
    (part) => !placed[part.id]
  );

  // Advance to the next level once the current one is fully labelled.
  useEffect(() => {
    const levelDone = currentLevel.partIds.every((id) => placed[id]);
    if (levelDone && levelIndex < senseLevels.length - 1) {
      const timer = window.setTimeout(() => {
        setLevelIndex((index) => index + 1);
        setSelectedName(null);
        setFeedback(null);
        setHint(null);
      }, 700);
      return () => window.clearTimeout(timer);
    }
    return undefined;
  }, [placed, currentLevel, levelIndex]);

  function attemptPlace(markerPartId: string, name: string) {
    if (placed[markerPartId]) {
      return;
    }

    const namedPart = allParts.find((part) => part.label === name);
    if (!namedPart) {
      return;
    }

    if (namedPart.id === markerPartId) {
      setPlaced((current) => ({ ...current, [markerPartId]: true }));
      setFeedback({ isCorrect: true, message: `${namedPart.label}: ${namedPart.fact}` });
      setHint(null);
    } else {
      const target = partById.get(markerPartId) as LabelPart;
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

  const markers = figureParts.map((part, index) => {
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
        aria-label={isPlaced ? `${part.label} labelled` : `Marker ${index + 1}`}
        onDragOver={(event) => interactive && event.preventDefault()}
        onDrop={(event) => interactive && handleDrop(event, part.id)}
        onClick={() => {
          if (interactive && selectedName) {
            attemptPlace(part.id, selectedName);
          }
        }}
        onKeyDown={(event) => {
          if (
            interactive &&
            selectedName &&
            (event.key === "Enter" || event.key === " ")
          ) {
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
  });

  return (
    <article className="lesson">
      <header className="lesson-hero sensory-system">
        <p className="eyebrow">Exercise 1</p>
        <h2>Label It!</h2>
        <p>
          Drag each name onto the matching marker, or tap a name then a marker. Work
          through the eye, then the ear.
        </p>
      </header>

      <section className="lesson-block" aria-labelledby="label-title">
        <div className="sort-header">
          <h3 id="label-title">{currentLevel.title}</h3>
          <p className="solved-count" aria-live="polite">
            Labelled {placedCount}/{totalParts}
          </p>
        </div>

        <div className="heart-explore">
          {currentLevel.figure === "eye" ? (
            <EyeFigure title="Eye diagram to label">{markers}</EyeFigure>
          ) : (
            <EarFigure title="Ear diagram to label">{markers}</EarFigure>
          )}

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
              {allPlaced && (
                <p className="sort-complete">🎉 Every part labelled!</p>
              )}
            </div>

            <button type="button" className="drill-hint" onClick={revealHint}>
              💡 Reveal a hint
            </button>
            {hint && <p className="hint-text">{hint}</p>}

            {feedback && (
              <div
                className={
                  feedback.isCorrect ? "feedback-panel is-correct" : "feedback-panel"
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

      {/* Short-answer prompts */}
      <section className="lesson-block" aria-labelledby="short-title">
        <h3 id="short-title">Textbook prompts</h3>
        {!allPlaced && (
          <p className="sort-help">
            Finish labelling the eye and ear to unlock these questions.
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
