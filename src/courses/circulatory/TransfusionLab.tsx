import { useEffect, useMemo, useState, type DragEvent } from "react";
import {
  aboGroups,
  allBloodTypes,
  checkTransfusion,
  formatBloodType,
  rhFactors,
  type BloodType,
  type TransfusionResult
} from "../../utils/transfusion";
import type { SectionViewProps } from "../section";

const targetCases = 6;

function randomBloodType(): BloodType {
  return {
    abo: aboGroups[Math.floor(Math.random() * aboGroups.length)],
    rh: rhFactors[Math.floor(Math.random() * rhFactors.length)]
  };
}

// Multiple-choice recap drawn from the chapter's exercise questions (spec 22).
interface QuizQuestion {
  prompt: string;
  options: string[];
  answer: number;
}

const quiz: QuizQuestion[] = [
  {
    prompt: "Which blood groups can a group B person receive? (ignoring Rh)",
    options: ["Only B", "B and O", "A and B", "Everyone"],
    answer: 1
  },
  {
    prompt: "Who is the universal donor?",
    options: ["AB", "O", "A", "B"],
    answer: 1
  },
  {
    prompt: "Who is the universal recipient?",
    options: ["O", "A", "AB", "B"],
    answer: 2
  },
  {
    prompt: "Which cells help blood to clot?",
    options: ["Red blood cells", "White blood cells", "Platelets", "Plasma"],
    answer: 2
  },
  {
    prompt: "Which blood cells contain haemoglobin?",
    options: ["Red blood cells", "White blood cells", "Platelets", "None"],
    answer: 0
  }
];

const bagClass: Record<string, string> = {
  A: "bag-a",
  B: "bag-b",
  AB: "bag-ab",
  O: "bag-o"
};

export function TransfusionLab({ onProgress }: SectionViewProps) {
  const [recipient, setRecipient] = useState<BloodType>(() => randomBloodType());
  const [result, setResult] = useState<TransfusionResult | null>(null);
  const [lastDonor, setLastDonor] = useState<BloodType | null>(null);
  const [caseSolved, setCaseSolved] = useState(false);
  const [casesPassed, setCasesPassed] = useState(0);
  const [caseNumber, setCaseNumber] = useState(1);
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
      score: casesPassed,
      total: targetCases,
      streak: quizScore,
      completed: casesPassed >= targetCases
    });
  }, [casesPassed, quizScore, onProgress]);

  function transfuse(donor: BloodType) {
    if (caseSolved) {
      return;
    }

    const outcome = checkTransfusion(recipient, donor);
    setResult(outcome);
    setLastDonor(donor);

    if (outcome.compatible) {
      setCaseSolved(true);
      setCasesPassed((count) => count + 1);
    }
  }

  function nextPatient() {
    setRecipient(randomBloodType());
    setResult(null);
    setLastDonor(null);
    setCaseSolved(false);
    setCaseNumber((count) => count + 1);
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    const abo = event.dataTransfer.getData("abo");
    const rh = event.dataTransfer.getData("rh");
    const donor = allBloodTypes.find((type) => type.abo === abo && type.rh === rh);
    if (donor) {
      transfuse(donor);
    }
  }

  return (
    <article className="lesson">
      <header className="lesson-hero circulatory">
        <p className="eyebrow">Exercise 2</p>
        <h2>Transfusion Lab</h2>
        <p>
          Each patient needs blood. Give a donor bag that is safe for BOTH the ABO
          group and the Rhesus factor.
        </p>
      </header>

      <section className="lesson-block" aria-labelledby="lab-title">
        <div className="sort-header">
          <h3 id="lab-title">Patient case {caseNumber}</h3>
          <p className="solved-count" aria-live="polite">
            Safe transfusions {casesPassed}/{targetCases}
          </p>
        </div>

        <div className="transfusion-lab">
          <div
            className={[
              "patient-card",
              result ? (result.compatible ? "is-safe" : "is-agglutinated") : ""
            ].join(" ")}
            onDragOver={(event) => event.preventDefault()}
            onDrop={handleDrop}
          >
            <div className="patient-avatar" aria-hidden="true">
              🧑‍⚕️
            </div>
            <p className="patient-need">
              Needs <strong>{formatBloodType(recipient)}</strong>
            </p>
            <div className="cell-tray" aria-hidden="true">
              {Array.from({ length: 6 }).map((_, index) => (
                <span key={index} className="cell" />
              ))}
            </div>
            <p className="drop-hint">Drop a bag here, or use a bag's button.</p>
          </div>

          <div className="donor-shelf">
            <p className="sort-help">Donor bags:</p>
            <div className="bag-grid">
              {allBloodTypes.map((donor) => (
                <div
                  key={formatBloodType(donor)}
                  className={`donor-bag ${bagClass[donor.abo]}`}
                  draggable={!caseSolved}
                  onDragStart={(event) => {
                    event.dataTransfer.setData("abo", donor.abo);
                    event.dataTransfer.setData("rh", donor.rh);
                  }}
                >
                  <strong>{formatBloodType(donor)}</strong>
                  <button
                    type="button"
                    onClick={() => transfuse(donor)}
                    disabled={caseSolved}
                    aria-label={`Give ${formatBloodType(donor)} blood to the patient`}
                  >
                    Transfuse
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {result && lastDonor && (
          <div
            className={
              result.compatible ? "feedback-panel is-correct" : "feedback-panel"
            }
            role="status"
            aria-live="polite"
          >
            <strong>
              {result.compatible
                ? `✅ Safe transfusion (${formatBloodType(lastDonor)})`
                : `⚠️ Agglutination! (${formatBloodType(lastDonor)})`}
            </strong>
            <p>{result.reason}</p>
          </div>
        )}

        <div className="lab-actions">
          {caseSolved && casesPassed < targetCases && (
            <button type="button" className="drill-check" onClick={nextPatient}>
              Next patient →
            </button>
          )}
          {casesPassed >= targetCases && (
            <p className="sort-complete">
              🎉 {targetCases} safe transfusions! You've got the rules down.
            </p>
          )}
        </div>

        <p className="lesson-key">
          O⁻ is the universal donor · AB⁺ is the universal recipient · Rh⁻ patients
          receive Rh⁻ only · a mismatch causes agglutination (clumping).
        </p>
      </section>

      {/* Recap quiz */}
      <section className="lesson-block" aria-labelledby="quiz-title">
        <div className="sort-header">
          <h3 id="quiz-title">Quick recap quiz</h3>
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
