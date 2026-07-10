import { useEffect, useMemo, useState } from "react";
import {
  correctionLensFor,
  type CorrectionLens,
  type VisionDefect
} from "../../utils/visionDefects";
import type { SectionViewProps } from "../section";

const targetCases = 6;

interface VisionCase {
  symptom: string;
  diagnosis: VisionDefect;
  note: string; // shown after the case is solved
}

// Patient cases. Refractive ones (short/long sight) also need the right lens prescribed.
const casePool: VisionCase[] = [
  {
    symptom:
      "I can read my book clearly, but the whiteboard across the room looks blurry.",
    diagnosis: "myopia",
    note: "Short sight: distant objects focus in front of the retina. A concave lens fixes it."
  },
  {
    symptom:
      "Far-away hills look sharp, but I can't focus on the small print right in front of me.",
    diagnosis: "hypermetropia",
    note: "Long sight: near objects focus behind the retina. A convex lens fixes it."
  },
  {
    symptom:
      "Everything looks cloudy and milky, like looking through fog, and it is slowly getting worse with age.",
    diagnosis: "cataract",
    note: "Cataract: the lens has turned cloudy. It is treated with surgery, not a lens."
  },
  {
    symptom:
      "My side vision is slowly shrinking and the doctor says the pressure inside my eye is high.",
    diagnosis: "glaucoma",
    note: "Glaucoma: high pressure damages the optic nerve. Early treatment slows it; damage is irreversible."
  },
  {
    symptom:
      "Near things are fuzzy, so I hold the newspaper at arm's length to read it.",
    diagnosis: "hypermetropia",
    note: "Long sight again — a convex lens brings the near image back onto the retina."
  },
  {
    symptom:
      "Street signs far away are hard to read, so I keep squinting; close-up work is fine.",
    diagnosis: "myopia",
    note: "Short sight again — a concave lens spreads the rays so they focus on the retina."
  },
  {
    symptom: "Both near and far look clear and comfortable — no trouble at all.",
    diagnosis: "normal",
    note: "Healthy eyes: the lens accommodates so every distance focuses on the retina."
  }
];

const diagnosisOptions: { value: VisionDefect; label: string }[] = [
  { value: "myopia", label: "Short sight" },
  { value: "hypermetropia", label: "Long sight" },
  { value: "cataract", label: "Cataract" },
  { value: "glaucoma", label: "Glaucoma" },
  { value: "normal", label: "Healthy" }
];

const lensOptions: { value: CorrectionLens; label: string }[] = [
  { value: "concave", label: "Concave lens" },
  { value: "convex", label: "Convex lens" }
];

interface QuizQuestion {
  prompt: string;
  options: string[];
  answer: number;
}

// Recap MCQs from the chapter's exercise (eye, ear, and safe hearing).
const quiz: QuizQuestion[] = [
  {
    prompt: "The part where the image is focused in the human eye is the…",
    options: ["Vitreous humour", "Eye lens", "Iris", "Retina"],
    answer: 3
  },
  {
    prompt: "Close objects are clear but distant objects are blurred. This defect is…",
    options: ["Long sight", "Glaucoma", "Short sight", "Cataract"],
    answer: 2
  },
  {
    prompt: "Long sight (hypermetropia) is corrected using a…",
    options: ["Concave lens", "Convex lens", "Cylindrical lens", "No lens"],
    answer: 1
  },
  {
    prompt: "The organ in the ear that maintains the balance of the body is the…",
    options: ["Cochlea", "External auditory canal", "Ossicles", "Semicircular canals"],
    answer: 3
  },
  {
    prompt: "The three ossicles of the middle ear are the…",
    options: [
      "Malleus, incus, and stapes",
      "Cochlea, pinna, and stapes",
      "Malleus, cochlea, and incus",
      "Pinna, incus, and stapes"
    ],
    answer: 0
  },
  {
    prompt: "The range of audibility of the human ear is…",
    options: ["2 Hz – 20,000 Hz", "20 Hz – 20,000 Hz", "20 Hz – 200,000 Hz", "200 Hz – 20,000 Hz"],
    answer: 1
  }
];

function shuffle<T>(values: T[]): T[] {
  const copy = [...values];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

type Phase = "diagnose" | "prescribe" | "solved";

interface Feedback {
  isCorrect: boolean;
  message: string;
}

export function SenseClinic({ onProgress }: SectionViewProps) {
  const shuffledCases = useMemo(() => shuffle(casePool), []);
  const [caseIndex, setCaseIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>("diagnose");
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [casesPassed, setCasesPassed] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});

  const currentCase = shuffledCases[caseIndex % shuffledCases.length];
  const isRefractive =
    currentCase.diagnosis === "myopia" || currentCase.diagnosis === "hypermetropia";

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

  function solveCase() {
    setPhase("solved");
    setCasesPassed((count) => count + 1);
    setFeedback({ isCorrect: true, message: currentCase.note });
  }

  function chooseDiagnosis(value: VisionDefect) {
    if (phase === "solved") {
      return;
    }
    if (value !== currentCase.diagnosis) {
      const label = diagnosisOptions.find((o) => o.value === value)?.label ?? value;
      setFeedback({
        isCorrect: false,
        message: `Not quite — the symptoms don't fit ${label.toLowerCase()}. Read the clue again and retry.`
      });
      return;
    }

    if (value === "myopia" || value === "hypermetropia") {
      setPhase("prescribe");
      setFeedback({
        isCorrect: true,
        message: "Correct diagnosis! Now prescribe the right lens."
      });
    } else {
      solveCase();
    }
  }

  function chooseLens(lens: CorrectionLens) {
    if (phase !== "prescribe") {
      return;
    }
    if (lens === correctionLensFor(currentCase.diagnosis)) {
      solveCase();
    } else {
      setFeedback({
        isCorrect: false,
        message:
          currentCase.diagnosis === "myopia"
            ? "Short sight needs a concave lens to spread the rays. Try again."
            : "Long sight needs a convex lens to converge the rays sooner. Try again."
      });
    }
  }

  function nextPatient() {
    setCaseIndex((index) => index + 1);
    setPhase("diagnose");
    setFeedback(null);
  }

  const finished = casesPassed >= targetCases;

  return (
    <article className="lesson">
      <header className="lesson-hero sensory-system">
        <p className="eyebrow">Exercise 2</p>
        <h2>The Sense Clinic</h2>
        <p>
          A patient walks in and describes their problem. Diagnose the condition and, if
          it needs glasses, prescribe the right lens.
        </p>
      </header>

      <section className="lesson-block" aria-labelledby="clinic-title">
        <div className="sort-header">
          <h3 id="clinic-title">Patient {caseIndex + 1}</h3>
          <p className="solved-count" aria-live="polite">
            Cases solved {casesPassed}/{targetCases}
          </p>
        </div>

        <div className={`patient-card ${phase === "solved" ? "is-safe" : ""}`}>
          <div className="patient-avatar" aria-hidden="true">
            🧑
          </div>
          <p className="patient-need">The patient says:</p>
          <p className="clinic-symptom">“{currentCase.symptom}”</p>
        </div>

        {phase !== "solved" && (
          <>
            <p className="sort-help">
              {phase === "diagnose"
                ? "What is the diagnosis?"
                : `Prescribe the lens for ${
                    currentCase.diagnosis === "myopia" ? "short sight" : "long sight"
                  }:`}
            </p>
            <div className="part-buttons">
              {phase === "diagnose"
                ? diagnosisOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => chooseDiagnosis(option.value)}
                    >
                      {option.label}
                    </button>
                  ))
                : lensOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => chooseLens(option.value)}
                    >
                      {option.label}
                    </button>
                  ))}
            </div>
          </>
        )}

        {feedback && (
          <div
            className={feedback.isCorrect ? "feedback-panel is-correct" : "feedback-panel"}
            role="status"
            aria-live="polite"
          >
            <strong>{feedback.isCorrect ? "✅ Nice work" : "Try again"}</strong>
            <p>{feedback.message}</p>
          </div>
        )}

        <div className="lab-actions">
          {phase === "solved" && !finished && (
            <button type="button" className="drill-check" onClick={nextPatient}>
              Next patient →
            </button>
          )}
          {finished && (
            <p className="sort-complete">
              🎉 {targetCases} patients treated! You can read the symptoms and prescribe
              the right fix.
            </p>
          )}
        </div>

        <p className="lesson-key">
          Short sight → concave lens · long sight → convex lens · cataract → surgery ·
          glaucoma → early treatment (damage is irreversible).
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
