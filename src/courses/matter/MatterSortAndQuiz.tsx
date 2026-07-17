import { useEffect, useMemo, useState, type DragEvent } from "react";
import {
  matterClassInfo,
  substanceCards,
  type MatterClass
} from "../../data/matterSubstances";
import { isCorrectClass, totalSubstances } from "../../utils/matter";
import type { SectionViewProps } from "../section";

interface SortFeedback {
  cardId: string;
  isCorrect: boolean;
  message: string;
}

const bins: MatterClass[] = ["element", "compound", "mixture"];

interface QuizQuestion {
  prompt: string;
  options: string[];
  answer: number;
}

// Recap MCQs, drawn from the chapter's own end-of-unit exercise.
const quiz: QuizQuestion[] = [
  {
    prompt:
      "The numbers of protons, neutrons and electrons in a ³⁵₁₇Cl atom respectively are…",
    options: ["17, 18, 18", "17, 18, 17", "17, 17, 18", "17, 17, 17"],
    answer: 1
  },
  {
    prompt: "Which statement about the atom is FALSE?",
    options: [
      "Atoms are the building units of matter.",
      "A large portion of an atom is empty space.",
      "There is a positively charged nucleus at the centre of an atom.",
      "An atom cannot be divided any further."
    ],
    answer: 3
  },
  {
    prompt: "A unique property of a particular atom is…",
    options: [
      "its atomic number",
      "the number of neutrons in the nucleus",
      "its mass number",
      "the sum of the neutrons and protons"
    ],
    answer: 0
  },
  {
    prompt: "Which group contains matter belonging to the same set?",
    options: [
      "Sodium, carbon, oxygen",
      "Oxygen, water, air",
      "Water, carbon, sodium",
      "Air, carbon, oxygen"
    ],
    answer: 0
  },
  {
    prompt: "Which statement about the element nitrogen is FALSE?",
    options: [
      "Nitrogen is a pure substance.",
      "Nitrogen molecules are the building units of nitrogen.",
      "A nitrogen molecule is formed from a large number of nitrogen atoms.",
      "Nitrogen is a constituent of air."
    ],
    answer: 2
  },
  {
    prompt: "Of the following substances, a pure substance is…",
    options: ["Air", "Salt solution", "Vinegar", "Copper sulphate"],
    answer: 3
  }
];

export function MatterSortAndQuiz({ onProgress }: SectionViewProps) {
  const [placements, setPlacements] = useState<Record<string, MatterClass>>({});
  const [sortFeedback, setSortFeedback] = useState<SortFeedback | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});

  const sortedCount = Object.keys(placements).length;
  const allSorted = sortedCount === totalSubstances;

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
      total: totalSubstances,
      streak: quizScore,
      completed: allSorted
    });
  }, [sortedCount, allSorted, quizScore, onProgress]);

  const unplaced = useMemo(
    () => substanceCards.filter((card) => !placements[card.id]),
    [placements]
  );

  function assign(cardId: string, choice: MatterClass) {
    if (placements[cardId]) {
      return;
    }
    const card = substanceCards.find((candidate) => candidate.id === cardId);
    if (!card) {
      return;
    }

    if (isCorrectClass(cardId, choice)) {
      setPlacements((current) => ({ ...current, [cardId]: choice }));
      setSortFeedback({ cardId, isCorrect: true, message: card.reason });
      setSelected(null);
    } else {
      setSortFeedback({
        cardId,
        isCorrect: false,
        message: `${card.label} doesn't go in the ${matterClassInfo[choice].title} bin. Hint: it is ${matterClassInfo[card.answer].hint}.`
      });
    }
  }

  function handleDrop(event: DragEvent<HTMLDivElement>, choice: MatterClass) {
    event.preventDefault();
    const cardId = event.dataTransfer.getData("text/plain");
    if (cardId) {
      assign(cardId, choice);
    }
  }

  return (
    <article className="sort-calc matter-sort">
      <div className="playground-intro">
        <p className="eyebrow">Exercise 2</p>
        <h2>Element, Compound or Mixture?</h2>
        <p>
          Sort every substance into the right bin, then take the recap quiz. Watch out —
          some are trickier than they look.
        </p>
      </div>

      {/* -------- Part A: sort -------- */}
      <section className="sort-panel" aria-labelledby="sortm-title">
        <div className="sort-header">
          <h3 id="sortm-title">Part A · Sort the matter</h3>
          <p className="solved-count" aria-live="polite">
            Sorted {sortedCount}/{totalSubstances}
          </p>
        </div>
        <p className="sort-help">
          {selected
            ? `Selected: ${substanceCards.find((card) => card.id === selected)?.label}. Now choose a bin.`
            : "Drag a card into a bin, tap a card then a bin, or use its buttons. Correct cards lock in place."}
        </p>

        <ul className="sort-tray" aria-label="Substances to sort">
          {unplaced.map((card) => (
            <li
              key={card.id}
              className={`sort-card ${selected === card.id ? "is-selected" : ""}`}
              draggable
              onDragStart={(event) => event.dataTransfer.setData("text/plain", card.id)}
            >
              <button
                type="button"
                className="sort-card-face"
                aria-pressed={selected === card.id}
                onClick={() =>
                  setSelected((current) => (current === card.id ? null : card.id))
                }
              >
                <span aria-hidden="true">{card.emoji}</span> {card.label}
              </button>
              <span className="sort-card-actions">
                {bins.map((bin) => (
                  <button
                    key={bin}
                    type="button"
                    onClick={() => assign(card.id, bin)}
                    aria-label={`Put ${card.label} in ${matterClassInfo[bin].title}`}
                  >
                    {matterClassInfo[bin].emoji}
                  </button>
                ))}
              </span>
            </li>
          ))}
          {unplaced.length === 0 && (
            <li className="sort-complete">🎉 Everything sorted correctly!</li>
          )}
        </ul>

        <div className="sort-bins matter-bins">
          {bins.map((bin) => {
            const placed = substanceCards.filter((card) => placements[card.id] === bin);
            return (
              <div
                key={bin}
                className={`sort-bin bin-${bin}`}
                onDragOver={(event) => event.preventDefault()}
                onDrop={(event) => handleDrop(event, bin)}
                onClick={() => selected && assign(selected, bin)}
              >
                <h4>
                  {matterClassInfo[bin].emoji} {matterClassInfo[bin].title}
                  <span>{matterClassInfo[bin].hint}</span>
                </h4>
                <ul aria-label={matterClassInfo[bin].title}>
                  {placed.map((card) => (
                    <li key={card.id}>
                      <strong>
                        <span aria-hidden="true">{card.emoji}</span> {card.label} ✅
                      </strong>
                      <span>{card.reason}</span>
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

      {/* -------- Part B: quiz -------- */}
      <section className="lesson-block" aria-labelledby="quizm-title">
        <div className="sort-header">
          <h3 id="quizm-title">Part B · Quick recap quiz</h3>
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
