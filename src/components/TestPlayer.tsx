import { useEffect, useMemo, useState } from "react";
import {
  gradeAnswer,
  totalMarks,
  type TestPack,
  type TestQuestion
} from "../data/testModel";

interface TestPlayerProps {
  pack: TestPack;
  onExit: () => void;
}

type View = "answer" | "selfmark" | "report";

const OPTION_KEYS = ["A", "B", "C", "D", "E", "F"];

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

// Runs a whole test pack exam-style: answer every question, submit, then self-mark any
// essays against the model answer, ending in a report card. Objective questions are
// marked automatically.
export function TestPlayer({ pack, onExit }: TestPlayerProps) {
  const [view, setView] = useState<View>("answer");
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, unknown>>({});
  const [selfMarks, setSelfMarks] = useState<Record<string, number>>({});
  const [elapsed, setElapsed] = useState(0);

  const questions = pack.questions;
  const question = questions[index];
  const paperMarks = useMemo(() => totalMarks(questions), [questions]);
  const essays = useMemo(
    () => questions.filter((item) => item.type === "essay"),
    [questions]
  );

  // Count-up clock, paused once the report is showing.
  useEffect(() => {
    if (view === "report") {
      return;
    }
    const timer = window.setInterval(() => setElapsed((value) => value + 1), 1000);
    return () => window.clearInterval(timer);
  }, [view]);

  const answeredCount = questions.filter(
    (item) => answers[item.id] !== undefined && answers[item.id] !== ""
  ).length;

  function setAnswer(value: unknown) {
    setAnswers((current) => ({ ...current, [question.id]: value }));
  }

  function submit() {
    setView(essays.length > 0 ? "selfmark" : "report");
  }

  // Auto marks + self-awarded essay marks.
  const earned = useMemo(() => {
    return questions.reduce((sum, item) => {
      if (item.type === "essay") {
        return sum + (selfMarks[item.id] ?? 0);
      }
      return sum + gradeAnswer(item, answers[item.id]).earned;
    }, 0);
  }, [questions, answers, selfMarks]);

  // ---------------- report ----------------
  if (view === "report") {
    const percent = paperMarks > 0 ? Math.round((earned / paperMarks) * 100) : 0;
    return (
      <div className="tp-report">
        <div className="tp-report-card">
          <p className="eyebrow">{pack.title}</p>
          <h2>Report card</h2>
          <div className="tp-bigscore">
            {earned}
            <span>/ {paperMarks}</span>
          </div>
          <p className="tp-percent">{percent}% · finished in {formatTime(elapsed)}</p>

          <ol className="tp-review">
            {questions.map((item, itemIndex) => {
              const given = answers[item.id];
              const grade = gradeAnswer(item, given);
              const isEssay = item.type === "essay";
              const awarded = isEssay ? (selfMarks[item.id] ?? 0) : grade.earned;
              const status = isEssay
                ? `${awarded}/${item.marks} self-marked`
                : grade.correct
                  ? "Correct"
                  : "Incorrect";

              return (
                <li key={item.id} className={isEssay ? "self" : grade.correct ? "ok" : "no"}>
                  <div className="tp-review-head">
                    <strong>Q{itemIndex + 1}</strong>
                    <span className="tp-status">{status}</span>
                  </div>
                  <p className="tp-review-prompt">{item.prompt}</p>
                  <p className="tp-review-ans">
                    <span>Your answer:</span>{" "}
                    {formatGiven(item, given) || <em>blank</em>}
                  </p>
                  {!isEssay && !grade.correct && (
                    <p className="tp-review-correct">
                      <span>Correct:</span> {correctText(item)}
                    </p>
                  )}
                  {"explanation" in item && item.explanation && (
                    <p className="tp-review-why">{item.explanation}</p>
                  )}
                </li>
              );
            })}
          </ol>

          <button type="button" className="ts-primary" onClick={onExit}>
            Back to tests
          </button>
        </div>
      </div>
    );
  }

  // ---------------- essay self-marking ----------------
  if (view === "selfmark") {
    return (
      <div className="tp-report">
        <div className="tp-report-card">
          <p className="eyebrow">{pack.title}</p>
          <h2>Mark your own answers</h2>
          <p className="tp-selfmark-lede">
            The computer can't mark written answers. Compare what you wrote with the model
            answer and award yourself the marks you earned — be honest, it's your revision!
          </p>

          <ol className="tp-selfmark-list">
            {essays.map((item) => (
              <li key={item.id}>
                <p className="tp-review-prompt">{item.prompt}</p>
                <p className="tp-review-ans">
                  <span>You wrote:</span>{" "}
                  {String(answers[item.id] ?? "") || <em>blank</em>}
                </p>
                <div className="tp-model">
                  <strong>Model answer</strong>
                  <p>{item.type === "essay" ? item.modelAnswer : ""}</p>
                  {item.type === "essay" && item.points && item.points.length > 0 && (
                    <ul>
                      {item.points.map((point) => (
                        <li key={point}>{point}</li>
                      ))}
                    </ul>
                  )}
                </div>
                <div className="tp-award">
                  <span>Award yourself:</span>
                  {Array.from({ length: item.marks + 1 }).map((_, mark) => (
                    <button
                      key={mark}
                      type="button"
                      className={selfMarks[item.id] === mark ? "is-active" : ""}
                      onClick={() =>
                        setSelfMarks((current) => ({ ...current, [item.id]: mark }))
                      }
                    >
                      {mark}
                    </button>
                  ))}
                  <span className="tp-award-of">of {item.marks}</span>
                </div>
              </li>
            ))}
          </ol>

          <button type="button" className="ts-primary" onClick={() => setView("report")}>
            See my report card →
          </button>
        </div>
      </div>
    );
  }

  // ---------------- answering ----------------
  return (
    <div className="qa-stage">
      <div className="qa-board">
        <aside className="qa-side">
          <button type="button" className="qa-quit" onClick={onExit}>
            ← Quit
          </button>
          <div className="qa-side-head">
            <div>
              <p className="qa-side-mode">📝 Term test</p>
              <h3>{pack.title}</h3>
            </div>
          </div>

          <div className="qa-scorebox">
            <span className="qa-scorenum">{formatTime(elapsed)}</span>
            <span className="qa-scorelabel">elapsed</span>
          </div>

          <div className="qa-side-track">
            <div className="qa-side-trackhead">
              <span>Progress</span>
              <span className="qa-timer-num">
                {index + 1}/{questions.length}
              </span>
            </div>
            <div className="qa-progress" aria-hidden="true">
              <span style={{ width: `${((index + 1) / questions.length) * 100}%` }} />
            </div>
            <p className="qa-count">
              {answeredCount} of {questions.length} answered · {paperMarks} marks
            </p>
          </div>

          <button type="button" className="ts-primary tp-submit" onClick={submit}>
            Finish &amp; mark
          </button>
        </aside>

        <main className="qa-play">
          <div className="tp-qmeta">
            <span className="tp-qtype">{typeLabel(question)}</span>
            <span className="tp-qmarks">
              {question.marks} {question.marks === 1 ? "mark" : "marks"}
            </span>
          </div>

          <p className="qa-question">{question.prompt}</p>

          {question.type === "mcq" && (
            <div className="qa-options">
              {question.options.map((option, optionIndex) => (
                <button
                  key={option + optionIndex}
                  type="button"
                  className={`qa-opt ${answers[question.id] === optionIndex ? "chosen" : ""}`}
                  onClick={() => setAnswer(optionIndex)}
                >
                  <span className="qa-key">{OPTION_KEYS[optionIndex]}</span>
                  <span>{option}</span>
                </button>
              ))}
            </div>
          )}

          {question.type === "truefalse" && (
            <div className="qa-options">
              {[true, false].map((value) => (
                <button
                  key={String(value)}
                  type="button"
                  className={`qa-opt ${answers[question.id] === value ? "chosen" : ""}`}
                  onClick={() => setAnswer(value)}
                >
                  <span className="qa-key">{value ? "T" : "F"}</span>
                  <span>{value ? "True" : "False"}</span>
                </button>
              ))}
            </div>
          )}

          {question.type === "short" && (
            <input
              className="tp-input"
              type="text"
              value={String(answers[question.id] ?? "")}
              placeholder="Type your answer…"
              onChange={(event) => setAnswer(event.target.value)}
            />
          )}

          {question.type === "essay" && (
            <textarea
              className="tp-textarea"
              rows={6}
              value={String(answers[question.id] ?? "")}
              placeholder="Write your answer…"
              onChange={(event) => setAnswer(event.target.value)}
            />
          )}

          <div className="tp-nav">
            <button
              type="button"
              className="ts-secondary"
              disabled={index === 0}
              onClick={() => setIndex((value) => value - 1)}
            >
              ← Back
            </button>
            {index + 1 < questions.length ? (
              <button
                type="button"
                className="qa-next"
                onClick={() => setIndex((value) => value + 1)}
              >
                Next →
              </button>
            ) : (
              <button type="button" className="qa-next" onClick={submit}>
                Finish &amp; mark →
              </button>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

function typeLabel(question: TestQuestion): string {
  switch (question.type) {
    case "mcq":
      return "Multiple choice";
    case "truefalse":
      return "True or false";
    case "short":
      return "Short answer";
    default:
      return "Written answer";
  }
}

function formatGiven(question: TestQuestion, given: unknown): string {
  if (given === undefined || given === "") {
    return "";
  }
  if (question.type === "mcq" && typeof given === "number") {
    return question.options[given] ?? "";
  }
  if (question.type === "truefalse") {
    return given ? "True" : "False";
  }
  return String(given);
}

function correctText(question: TestQuestion): string {
  switch (question.type) {
    case "mcq":
      return question.options[question.answer] ?? "";
    case "truefalse":
      return question.answer ? "True" : "False";
    case "short":
      return question.accepted.join(" / ");
    default:
      return "";
  }
}
