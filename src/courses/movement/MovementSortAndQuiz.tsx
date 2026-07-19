import { useEffect, useMemo, useState, type DragEvent } from "react";
import {
  plantMoveInfo,
  plantScenarios,
  type PlantMoveType
} from "../../data/movementData";
import { isCorrectType, totalScenarios } from "../../utils/movement";
import type { SectionViewProps } from "../section";

interface SortFeedback {
  isCorrect: boolean;
  message: string;
}

const bins: PlantMoveType[] = ["tropic", "nastic"];

interface QuizQuestion {
  prompt: string;
  options: string[];
  answer: number;
}

// Recap MCQs taken from the chapter's own end-of-unit exercise.
const quiz: QuizQuestion[] = [
  {
    prompt: "The appendage a snail uses for locomotion is a…",
    options: ["Flagellum", "Pseudopodium", "Cilium", "Muscular foot"],
    answer: 3
  },
  {
    prompt: "What helps to maintain the rigidity of a non-woody plant?",
    options: ["Water", "Air", "Deposited materials", "Plant nutrients"],
    answer: 0
  },
  {
    prompt: "Human movements need…",
    options: [
      "only the bones",
      "only the muscles",
      "both bones and muscles",
      "neither bones nor muscles"
    ],
    answer: 2
  },
  {
    prompt:
      "The leaves of a Mimosa plant show a sleep movement when touched. This movement is…",
    options: [
      "haptonastic",
      "nyctinastic",
      "photonastic",
      "positive geotropic"
    ],
    answer: 0
  },
  {
    prompt: "The growth of a stem towards light is a…",
    options: [
      "positive phototropic movement",
      "negative geotropic movement",
      "haptonastic movement",
      "nyctinastic movement"
    ],
    answer: 0
  },
  {
    prompt: "A tropic movement is a movement whose response is…",
    options: [
      "directed towards the stimulus only",
      "directed opposite the stimulus only",
      "independent of the stimulus direction",
      "directed towards OR opposite the stimulus"
    ],
    answer: 3
  }
];

export function MovementSortAndQuiz({ onProgress }: SectionViewProps) {
  const [placements, setPlacements] = useState<Record<string, PlantMoveType>>({});
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
    () => plantScenarios.filter((scenario) => !placements[scenario.id]),
    [placements]
  );

  function assign(scenarioId: string, type: PlantMoveType) {
    if (placements[scenarioId]) {
      return;
    }
    const scenario = plantScenarios.find((item) => item.id === scenarioId);
    if (!scenario) {
      return;
    }
    if (isCorrectType(scenarioId, type)) {
      setPlacements((current) => ({ ...current, [scenarioId]: type }));
      setSortFeedback({ isCorrect: true, message: scenario.reason });
      setSelected(null);
    } else {
      setSortFeedback({
        isCorrect: false,
        message: `That's not a ${plantMoveInfo[type].title.toLowerCase()} movement. Is the direction linked to the stimulus (tropic) or fixed (nastic)?`
      });
    }
  }

  function handleDrop(event: DragEvent<HTMLDivElement>, type: PlantMoveType) {
    event.preventDefault();
    const scenarioId = event.dataTransfer.getData("text/plain");
    if (scenarioId) {
      assign(scenarioId, type);
    }
  }

  return (
    <article className="sort-calc movement-sort">
      <div className="playground-intro">
        <p className="eyebrow">Exercise 2</p>
        <h2>Tropic or Nastic?</h2>
        <p>
          Sort each plant movement into the right bin, then take the recap quiz. Remember:
          a tropic movement's direction is linked to the stimulus; a nastic one always
          happens the same way.
        </p>
      </div>

      {/* Part A: sort */}
      <section className="sort-panel" aria-labelledby="sortmv-title">
        <div className="sort-header">
          <h3 id="sortmv-title">Part A · Sort the movements</h3>
          <p className="solved-count" aria-live="polite">
            Sorted {sortedCount}/{totalScenarios}
          </p>
        </div>
        <p className="sort-help">
          {selected
            ? `Selected: ${plantScenarios.find((s) => s.id === selected)?.label}. Now choose a bin.`
            : "Drag a card into a bin, tap a card then a bin, or use its buttons. Correct cards lock in place."}
        </p>

        <ul className="sort-tray" aria-label="Plant movements to sort">
          {unplaced.map((scenario) => (
            <li
              key={scenario.id}
              className={`sort-card ${selected === scenario.id ? "is-selected" : ""}`}
              draggable
              onDragStart={(event) => event.dataTransfer.setData("text/plain", scenario.id)}
            >
              <button
                type="button"
                className="sort-card-face"
                aria-pressed={selected === scenario.id}
                onClick={() =>
                  setSelected((current) => (current === scenario.id ? null : scenario.id))
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
                    aria-label={`${scenario.label}: ${plantMoveInfo[bin].title}`}
                    title={plantMoveInfo[bin].title}
                  >
                    {plantMoveInfo[bin].emoji}
                  </button>
                ))}
              </span>
            </li>
          ))}
          {unplaced.length === 0 && (
            <li className="sort-complete">🎉 Every movement sorted correctly!</li>
          )}
        </ul>

        <div className="sort-bins movement-bins">
          {bins.map((bin) => {
            const placed = plantScenarios.filter((scenario) => placements[scenario.id] === bin);
            return (
              <div
                key={bin}
                className={`sort-bin bin-${bin}`}
                onDragOver={(event) => event.preventDefault()}
                onDrop={(event) => handleDrop(event, bin)}
                onClick={() => selected && assign(selected, bin)}
              >
                <h4>
                  {plantMoveInfo[bin].emoji} {plantMoveInfo[bin].title}
                  <span>{plantMoveInfo[bin].hint}</span>
                </h4>
                <ul aria-label={plantMoveInfo[bin].title}>
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
            className={sortFeedback.isCorrect ? "feedback-panel is-correct" : "feedback-panel"}
            role="status"
            aria-live="polite"
          >
            <strong>{sortFeedback.isCorrect ? "Correct" : "Try again"}</strong>
            <p>{sortFeedback.message}</p>
          </div>
        )}
      </section>

      {/* Part B: quiz */}
      <section className="lesson-block" aria-labelledby="quizmv-title">
        <div className="sort-header">
          <h3 id="quizmv-title">Part B · Quick recap quiz</h3>
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
