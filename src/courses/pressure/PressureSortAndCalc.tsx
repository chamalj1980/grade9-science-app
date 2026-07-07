import {
  useEffect,
  useMemo,
  useState,
  type DragEvent
} from "react";
import {
  pressureSortCards,
  type PressureCategory,
  type PressureSortCard
} from "../../data/pressureSortCards";
import {
  cuboidParts,
  generateDrillProblem,
  isDrillAnswerCorrect,
  type DrillProblem
} from "../../utils/pressureCalcDrill";
import type { SectionViewProps } from "../section";

interface CategoryFeedback {
  cardId: string;
  isCorrect: boolean;
  message: string;
}

const bins: { id: PressureCategory; title: string; hint: string }[] = [
  { id: "increase", title: "Increases pressure", hint: "small area / big force" },
  { id: "decrease", title: "Decreases pressure", hint: "big area / small force" }
];

export function PressureSortAndCalc({ onProgress }: SectionViewProps) {
  // ---- Part A: Sort the Scene ----
  const [placements, setPlacements] = useState<Record<string, PressureCategory>>({});
  const [sortFeedback, setSortFeedback] = useState<CategoryFeedback | null>(null);

  const correctlyPlaced = Object.keys(placements).length;
  const allSorted = correctlyPlaced === pressureSortCards.length;

  // ---- Part B: Calculation drill ----
  const [problem, setProblem] = useState<DrillProblem>(() => generateDrillProblem());
  const [answer, setAnswer] = useState("");
  const [drillState, setDrillState] = useState<"idle" | "correct" | "wrong">("idle");
  const [showSteps, setShowSteps] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);

  // Report combined progress: cards sorted (primary) plus best calculation streak.
  useEffect(() => {
    onProgress({
      score: correctlyPlaced,
      total: pressureSortCards.length,
      streak: bestStreak,
      completed: allSorted
    });
  }, [correctlyPlaced, allSorted, bestStreak, onProgress]);

  const unplacedCards = useMemo(
    () => pressureSortCards.filter((card) => !placements[card.id]),
    [placements]
  );

  function assign(card: PressureSortCard, category: PressureCategory) {
    if (placements[card.id]) {
      return;
    }

    if (card.category === category) {
      setPlacements((current) => ({ ...current, [card.id]: category }));
      setSortFeedback({
        cardId: card.id,
        isCorrect: true,
        message: `${card.label}: ${card.reason}`
      });
    } else {
      setSortFeedback({
        cardId: card.id,
        isCorrect: false,
        message: `Not quite. ${card.label.toLowerCase()} — ${card.reason} Try the other bin.`
      });
    }
  }

  function handleDrop(event: DragEvent<HTMLDivElement>, category: PressureCategory) {
    event.preventDefault();
    const cardId = event.dataTransfer.getData("text/plain");
    const card = pressureSortCards.find((candidate) => candidate.id === cardId);

    if (card) {
      assign(card, category);
    }
  }

  function checkAnswer() {
    const numeric = Number(answer);

    if (answer.trim() === "" || Number.isNaN(numeric)) {
      setDrillState("wrong");
      return;
    }

    if (isDrillAnswerCorrect(problem, numeric)) {
      setDrillState("correct");
      setShowSteps(true);
      setScore((current) => current + 1);
      setStreak((current) => {
        const next = current + 1;
        setBestStreak((best) => Math.max(best, next));
        return next;
      });
    } else {
      setDrillState("wrong");
      setStreak(0);
    }
  }

  function nextProblem() {
    setProblem(generateDrillProblem());
    setAnswer("");
    setDrillState("idle");
    setShowSteps(false);
  }

  return (
    <article className="sort-calc">
      <div className="playground-intro">
        <p className="eyebrow">Exercise 2</p>
        <h2>Increase or Decrease?</h2>
        <p>
          First sort each object by the pressure it makes. Then solve some
          P = F / A problems to build a streak.
        </p>
      </div>

      {/* -------- Part A: Sort the Scene -------- */}
      <section className="sort-panel" aria-labelledby="sort-title">
        <div className="sort-header">
          <h3 id="sort-title">Part A · Sort the scene</h3>
          <p className="solved-count" aria-live="polite">
            Sorted {correctlyPlaced}/{pressureSortCards.length}
          </p>
        </div>
        <p className="sort-help">
          Drag a card into a bin, or use its buttons. Correct cards lock in place.
        </p>

        <ul className="sort-tray" aria-label="Objects to sort">
          {unplacedCards.map((card) => (
            <li
              key={card.id}
              className="sort-card"
              draggable
              onDragStart={(event) =>
                event.dataTransfer.setData("text/plain", card.id)
              }
            >
              <span className="sort-card-face">
                <span aria-hidden="true">{card.emoji}</span> {card.label}
              </span>
              <span className="sort-card-actions">
                {bins.map((bin) => (
                  <button
                    key={bin.id}
                    type="button"
                    onClick={() => assign(card, bin.id)}
                    aria-label={`Put ${card.label} in ${bin.title}`}
                  >
                    {bin.id === "increase" ? "⬆ Increases" : "⬇ Decreases"}
                  </button>
                ))}
              </span>
            </li>
          ))}
          {unplacedCards.length === 0 && (
            <li className="sort-complete">🎉 Every card sorted correctly!</li>
          )}
        </ul>

        <div className="sort-bins">
          {bins.map((bin) => {
            const placed = pressureSortCards.filter(
              (card) => placements[card.id] === bin.id
            );

            return (
              <div
                key={bin.id}
                className={`sort-bin ${bin.id}`}
                onDragOver={(event) => event.preventDefault()}
                onDrop={(event) => handleDrop(event, bin.id)}
              >
                <h4>
                  {bin.id === "increase" ? "⬆" : "⬇"} {bin.title}
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
              sortFeedback.isCorrect
                ? "feedback-panel is-correct"
                : "feedback-panel"
            }
            role="status"
            aria-live="polite"
          >
            <strong>{sortFeedback.isCorrect ? "Correct" : "Try again"}</strong>
            <p>{sortFeedback.message}</p>
          </div>
        )}
      </section>

      {/* -------- Part B: Calculation drill -------- */}
      <section className="drill-panel" aria-labelledby="drill-title">
        <div className="sort-header">
          <h3 id="drill-title">Part B · Calculation drill</h3>
          <p className="solved-count" aria-live="polite">
            Score {score} · 🔥 Streak {streak}
          </p>
        </div>

        <div className="drill-problem">
          <p className="drill-prompt">{problem.prompt}</p>
          <p className="drill-formula">Formula: {problem.formula}</p>

          <div className="drill-answer">
            <label htmlFor="drill-input">
              Your answer
              <span className="drill-unit">{problem.unit}</span>
            </label>
            <input
              id="drill-input"
              type="number"
              inputMode="decimal"
              value={answer}
              onChange={(event) => setAnswer(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  checkAnswer();
                }
              }}
            />
            <div className="drill-buttons">
              <button type="button" className="drill-check" onClick={checkAnswer}>
                Check
              </button>
              <button
                type="button"
                className="drill-hint"
                onClick={() => setShowSteps(true)}
              >
                Show steps
              </button>
              <button type="button" className="drill-next" onClick={nextProblem}>
                New problem
              </button>
            </div>
          </div>

          {drillState !== "idle" && (
            <div
              className={
                drillState === "correct"
                  ? "feedback-panel is-correct"
                  : "feedback-panel"
              }
              role="status"
              aria-live="polite"
            >
              <strong>{drillState === "correct" ? "Correct!" : "Try again"}</strong>
              <p>
                {drillState === "correct"
                  ? "Nice work. Keep the streak going!"
                  : "Check your arithmetic, or press Show steps for help."}
              </p>
            </div>
          )}

          {showSteps && (
            <ol className="drill-steps" aria-label="Worked solution">
              {problem.steps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          )}
        </div>

        {/* Fixed textbook cuboid problem */}
        <div className="cuboid">
          <h4>📦 Textbook challenge: the cuboid</h4>
          <p>
            A cuboid is 2 m × 1 m × 1 m and weighs 400 N. Work out the pressure in
            each case:
          </p>
          <ol className="cuboid-parts">
            {cuboidParts.map((part, index) => (
              <li key={part.id}>
                <strong>
                  {String.fromCharCode(97 + index)}) {part.question}
                </strong>
                <details>
                  <summary>Show working</summary>
                  <ol>
                    {part.steps.map((step) => (
                      <li key={step}>{step}</li>
                    ))}
                  </ol>
                  <p className="cuboid-answer">Answer: {part.pressurePa} Pa</p>
                </details>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </article>
  );
}
