import { useEffect, useState } from "react";
import { AtomFigure } from "../../components/AtomFigure";
import {
  atomHints,
  atomLevels,
  isAtomCorrect,
  massNumber,
  totalAtomTargets
} from "../../utils/matter";
import type { SectionViewProps } from "../section";

interface Feedback {
  isCorrect: boolean;
  message: string;
  hints: string[];
}

// Exercise 1: the student is given a target element and must assemble a neutral atom of
// it — the right protons, neutrons and electrons — reading the live atomic number and
// mass number as they go.
export function BuildTheAtom({ onProgress }: SectionViewProps) {
  const [levelIndex, setLevelIndex] = useState(0);
  const [targetIndex, setTargetIndex] = useState(0);
  const [solved, setSolved] = useState<Record<string, boolean>>({});
  const [protons, setProtons] = useState(0);
  const [neutrons, setNeutrons] = useState(0);
  const [electrons, setElectrons] = useState(0);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [revealed, setRevealed] = useState(false);

  const level = atomLevels[levelIndex];
  const target = level.targets[targetIndex];
  const solvedCount = Object.values(solved).filter(Boolean).length;
  const allSolved = solvedCount === totalAtomTargets;

  useEffect(() => {
    onProgress({
      score: solvedCount,
      total: totalAtomTargets,
      completed: allSolved
    });
  }, [solvedCount, allSolved, onProgress]);

  function reset() {
    setProtons(0);
    setNeutrons(0);
    setElectrons(0);
    setFeedback(null);
    setRevealed(false);
  }

  function nextTarget() {
    reset();
    if (targetIndex + 1 < level.targets.length) {
      setTargetIndex(targetIndex + 1);
    } else if (levelIndex + 1 < atomLevels.length) {
      setLevelIndex(levelIndex + 1);
      setTargetIndex(0);
    }
  }

  function check() {
    const correct = isAtomCorrect(target, protons, neutrons, electrons);
    if (correct) {
      setSolved((current) => ({ ...current, [target.symbol]: true }));
      setFeedback({
        isCorrect: true,
        message: `That's ${target.name}! Atomic number ${target.protons}, mass number ${massNumber(target.protons, target.neutrons)}.`,
        hints: []
      });
    } else {
      setFeedback({
        isCorrect: false,
        message: "Not quite yet — check each particle.",
        hints: atomHints(target, protons, neutrons, electrons)
      });
    }
  }

  const isLastTarget =
    levelIndex === atomLevels.length - 1 &&
    targetIndex === level.targets.length - 1;

  return (
    <article className="lesson">
      <header className="lesson-hero matter">
        <p className="eyebrow">Exercise 1</p>
        <h2>Build the Atom</h2>
        <p>
          You are given an element. Add the right particles to build one neutral atom of
          it — then check your work.
        </p>
      </header>

      <section className="lesson-block" aria-labelledby="build-title">
        <div className="sort-header">
          <h3 id="build-title">{level.title}</h3>
          <p className="solved-count" aria-live="polite">
            Built {solvedCount}/{totalAtomTargets}
          </p>
        </div>
        <p className="sort-help">{level.blurb}</p>

        <div className="build-target">
          <span className="bt-label">Your target</span>
          <span className="bt-symbol">{target.symbol}</span>
          <span className="bt-name">{target.name}</span>
          <span className="bt-brief">
            Atomic number <strong>{target.protons}</strong> · Mass number{" "}
            <strong>{massNumber(target.protons, target.neutrons)}</strong>
          </span>
        </div>

        <div className="atom-lab">
          <AtomFigure
            protons={protons}
            neutrons={neutrons}
            electrons={electrons}
            title={`Your atom: ${protons} protons, ${neutrons} neutrons, ${electrons} electrons`}
          />

          <div className="atom-controls">
            {[
              { label: "Protons", value: protons, set: setProtons, cls: "p" },
              { label: "Neutrons", value: neutrons, set: setNeutrons, cls: "n" },
              { label: "Electrons", value: electrons, set: setElectrons, cls: "e" }
            ].map((row) => (
              <div key={row.label} className={`atom-row ${row.cls}`}>
                <span className="ar-label">
                  <span className="ar-dot" aria-hidden="true" /> {row.label}
                </span>
                <div className="ar-buttons">
                  <button
                    type="button"
                    disabled={feedback?.isCorrect}
                    onClick={() => row.set(Math.max(0, row.value - 1))}
                    aria-label={`Remove one ${row.label.slice(0, -1).toLowerCase()}`}
                  >
                    −
                  </button>
                  <span className="ar-value">{row.value}</span>
                  <button
                    type="button"
                    disabled={feedback?.isCorrect}
                    onClick={() => row.set(Math.min(30, row.value + 1))}
                    aria-label={`Add one ${row.label.slice(0, -1).toLowerCase()}`}
                  >
                    +
                  </button>
                </div>
              </div>
            ))}

            <div className="build-readout">
              <div>
                <strong>{protons}</strong>
                <span>Atomic number (Z)</span>
              </div>
              <div>
                <strong>{massNumber(protons, neutrons)}</strong>
                <span>Mass number (A)</span>
              </div>
              <div>
                <strong>{protons === electrons ? "Yes" : "No"}</strong>
                <span>Neutral?</span>
              </div>
            </div>

            <div className="drill-buttons">
              <button
                type="button"
                className="drill-check"
                onClick={check}
                disabled={feedback?.isCorrect}
              >
                Check my atom
              </button>
              <button type="button" className="drill-next" onClick={reset}>
                Clear
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
            💡 {target.name} needs <strong>{target.protons} protons</strong>,{" "}
            <strong>{target.neutrons} neutrons</strong> and{" "}
            <strong>{target.protons} electrons</strong> (equal to the protons, so the atom
            is neutral).
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
              Next element →
            </button>
          </div>
        )}

        {allSolved && (
          <p className="sort-complete">
            🎉 Every atom built! You can read any element from its atomic and mass number.
          </p>
        )}
      </section>
    </article>
  );
}
