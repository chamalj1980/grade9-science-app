import { useEffect, useMemo, useState, type DragEvent } from "react";
import {
  effectInfo,
  forceScenarios,
  type EffectId
} from "../../data/forceData";
import { isCorrectEffect, totalScenarios } from "../../utils/force";
import type { SectionViewProps } from "../section";

interface SortFeedback {
  isCorrect: boolean;
  message: string;
}

const bins: EffectId[] = ["move", "stop", "speed", "direction", "shape"];

interface QuizQuestion {
  prompt: string;
  options: string[];
  answer: number;
}

// Recap MCQs taken from the chapter's own end-of-unit exercise.
const quiz: QuizQuestion[] = [
  {
    prompt: "The weight of an object is a force. What is the unit for measuring weight?",
    options: ["kg", "kg s", "N", "N s"],
    answer: 2
  },
  {
    prompt: "Force is considered a vector quantity because it has…",
    options: [
      "a magnitude",
      "a point of application",
      "a direction",
      "a magnitude and a direction"
    ],
    answer: 3
  },
  {
    prompt:
      "When a force is drawn as a straight line, which statements are true? a) length shows magnitude · b) the arrow head shows direction · c) the point of application is the MID-point of the line",
    options: ["a and b only", "a and c only", "b and c only", "a, b and c"],
    answer: 0
  },
  {
    prompt:
      "Because of a force applied on an object: a) an object at rest can move · b) a moving object can stop · c) the direction of motion can change. Which are true?",
    options: ["a and b only", "a and c only", "b and c only", "a, b and c"],
    answer: 3
  },
  {
    prompt: "Which instrument is used to measure the magnitude of a force?",
    options: [
      "A metre ruler",
      "A Newton spring balance",
      "A measuring cylinder",
      "A stopwatch"
    ],
    answer: 1
  }
];

export function ForceSortAndQuiz({ onProgress }: SectionViewProps) {
  const [placements, setPlacements] = useState<Record<string, EffectId>>({});
  const [sortFeedback, setSortFeedback] = useState<SortFeedback | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});

  const sortedCount = Object.keys(placements).length;
  const allSorted = sortedCount === totalScenarios;

  const quizScore = useMemo(
    () =>
      Object.entries(quizAnswers).filter(
        ([index, choice]) => quiz[Number(index)].answer === choice
      ).length,
    [quizAnswers]
  );

  useEffect(() => {
    onProgress({
      score: sortedCount,
      total: totalScenarios,
      streak: quizScore,
      completed: allSorted
    });
  }, [sortedCount, allSorted, quizScore, onProgress]);

  const unplaced = useMemo(
    () => forceScenarios.filter((scenario) => !placements[scenario.id]),
    [placements]
  );

  function assign(scenarioId: string, effect: EffectId) {
    if (placements[scenarioId]) {
      return;
    }
    const scenario = forceScenarios.find((item) => item.id === scenarioId);
    if (!scenario) {
      return;
    }
    if (isCorrectEffect(scenarioId, effect)) {
      setPlacements((current) => ({ ...current, [scenarioId]: effect }));
      setSortFeedback({ isCorrect: true, message: scenario.reason });
      setSelected(null);
    } else {
      setSortFeedback({
        isCorrect: false,
        message: `"${scenario.label}" doesn't belong in "${effectInfo[effect].title}". Think about what changes.`
      });
    }
  }

  function handleDrop(event: DragEvent<HTMLDivElement>, effect: EffectId) {
    event.preventDefault();
    const scenarioId = event.dataTransfer.getData("text/plain");
    if (scenarioId) {
      assign(scenarioId, effect);
    }
  }

  return (
    <article className="sort-calc force-sort">
      <div className="playground-intro">
        <p className="eyebrow">Exercise 2</p>
        <h2>What Does the Force Do?</h2>
        <p>
          Sort each everyday action by the <strong>effect</strong> its force has, then take
          the recap quiz.
        </p>
      </div>

      {/* Part A: sort */}
      <section className="sort-panel" aria-labelledby="sortf-title">
        <div className="sort-header">
          <h3 id="sortf-title">Part A · Sort by effect</h3>
          <p className="solved-count" aria-live="polite">
            Sorted {sortedCount}/{totalScenarios}
          </p>
        </div>
        <p className="sort-help">
          {selected
            ? `Selected: ${forceScenarios.find((s) => s.id === selected)?.label}. Now choose a bin.`
            : "Drag a card into a bin, tap a card then a bin, or use its buttons. Correct cards lock in place."}
        </p>

        <ul className="sort-tray" aria-label="Actions to sort">
          {unplaced.map((scenario) => (
            <li
              key={scenario.id}
              className={`sort-card ${selected === scenario.id ? "is-selected" : ""}`}
              draggable
              onDragStart={(event) =>
                event.dataTransfer.setData("text/plain", scenario.id)
              }
            >
              <button
                type="button"
                className="sort-card-face"
                aria-pressed={selected === scenario.id}
                onClick={() =>
                  setSelected((current) =>
                    current === scenario.id ? null : scenario.id
                  )
                }
              >
                <span aria-hidden="true">{scenario.emoji}</span> {scenario.label}
              </button>
              <span className="sort-card-actions">
                {bins.map((bin) => (
                  <button
                    key={bin}
                    type="button"
                    onClick={() => assign(scenario.id, bin)}
                    aria-label={`${scenario.label}: ${effectInfo[bin].title}`}
                    title={effectInfo[bin].title}
                  >
                    {effectInfo[bin].emoji}
                  </button>
                ))}
              </span>
            </li>
          ))}
          {unplaced.length === 0 && (
            <li className="sort-complete">🎉 Every action sorted correctly!</li>
          )}
        </ul>

        <div className="sort-bins force-bins">
          {bins.map((bin) => {
            const placed = forceScenarios.filter(
              (scenario) => placements[scenario.id] === bin
            );
            return (
              <div
                key={bin}
                className={`sort-bin bin-${bin}`}
                onDragOver={(event) => event.preventDefault()}
                onDrop={(event) => handleDrop(event, bin)}
                onClick={() => selected && assign(selected, bin)}
              >
                <h4>
                  {effectInfo[bin].emoji} {effectInfo[bin].title}
                  <span>{effectInfo[bin].hint}</span>
                </h4>
                <ul aria-label={effectInfo[bin].title}>
                  {placed.map((scenario) => (
                    <li key={scenario.id}>
                      <strong>
                        <span aria-hidden="true">{scenario.emoji}</span> {scenario.label} ✅
                      </strong>
                      <span>{scenario.reason}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        {sortFeedback && (
          <div
            className={
              sortFeedback.isCorrect ? "feedback-panel is-correct" : "feedback-panel"
            }
            role="status"
            aria-live="polite"
          >
            <strong>{sortFeedback.isCorrect ? "Correct" : "Try again"}</strong>
            <p>{sortFeedback.message}</p>
          </div>
        )}
      </section>

      {/* Part B: quiz */}
      <section className="lesson-block" aria-labelledby="quizf-title">
        <div className="sort-header">
          <h3 id="quizf-title">Part B · Quick recap quiz</h3>
          <p className="solved-count">
            Quiz {quizScore}/{quiz.length}
          </p>
        </div>
        <ol className="quiz-list">
          {quiz.map((question, qIndex) => {
            const chosen = quizAnswers[qIndex];
            const answered = chosen !== undefined;

            return (
              <li key={question.prompt}>
                <p className="quiz-prompt">{question.prompt}</p>
                <div className="quiz-options">
                  {question.options.map((option, oIndex) => {
                    const isChosen = chosen === oIndex;
                    const isAnswer = question.answer === oIndex;
                    const className = !answered
                      ? "quiz-option"
                      : isAnswer
                        ? "quiz-option is-correct"
                        : isChosen
                          ? "quiz-option is-wrong"
                          : "quiz-option";

                    return (
                      <button
                        key={option}
                        type="button"
                        className={className}
                        disabled={answered}
                        onClick={() =>
                          setQuizAnswers((current) => ({ ...current, [qIndex]: oIndex }))
                        }
                      >
                        {option}
                      </button>
                    );
                  })}
                </div>
              </li>
            );
          })}
        </ol>
      </section>
    </article>
  );
}
