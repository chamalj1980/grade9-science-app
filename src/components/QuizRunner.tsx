import { useEffect, useRef, useState } from "react";
import type { QuizQuestion } from "../data/quizQuestions";
import {
  computePoints,
  shuffle,
  TIME_ATTACK_SECONDS,
  type QuizMode
} from "../utils/quiz";

export interface QuizRunResult {
  score: number;
  correct: number;
  total: number;
}

interface QuizRunnerProps {
  questions: QuizQuestion[]; // already shuffled by the caller
  mode: QuizMode;
  moduleTitle: string;
  accent: string; // CSS colour for this chapter's subject
  onComplete: (result: QuizRunResult) => void;
  onQuit: () => void;
}

const OPTION_KEYS = ["A", "B", "C", "D"];

export function QuizRunner({
  questions,
  mode,
  moduleTitle,
  accent,
  onComplete,
  onQuit
}: QuizRunnerProps) {
  const [deck, setDeck] = useState(questions);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(TIME_ATTACK_SECONDS);

  // Running totals live in refs so the timer's finish() reads fresh values.
  const scoreRef = useRef(0);
  const correctRef = useRef(0);
  const answeredCountRef = useRef(0);
  const doneRef = useRef(false);
  const questionStart = useRef(Date.now());
  const advanceTimer = useRef<number | null>(null);

  const question = deck[index];
  const isTimeAttack = mode === "time-attack";

  function finish() {
    if (doneRef.current) {
      return;
    }
    doneRef.current = true;
    if (advanceTimer.current) {
      window.clearTimeout(advanceTimer.current);
    }
    onComplete({
      score: scoreRef.current,
      correct: correctRef.current,
      total: isTimeAttack ? answeredCountRef.current : questions.length
    });
  }

  // Time Attack countdown. Recreated each second so it self-corrects; hits finish at 0.
  useEffect(() => {
    if (!isTimeAttack || doneRef.current) {
      return;
    }
    if (secondsLeft <= 0) {
      finish();
      return;
    }
    const timer = window.setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => window.clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [secondsLeft, isTimeAttack]);

  // Tidy any pending auto-advance on unmount.
  useEffect(() => {
    return () => {
      if (advanceTimer.current) {
        window.clearTimeout(advanceTimer.current);
      }
    };
  }, []);

  function advance() {
    setSelected(null);
    setAnswered(false);
    questionStart.current = Date.now();

    const nextIndex = index + 1;
    if (nextIndex >= deck.length) {
      if (isTimeAttack) {
        // Loop the pool so the player can keep scoring until the clock runs out.
        setDeck(shuffle(questions));
        setIndex(0);
      } else {
        finish();
      }
    } else {
      setIndex(nextIndex);
    }
  }

  function choose(optionIndex: number) {
    if (answered || doneRef.current) {
      return;
    }
    const correct = optionIndex === question.answer;
    const answerMs = Date.now() - questionStart.current;
    const nextStreak = correct ? streak + 1 : 0;
    const points = computePoints(correct, nextStreak, answerMs);

    setSelected(optionIndex);
    setAnswered(true);
    setStreak(nextStreak);
    answeredCountRef.current += 1;
    if (correct) {
      correctRef.current += 1;
    }
    scoreRef.current += points;
    setScore(scoreRef.current);

    // Time Attack keeps the pace up: flash feedback, then move on automatically.
    if (isTimeAttack) {
      advanceTimer.current = window.setTimeout(advance, correct ? 650 : 1100);
    }
  }

  const progressLabel = isTimeAttack
    ? `${answeredCountRef.current} answered`
    : `Question ${index + 1} of ${deck.length}`;
  const timePct = Math.max(0, (secondsLeft / TIME_ATTACK_SECONDS) * 100);

  return (
    <div className="qa-runner" style={{ ["--accent" as string]: accent }}>
      <div className="qa-run-top">
        <button type="button" className="qa-quit" onClick={onQuit}>
          ← Quit
        </button>
        <span className="qa-run-title">{moduleTitle}</span>
        <span className="qa-run-score" aria-live="polite">
          {score} pts
        </span>
      </div>

      {isTimeAttack ? (
        <div className="qa-timer" aria-label={`${secondsLeft} seconds left`}>
          <div className="qa-timer-bar">
            <span style={{ width: `${timePct}%` }} />
          </div>
          <span className="qa-timer-num">{secondsLeft}s</span>
        </div>
      ) : (
        <div className="qa-progress" aria-hidden="true">
          <span style={{ width: `${((index + 1) / deck.length) * 100}%` }} />
        </div>
      )}

      <div className="qa-metary">
        <span className="qa-count">{progressLabel}</span>
        {streak >= 2 && <span className="qa-streak">🔥 Streak {streak}</span>}
      </div>

      <p className="qa-question">{question.prompt}</p>

      <div className="qa-options">
        {question.options.map((option, optionIndex) => {
          const isAnswer = optionIndex === question.answer;
          const isChosen = optionIndex === selected;
          let cls = "qa-opt";
          if (answered) {
            if (isAnswer) {
              cls += " correct";
            } else if (isChosen) {
              cls += " wrong";
            }
          }
          return (
            <button
              key={option}
              type="button"
              className={cls}
              disabled={answered}
              onClick={() => choose(optionIndex)}
            >
              <span className="qa-key">{OPTION_KEYS[optionIndex]}</span>
              <span>{option}</span>
            </button>
          );
        })}
      </div>

      {answered && (
        <div
          className={`qa-feedback ${selected === question.answer ? "ok" : "no"}`}
          role="status"
          aria-live="polite"
        >
          <strong>
            {selected === question.answer ? "✅ Correct!" : "❌ Not quite."}
          </strong>{" "}
          {question.explanation}
        </div>
      )}

      {answered && !isTimeAttack && (
        <div className="qa-run-foot">
          <button type="button" className="qa-next" onClick={advance}>
            {index + 1 >= deck.length ? "See results →" : "Next question →"}
          </button>
        </div>
      )}
    </div>
  );
}
