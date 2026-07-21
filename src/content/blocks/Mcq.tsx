import { useEffect, useMemo, useState } from "react";
import { useReportProgress } from "../progress";
import type { McqBlock } from "../schema";
import { mcqScore } from "./logic";

// An inline multiple-choice quiz. Once an option is chosen the question locks and the
// correct/wrong answers colour in. Score is reported as a streak (not required for the
// section to complete — it's a recap check, like the original exercise).
export function Mcq({ block, blockId }: { block: McqBlock; blockId: string }) {
  const report = useReportProgress();
  const [answers, setAnswers] = useState<Record<string, number>>({});

  const score = useMemo(() => mcqScore(block, answers), [block, answers]);

  useEffect(() => {
    report(blockId, { streak: score, required: false });
  }, [report, blockId, score]);

  return (
    <>
      <div className="sort-header">
        <h3>{block.title ?? "Quick recap quiz"}</h3>
        <p className="solved-count">
          Quiz {score}/{block.questions.length}
        </p>
      </div>
      <ol className="quiz-list">
        {block.questions.map((question) => {
          const chosen = answers[question.id];
          const answered = chosen !== undefined;

          return (
            <li key={question.id}>
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
                        setAnswers((current) => ({ ...current, [question.id]: oIndex }))
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
    </>
  );
}
