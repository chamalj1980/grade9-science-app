import { useEffect, useState } from "react";
import {
  challengeSolved,
  computeOutcome,
  labChallenges,
  totalChallenges,
  type LightDir
} from "../../utils/plantGrowth";
import type { SectionViewProps } from "../section";
import { PlantFigure } from "./PlantFigure";

const lightOptions: { id: LightDir; label: string; emoji: string }[] = [
  { id: "left", label: "From the left", emoji: "⬅️" },
  { id: "top", label: "Overhead", emoji: "⬆️" },
  { id: "right", label: "From the right", emoji: "➡️" }
];

interface Feedback {
  isCorrect: boolean;
  message: string;
}

// Exercise 1: set the light direction and whether the apex is intact, watch the plant
// respond, and use it to solve each phototropism challenge.
export function PhototropismLab({ onProgress }: SectionViewProps) {
  const [light, setLight] = useState<LightDir>("top");
  const [apexPresent, setApexPresent] = useState(true);
  const [levelIndex, setLevelIndex] = useState(0);
  const [solvedKeys, setSolvedKeys] = useState<Record<string, boolean>>({});
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [revealed, setRevealed] = useState(false);

  const challenge = labChallenges[levelIndex];
  const outcome = computeOutcome({ light, apexPresent });
  const solvedCount = Object.values(solvedKeys).filter(Boolean).length;
  const allSolved = solvedCount === totalChallenges;
  const isLast = levelIndex === labChallenges.length - 1;

  useEffect(() => {
    onProgress({ score: solvedCount, total: totalChallenges, completed: allSolved });
  }, [solvedCount, allSolved, onProgress]);

  const liveMessage = apexPresent
    ? outcome.bend === "up"
      ? "Light is even on both sides, so auxin stays even and the shoot grows straight up."
      : `Auxin collects on the ${outcome.auxinSide} (shaded) side, stretches those cells, and the tip curves toward the light.`
    : "The apex is cut, so no auxin is made at the tip. The shoot can't bend, and the lateral buds grow into a bushy plant.";

  function check() {
    if (challengeSolved(challenge, outcome)) {
      setSolvedKeys((current) => ({ ...current, [challenge.id]: true }));
      setFeedback({ isCorrect: true, message: liveMessage });
    } else {
      setFeedback({
        isCorrect: false,
        message: "Not yet — read the goal again and watch what the plant does."
      });
    }
  }

  function nextLevel() {
    if (levelIndex + 1 < labChallenges.length) {
      setLevelIndex(levelIndex + 1);
      setFeedback(null);
      setRevealed(false);
    }
  }

  return (
    <article className="lesson">
      <header className="lesson-hero plant">
        <p className="eyebrow">Exercise 1</p>
        <h2>Phototropism Lab</h2>
        <p>
          <span aria-hidden="true">🔦</span> Move the light and snip the apex to see how{" "}
          <strong>auxin</strong> makes a shoot bend. Then solve each challenge.
        </p>
      </header>

      <section className="lesson-block" aria-labelledby="lab-title">
        <div className="sort-header">
          <h3 id="lab-title">{challenge.title}</h3>
          <p className="solved-count" aria-live="polite">
            Solved {solvedCount}/{totalChallenges}
          </p>
        </div>

        <div className="lab-goal">
          <span className="lab-goal-tag">🎯 Goal</span>
          <p>{challenge.goal}</p>
        </div>

        <div className="plant-lab">
          <PlantFigure
            bend={outcome.bend}
            auxinSide={outcome.auxinSide}
            bushy={outcome.bushy}
            light={light}
            title={`A plant with its ${apexPresent ? "apex intact" : "apex removed"}, lit ${light === "top" ? "from overhead" : `from the ${light}`}`}
          />

          <div className="plant-lab-controls">
            <p className="spring-objects-label">Where is the light?</p>
            <div className="dir-buttons">
              {lightOptions.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  className={light === option.id ? "is-active" : ""}
                  aria-pressed={light === option.id}
                  onClick={() => {
                    setLight(option.id);
                    setFeedback(null);
                  }}
                >
                  <span aria-hidden="true">{option.emoji}</span> {option.label}
                </button>
              ))}
            </div>

            <p className="spring-objects-label">The growing tip (apex):</p>
            <div className="dir-buttons">
              <button
                type="button"
                className={apexPresent ? "is-active" : ""}
                aria-pressed={apexPresent}
                onClick={() => {
                  setApexPresent(true);
                  setFeedback(null);
                }}
              >
                🌱 Keep the apex
              </button>
              <button
                type="button"
                className={!apexPresent ? "is-active" : ""}
                aria-pressed={!apexPresent}
                onClick={() => {
                  setApexPresent(false);
                  setFeedback(null);
                }}
              >
                ✂️ Cut the apex
              </button>
            </div>

            <div className="lab-readout" role="status" aria-live="polite">
              {liveMessage}
            </div>

            <div className="drill-buttons">
              <button
                type="button"
                className="drill-check"
                onClick={check}
                disabled={solvedKeys[challenge.id]}
              >
                {solvedKeys[challenge.id] ? "Solved ✅" : "Check the goal"}
              </button>
              {!solvedKeys[challenge.id] && (
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

        {revealed && !solvedKeys[challenge.id] && (
          <p className="note-hint">💡 {challenge.hint}</p>
        )}

        {feedback && (
          <div
            className={feedback.isCorrect ? "feedback-panel is-correct" : "feedback-panel"}
            role="status"
            aria-live="polite"
          >
            <strong>{feedback.isCorrect ? "Correct ✅" : "Try again"}</strong>
            <p>{feedback.message}</p>
          </div>
        )}

        {solvedKeys[challenge.id] && !isLast && (
          <div className="drill-buttons">
            <button type="button" className="drill-check" onClick={nextLevel}>
              Next challenge →
            </button>
          </div>
        )}

        {allSolved && (
          <p className="sort-complete">
            🎉 Every challenge solved! You've shown how auxin drives phototropism and how
            removing the apex makes a plant bushy.
          </p>
        )}
      </section>
    </article>
  );
}
