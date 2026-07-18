import { useEffect, useMemo, useState, type DragEvent } from "react";
import {
  hormoneBinInfo,
  hormoneScenarios,
  type HormoneId
} from "../../data/plantGrowthData";
import { isCorrectHormone, totalHormoneScenarios } from "../../utils/plantGrowth";
import type { SectionViewProps } from "../section";

interface SortFeedback {
  isCorrect: boolean;
  message: string;
}

const bins: HormoneId[] = ["auxin", "gibberellin", "cytokinin", "abscisic", "ethene"];

interface QuizQuestion {
  prompt: string;
  options: string[];
  answer: number;
}

// Recap MCQs adapted from the chapter's own end-of-unit exercise.
const quiz: QuizQuestion[] = [
  {
    prompt:
      "A plant grows near a window and its tip curves to the side facing the window. What is it growing towards?",
    options: ["Water", "Light", "Soil", "Air"],
    answer: 1
  },
  {
    prompt:
      "In one-directional light, on which side of the shoot does auxin collect?",
    options: [
      "The side facing the light",
      "The shaded side, away from the light",
      "Evenly on both sides",
      "Only at the roots"
    ],
    answer: 1
  },
  {
    prompt: "Which growth substance mainly speeds up cell division?",
    options: ["Auxin", "Gibberellin", "Cytokinin", "Abscisic acid"],
    answer: 2
  },
  {
    prompt:
      "Which artificial growth substance prevents pre-mature fruit drop and induces off-season flowering in pineapple?",
    options: ["2,4-D", "IAA", "IBA", "NAA"],
    answer: 3
  },
  {
    prompt: "Select the INCORRECT statement about plant growth substances.",
    options: [
      "They are organic substances that control activities in plants.",
      "Some can be made artificially for use.",
      "Some are used to help fruits form.",
      "They only ever speed plant growth up."
    ],
    answer: 3
  }
];

export function HormoneSortAndQuiz({ onProgress }: SectionViewProps) {
  const [placements, setPlacements] = useState<Record<string, HormoneId>>({});
  const [sortFeedback, setSortFeedback] = useState<SortFeedback | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});

  const sortedCount = Object.keys(placements).length;
  const allSorted = sortedCount === totalHormoneScenarios;

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
      total: totalHormoneScenarios,
      streak: quizScore,
      completed: allSorted
    });
  }, [sortedCount, allSorted, quizScore, onProgress]);

  const unplaced = useMemo(
    () => hormoneScenarios.filter((scenario) => !placements[scenario.id]),
    [placements]
  );

  function assign(scenarioId: string, hormone: HormoneId) {
    if (placements[scenarioId]) {
      return;
    }
    const scenario = hormoneScenarios.find((item) => item.id === scenarioId);
    if (!scenario) {
      return;
    }
    if (isCorrectHormone(scenarioId, hormone)) {
      setPlacements((current) => ({ ...current, [scenarioId]: hormone }));
      setSortFeedback({ isCorrect: true, message: scenario.reason });
      setSelected(null);
    } else {
      setSortFeedback({
        isCorrect: false,
        message: `"${scenario.label}" is not caused by ${hormoneBinInfo[hormone].title}. Think about what that substance does.`
      });
    }
  }

  function handleDrop(event: DragEvent<HTMLDivElement>, hormone: HormoneId) {
    event.preventDefault();
    const scenarioId = event.dataTransfer.getData("text/plain");
    if (scenarioId) {
      assign(scenarioId, hormone);
    }
  }

  return (
    <article className="sort-calc plant-sort">
      <div className="playground-intro">
        <p className="eyebrow">Exercise 2</p>
        <h2>Which Growth Substance?</h2>
        <p>
          Sort each effect under the <strong>growth substance</strong> that causes it, then
          take the recap quiz.
        </p>
      </div>

      {/* Part A: sort */}
      <section className="sort-panel" aria-labelledby="sortp-title">
        <div className="sort-header">
          <h3 id="sortp-title">Part A · Sort by growth substance</h3>
          <p className="solved-count" aria-live="polite">
            Sorted {sortedCount}/{totalHormoneScenarios}
          </p>
        </div>
        <p className="sort-help">
          {selected
            ? `Selected: ${hormoneScenarios.find((s) => s.id === selected)?.label}. Now choose a bin.`
            : "Drag a card into a bin, tap a card then a bin, or use its buttons. Correct cards lock in place."}
        </p>

        <ul className="sort-tray" aria-label="Effects to sort">
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
                    aria-label={`${scenario.label}: ${hormoneBinInfo[bin].title}`}
                    title={hormoneBinInfo[bin].title}
                  >
                    {hormoneBinInfo[bin].emoji}
                  </button>
                ))}
              </span>
            </li>
          ))}
          {unplaced.length === 0 && (
            <li className="sort-complete">🎉 Every effect sorted correctly!</li>
          )}
        </ul>

        <div className="sort-bins plant-bins">
          {bins.map((bin) => {
            const placed = hormoneScenarios.filter(
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
                  {hormoneBinInfo[bin].emoji} {hormoneBinInfo[bin].title}
                  <span>{hormoneBinInfo[bin].hint}</span>
                </h4>
                <ul aria-label={hormoneBinInfo[bin].title}>
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
      <section className="lesson-block" aria-labelledby="quizp-title">
        <div className="sort-header">
          <h3 id="quizp-title">Part B · Quick recap quiz</h3>
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
