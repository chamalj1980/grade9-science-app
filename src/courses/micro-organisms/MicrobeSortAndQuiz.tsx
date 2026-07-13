import { useEffect, useMemo, useState, type DragEvent } from "react";
import {
  microbeSortCards,
  type MicrobeEffect
} from "../../data/microbeSortCards";
import { isCorrectEffect, totalSortCards } from "../../utils/microbes";
import type { SectionViewProps } from "../section";

interface SortFeedback {
  cardId: string;
  isCorrect: boolean;
  message: string;
}

const bins: { id: MicrobeEffect; title: string; hint: string; arrow: string }[] = [
  { id: "beneficial", title: "Beneficial", hint: "helps us", arrow: "✅" },
  { id: "harmful", title: "Harmful", hint: "causes harm", arrow: "⚠️" }
];

interface QuizQuestion {
  prompt: string;
  options: string[];
  answer: number;
}

// Recap MCQs, drawn from the chapter's own exercise and key facts.
const quiz: QuizQuestion[] = [
  {
    prompt: "A group of autotrophic micro-organisms (they make their own food) is…",
    options: ["Viruses", "Fungi", "Algae", "Protozoa"],
    answer: 2
  },
  {
    prompt:
      "Toxic chemicals produced in a microbe's body to destroy another microbe are called…",
    options: ["Antibodies", "Anti-nutrients", "Antiseptics", "Antibiotics"],
    answer: 3
  },
  {
    prompt: "A disease caused by bacteria is…",
    options: ["Malaria", "Tuberculosis", "Rabies", "Ebola"],
    answer: 1
  },
  {
    prompt: "The technology that removes pollutants from the environment using microbes is…",
    options: ["Bio-control", "Bio-degradation", "Bio-remediation", "Bio-leaching"],
    answer: 2
  },
  {
    prompt: "Which bacterium fixes atmospheric nitrogen in the root nodules of legumes?",
    options: ["Azotobacter", "Rhizobium", "Lactobacillus", "Pseudomonas"],
    answer: 1
  },
  {
    prompt: "Antibiotics can fight bacteria and fungi, but they do NOT work against…",
    options: ["Viruses", "Bacteria", "Fungi", "All microbes"],
    answer: 0
  }
];

export function MicrobeSortAndQuiz({ onProgress }: SectionViewProps) {
  // ---- Part A: Sort beneficial vs harmful ----
  const [placements, setPlacements] = useState<Record<string, MicrobeEffect>>({});
  const [sortFeedback, setSortFeedback] = useState<SortFeedback | null>(null);

  const sortedCount = Object.keys(placements).length;
  const allSorted = sortedCount === totalSortCards;

  // ---- Part B: Recap quiz ----
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});

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
      total: totalSortCards,
      streak: quizScore,
      completed: allSorted
    });
  }, [sortedCount, allSorted, quizScore, onProgress]);

  const unplacedCards = useMemo(
    () => microbeSortCards.filter((card) => !placements[card.id]),
    [placements]
  );

  // Live tally for the balance meter.
  const beneficialCount = Object.values(placements).filter((e) => e === "beneficial").length;
  const harmfulCount = Object.values(placements).filter((e) => e === "harmful").length;
  const tallyTotal = beneficialCount + harmfulCount;
  const beneficialPct = tallyTotal ? (beneficialCount / tallyTotal) * 100 : 50;

  function assign(cardId: string, effect: MicrobeEffect) {
    if (placements[cardId]) {
      return;
    }

    const card = microbeSortCards.find((candidate) => candidate.id === cardId);
    if (!card) {
      return;
    }

    if (isCorrectEffect(cardId, effect)) {
      setPlacements((current) => ({ ...current, [cardId]: effect }));
      setSortFeedback({
        cardId,
        isCorrect: true,
        message: `${card.label}: ${card.reason}`
      });
    } else {
      setSortFeedback({
        cardId,
        isCorrect: false,
        message: `Not quite. ${card.label} — ${card.reason} Try the other bin.`
      });
    }
  }

  function handleDrop(event: DragEvent<HTMLDivElement>, effect: MicrobeEffect) {
    event.preventDefault();
    const cardId = event.dataTransfer.getData("text/plain");
    assign(cardId, effect);
  }

  return (
    <article className="sort-calc microbe-sort">
      <div className="playground-intro">
        <p className="eyebrow">Exercise 2</p>
        <h2>Useful or Harmful?</h2>
        <p>
          First sort each scene by whether the microbe helps us or harms us. Then take the
          quick recap quiz.
        </p>
      </div>

      {/* -------- Part A: Sort -------- */}
      <section className="sort-panel" aria-labelledby="sort-title">
        <div className="sort-header">
          <h3 id="sort-title">Part A · Beneficial or harmful?</h3>
          <p className="solved-count" aria-live="polite">
            Sorted {sortedCount}/{totalSortCards}
          </p>
        </div>
        <p className="sort-help">
          Drag a card into a bin, or use its buttons. Correct cards lock in place.
        </p>

        {/* Live balance meter */}
        <div className="tally" aria-hidden="true">
          <span className="tally-end good">✅ {beneficialCount}</span>
          <div className="tally-bar">
            <span className="tally-good" style={{ width: `${beneficialPct}%` }} />
          </div>
          <span className="tally-end bad">{harmfulCount} ⚠️</span>
        </div>

        <ul className="sort-tray" aria-label="Scenes to sort">
          {unplacedCards.map((card) => (
            <li
              key={card.id}
              className="sort-card"
              draggable
              onDragStart={(event) => event.dataTransfer.setData("text/plain", card.id)}
            >
              <span className="sort-card-face">
                <span aria-hidden="true">{card.emoji}</span> {card.label}
              </span>
              <span className="sort-card-actions">
                {bins.map((bin) => (
                  <button
                    key={bin.id}
                    type="button"
                    onClick={() => assign(card.id, bin.id)}
                    aria-label={`Put ${card.label} in ${bin.title}`}
                  >
                    {bin.arrow} {bin.title}
                  </button>
                ))}
              </span>
            </li>
          ))}
          {unplacedCards.length === 0 && (
            <li className="sort-complete">🎉 Every scene sorted correctly!</li>
          )}
        </ul>

        <div className="sort-bins">
          {bins.map((bin) => {
            const placed = microbeSortCards.filter(
              (card) => placements[card.id] === bin.id
            );

            return (
              <div
                key={bin.id}
                className={`sort-bin ${bin.id === "beneficial" ? "decrease" : "increase"}`}
                onDragOver={(event) => event.preventDefault()}
                onDrop={(event) => handleDrop(event, bin.id)}
              >
                <h4>
                  {bin.arrow} {bin.title}
                  <span>{bin.hint}</span>
                </h4>
                <ul aria-label={bin.title}>
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

      {/* -------- Part B: Recap quiz -------- */}
      <section className="lesson-block" aria-labelledby="quiz-title">
        <div className="sort-header">
          <h3 id="quiz-title">Part B · Quick recap quiz</h3>
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
