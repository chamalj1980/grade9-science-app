import { useEffect, useMemo, useState, type DragEvent } from "react";
import { evoStatements } from "../../data/evolutionData";
import {
  isCorrectTruth,
  totalStatements,
  type TruthValue
} from "../../utils/evolution";
import type { SectionViewProps } from "../section";

interface SortFeedback {
  isCorrect: boolean;
  message: string;
}

const bins: { id: TruthValue; title: string; emoji: string; hint: string }[] = [
  { id: "true", title: "True", emoji: "✅", hint: "a correct fact" },
  { id: "false", title: "False", emoji: "❌", hint: "a myth or error" }
];

interface QuizQuestion {
  prompt: string;
  options: string[];
  answer: number;
}

// Recap MCQs drawn from the chapter's own end-of-unit exercise.
const quiz: QuizQuestion[] = [
  {
    prompt: "About how long ago did the Earth form?",
    options: ["4.5 billion years", "3.5 million years", "5 000 years", "54 million years"],
    answer: 0
  },
  {
    prompt: "Which gas was ABSENT from the early Earth's atmosphere?",
    options: ["Carbon dioxide", "Methane", "Oxygen", "Hydrogen sulphide"],
    answer: 2
  },
  {
    prompt: "The theory of the origin of life accepted today is…",
    options: [
      "Special creation",
      "Spontaneous generation",
      "The cosmozoic theory",
      "Bio-chemical evolution"
    ],
    answer: 3
  },
  {
    prompt: "Who disproved the spontaneous generation theory?",
    options: ["Charles Darwin", "Louis Pasteur", "Stanley Miller", "Oparin"],
    answer: 1
  },
  {
    prompt: "Which shows the correct order of evolution?",
    options: [
      "Fish → bacteria → amphibians → reptiles",
      "Bacteria → algae → fish → amphibians → reptiles",
      "Reptiles → fish → bacteria → birds",
      "Algae → fish → bacteria → mammals"
    ],
    answer: 1
  },
  {
    prompt: "A 'living fossil' is an organism that…",
    options: [
      "has changed rapidly over time",
      "is only known from fossils",
      "has survived almost unchanged for millions of years",
      "lived before the Earth cooled"
    ],
    answer: 2
  },
  {
    prompt: "Who is considered the father of evolution?",
    options: ["Charles Darwin", "Louis Pasteur", "John Dalton", "Ernest Rutherford"],
    answer: 0
  },
  {
    prompt: "In a stack of rock layers, the oldest fossils are found…",
    options: ["at the top", "at the bottom", "in the middle", "spread evenly"],
    answer: 1
  }
];

export function EvolutionSortAndQuiz({ onProgress }: SectionViewProps) {
  const [placements, setPlacements] = useState<Record<string, TruthValue>>({});
  const [sortFeedback, setSortFeedback] = useState<SortFeedback | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});

  const sortedCount = Object.keys(placements).length;
  const allSorted = sortedCount === totalStatements;

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
      total: totalStatements,
      streak: quizScore,
      completed: allSorted
    });
  }, [sortedCount, allSorted, quizScore, onProgress]);

  const unplaced = useMemo(
    () => evoStatements.filter((statement) => !placements[statement.id]),
    [placements]
  );

  function assign(statementId: string, choice: TruthValue) {
    if (placements[statementId]) {
      return;
    }
    const statement = evoStatements.find((item) => item.id === statementId);
    if (!statement) {
      return;
    }
    if (isCorrectTruth(statementId, choice)) {
      setPlacements((current) => ({ ...current, [statementId]: choice }));
      setSortFeedback({ isCorrect: true, message: statement.reason });
      setSelected(null);
    } else {
      setSortFeedback({
        isCorrect: false,
        message: `Look again — ${statement.reason}`
      });
    }
  }

  function handleDrop(event: DragEvent<HTMLDivElement>, choice: TruthValue) {
    event.preventDefault();
    const id = event.dataTransfer.getData("text/plain");
    if (id) {
      assign(id, choice);
    }
  }

  return (
    <article className="sort-calc evolution-sort">
      <div className="playground-intro">
        <p className="eyebrow">Exercise 2</p>
        <h2>Fact or Myth?</h2>
        <p>
          Decide whether each statement about evolution is true or false, then take the
          recap quiz.
        </p>
      </div>

      {/* Part A: true / false sort */}
      <section className="sort-panel" aria-labelledby="sortev-title">
        <div className="sort-header">
          <h3 id="sortev-title">Part A · True or false?</h3>
          <p className="solved-count" aria-live="polite">
            Sorted {sortedCount}/{totalStatements}
          </p>
        </div>
        <p className="sort-help">
          {selected
            ? "Now choose True or False."
            : "Drag a statement into a bin, tap a card then a bin, or use its buttons. Correct cards lock in place."}
        </p>

        <ul className="sort-tray" aria-label="Statements to judge">
          {unplaced.map((statement) => (
            <li
              key={statement.id}
              className={`sort-card ${selected === statement.id ? "is-selected" : ""}`}
              draggable
              onDragStart={(event) => event.dataTransfer.setData("text/plain", statement.id)}
            >
              <button
                type="button"
                className="sort-card-face"
                aria-pressed={selected === statement.id}
                onClick={() =>
                  setSelected((current) => (current === statement.id ? null : statement.id))
                }
              >
                {statement.text}
              </button>
              <span className="sort-card-actions">
                {bins.map((bin) => (
                  <button
                    key={bin.id}
                    type="button"
                    onClick={() => assign(statement.id, bin.id)}
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

        <div className="sort-bins evolution-bins">
          {bins.map((bin) => {
            const placed = evoStatements.filter(
              (statement) => placements[statement.id] === bin.id
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
                  <span>{bin.hint}</span>
                </h4>
                <ul aria-label={bin.title}>
                  {placed.map((statement) => (
                    <li key={statement.id}>
                      <strong>{statement.text} ✅</strong>
                      <span>{statement.reason}</span>
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
      <section className="lesson-block" aria-labelledby="quizev-title">
        <div className="sort-header">
          <h3 id="quizev-title">Part B · Quick recap quiz</h3>
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
