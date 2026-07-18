import { useEffect, useState } from "react";
import { ForceArrow } from "../../components/ForceArrow";
import {
  directionLabels,
  forceHints,
  forceLevels,
  isForceCorrect,
  mainDirections,
  allDirections,
  totalForceTargets,
  type Direction
} from "../../utils/force";
import type { SectionViewProps } from "../section";

interface Feedback {
  isCorrect: boolean;
  message: string;
  hints: string[];
}

// Exercise 1: read a target force (magnitude + direction), then set the arrow to match —
// the length for the magnitude, the arrow head for the direction.
export function DrawTheForce({ onProgress }: SectionViewProps) {
  const [levelIndex, setLevelIndex] = useState(0);
  const [targetIndex, setTargetIndex] = useState(0);
  const [solvedKeys, setSolvedKeys] = useState<Record<string, boolean>>({});
  const [magnitude, setMagnitude] = useState(0);
  const [direction, setDirection] = useState<Direction>("right");
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [revealed, setRevealed] = useState(false);

  const level = forceLevels[levelIndex];
  const target = level.targets[targetIndex];
  const solvedCount = Object.values(solvedKeys).filter(Boolean).length;
  const allSolved = solvedCount === totalForceTargets;

  // Diagonals only appear from level 2 onwards.
  const directions = levelIndex === 0 ? mainDirections : allDirections;

  useEffect(() => {
    onProgress({ score: solvedCount, total: totalForceTargets, completed: allSolved });
  }, [solvedCount, allSolved, onProgress]);

  function reset() {
    setMagnitude(0);
    setDirection("right");
    setFeedback(null);
    setRevealed(false);
  }

  function nextTarget() {
    reset();
    if (targetIndex + 1 < level.targets.length) {
      setTargetIndex(targetIndex + 1);
    } else if (levelIndex + 1 < forceLevels.length) {
      setLevelIndex(levelIndex + 1);
      setTargetIndex(0);
    }
  }

  function check() {
    if (isForceCorrect(target, magnitude, direction)) {
      setSolvedKeys((current) => ({
        ...current,
        [`${levelIndex}-${targetIndex}`]: true
      }));
      setFeedback({
        isCorrect: true,
        message: `Spot on — a ${target.magnitude} N force pointing ${directionLabels[target.direction].replace(/^[^ ]+ /, "").toLowerCase()}.`,
        hints: []
      });
    } else {
      setFeedback({
        isCorrect: false,
        message: "Not quite — compare your arrow with the target.",
        hints: forceHints(target, magnitude, direction)
      });
    }
  }

  const isLastTarget =
    levelIndex === forceLevels.length - 1 &&
    targetIndex === level.targets.length - 1;

  return (
    <article className="lesson">
      <header className="lesson-hero force">
        <p className="eyebrow">Exercise 1</p>
        <h2>Draw the Force</h2>
        <p>
          You are given a force to draw. Set the arrow's length for the magnitude and its
          head for the direction, then check it.
        </p>
      </header>

      <section className="lesson-block" aria-labelledby="draw-title">
        <div className="sort-header">
          <h3 id="draw-title">{level.title}</h3>
          <p className="solved-count" aria-live="polite">
            Drawn {solvedCount}/{totalForceTargets}
          </p>
        </div>
        <p className="sort-help">{level.blurb}</p>

        <div className="force-target">
          <span className="ft-label">Draw this force</span>
          <span className="ft-value">{target.magnitude} N</span>
          <span className="ft-dir">{directionLabels[target.direction]}</span>
          <span className="ft-point">applied at the {target.point}</span>
        </div>

        <div className="force-draw">
          <ForceArrow
            magnitude={magnitude}
            direction={direction}
            title={`Your force: ${magnitude} newtons pointing ${directionLabels[direction]}`}
          />

          <div className="force-draw-controls">
            <label className="slider-control" htmlFor="draw-mag">
              <span>
                Magnitude: <strong>{magnitude} N</strong>
              </span>
              <input
                id="draw-mag"
                type="range"
                min={0}
                max={16}
                value={magnitude}
                disabled={feedback?.isCorrect}
                onChange={(event) => setMagnitude(Number(event.target.value))}
              />
            </label>

            <p className="spring-objects-label">Direction:</p>
            <div className="dir-buttons">
              {directions.map((dir) => (
                <button
                  key={dir}
                  type="button"
                  className={direction === dir ? "is-active" : ""}
                  disabled={feedback?.isCorrect}
                  onClick={() => setDirection(dir)}
                >
                  {directionLabels[dir]}
                </button>
              ))}
            </div>

            <div className="drill-buttons">
              <button
                type="button"
                className="drill-check"
                onClick={check}
                disabled={feedback?.isCorrect}
              >
                Check my arrow
              </button>
              {!feedback?.isCorrect && (
                <button
                  type="button"
                  className="drill-next"
                  onClick={() => setRevealed(true)}
                >
                  Show me
                </button>
              )}
            </div>
          </div>
        </div>

        {revealed && !feedback?.isCorrect && (
          <p className="note-hint">
            💡 Set the magnitude slider to <strong>{target.magnitude}</strong> and choose{" "}
            <strong>{directionLabels[target.direction]}</strong>.
          </p>
        )}

        {feedback && (
          <div
            className={feedback.isCorrect ? "feedback-panel is-correct" : "feedback-panel"}
            role="status"
            aria-live="polite"
          >
            <strong>{feedback.isCorrect ? "Correct ✅" : "Try again"}</strong>
            <p>{feedback.message}</p>
            {feedback.hints.length > 0 && (
              <ul className="build-hints">
                {feedback.hints.map((hint) => (
                  <li key={hint}>{hint}</li>
                ))}
              </ul>
            )}
          </div>
        )}

        {feedback?.isCorrect && !isLastTarget && (
          <div className="drill-buttons">
            <button type="button" className="drill-check" onClick={nextTarget}>
              Next force →
            </button>
          </div>
        )}

        {allSolved && (
          <p className="sort-complete">
            🎉 Every force drawn! You can now show a force's magnitude, direction and point
            of application with a single arrow.
          </p>
        )}
      </section>
    </article>
  );
}
