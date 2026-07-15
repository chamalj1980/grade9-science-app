import {
  convertQuestion,
  questionIssues,
  questionTypeLabels,
  type TestQuestion,
  type TestQuestionType
} from "../data/testModel";
import type { LearningModule } from "../types";

interface QuestionEditorProps {
  question: TestQuestion;
  index: number;
  modules: LearningModule[];
  onChange: (question: TestQuestion) => void;
  onRemove: () => void;
  onMove: (direction: -1 | 1) => void;
}

const TYPES: TestQuestionType[] = ["mcq", "truefalse", "short", "essay"];

// One editable question in the Teacher Studio review step. The parser's best guess lands
// here; the teacher fixes the type, the answer key and the tags before publishing.
export function QuestionEditor({
  question,
  index,
  modules,
  onChange,
  onRemove,
  onMove
}: QuestionEditorProps) {
  const issues = questionIssues(question);

  function patch(changes: Partial<TestQuestion>) {
    onChange({ ...question, ...changes } as TestQuestion);
  }

  return (
    <article className={`qe-card ${issues.length > 0 ? "has-issues" : ""}`}>
      <header className="qe-head">
        <span className="qe-num">Q{index + 1}</span>

        <select
          className="qe-type"
          value={question.type}
          aria-label={`Question ${index + 1} type`}
          onChange={(event) =>
            onChange(convertQuestion(question, event.target.value as TestQuestionType))
          }
        >
          {TYPES.map((type) => (
            <option key={type} value={type}>
              {questionTypeLabels[type]}
            </option>
          ))}
        </select>

        <div className="qe-head-actions">
          <button type="button" onClick={() => onMove(-1)} aria-label="Move up">
            ↑
          </button>
          <button type="button" onClick={() => onMove(1)} aria-label="Move down">
            ↓
          </button>
          <button type="button" className="qe-remove" onClick={onRemove}>
            Remove
          </button>
        </div>
      </header>

      <label className="qe-field">
        <span>Question</span>
        <textarea
          rows={2}
          value={question.prompt}
          onChange={(event) => patch({ prompt: event.target.value })}
          placeholder="Type the question…"
        />
      </label>

      <div className="qe-row">
        <label className="qe-field qe-small">
          <span>Marks</span>
          <input
            type="number"
            min={1}
            value={question.marks}
            onChange={(event) => patch({ marks: Number(event.target.value) || 1 })}
          />
        </label>

        <label className="qe-field qe-small">
          <span>Chapter</span>
          <select
            value={question.moduleId ?? ""}
            onChange={(event) => patch({ moduleId: event.target.value || undefined })}
          >
            <option value="">— none —</option>
            {modules.map((module) => (
              <option key={module.id} value={module.id}>
                {module.title}
              </option>
            ))}
          </select>
        </label>

        <label className="qe-field qe-small">
          <span>Difficulty</span>
          <select
            value={question.difficulty ?? "medium"}
            onChange={(event) =>
              patch({ difficulty: event.target.value as TestQuestion["difficulty"] })
            }
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </label>
      </div>

      {/* ---- type-specific fields ---- */}
      {question.type === "mcq" && (
        <fieldset className="qe-options">
          <legend>Options — choose the correct one</legend>
          {question.options.map((option, optionIndex) => (
            <div key={optionIndex} className="qe-option">
              <input
                type="radio"
                name={`answer-${question.id}`}
                checked={question.answer === optionIndex}
                onChange={() => patch({ answer: optionIndex })}
                aria-label={`Option ${optionIndex + 1} is correct`}
              />
              <input
                type="text"
                value={option}
                placeholder={`Option ${optionIndex + 1}`}
                onChange={(event) => {
                  const options = [...question.options];
                  options[optionIndex] = event.target.value;
                  patch({ options });
                }}
              />
              <button
                type="button"
                className="qe-opt-remove"
                aria-label={`Remove option ${optionIndex + 1}`}
                disabled={question.options.length <= 2}
                onClick={() => {
                  const options = question.options.filter((_, i) => i !== optionIndex);
                  const answer =
                    question.answer >= options.length ? 0 : question.answer;
                  patch({ options, answer });
                }}
              >
                ✕
              </button>
            </div>
          ))}
          <button
            type="button"
            className="qe-add-opt"
            onClick={() => patch({ options: [...question.options, ""] })}
          >
            + Add option
          </button>
        </fieldset>
      )}

      {question.type === "truefalse" && (
        <fieldset className="qe-options">
          <legend>Correct answer</legend>
          <div className="qe-tf">
            {[true, false].map((value) => (
              <label key={String(value)}>
                <input
                  type="radio"
                  name={`tf-${question.id}`}
                  checked={question.answer === value}
                  onChange={() => patch({ answer: value })}
                />
                {value ? "True" : "False"}
              </label>
            ))}
          </div>
        </fieldset>
      )}

      {question.type === "short" && (
        <label className="qe-field">
          <span>Accepted answers (one per line)</span>
          <textarea
            rows={2}
            value={question.accepted.join("\n")}
            placeholder={"plasma\nblood plasma"}
            onChange={(event) =>
              patch({
                accepted: event.target.value
                  .split("\n")
                  .map((item) => item.trim())
                  .filter(Boolean)
              })
            }
          />
        </label>
      )}

      {question.type === "essay" && (
        <>
          <label className="qe-field">
            <span>Model answer</span>
            <textarea
              rows={3}
              value={question.modelAnswer}
              placeholder="The answer a full-mark response should contain…"
              onChange={(event) => patch({ modelAnswer: event.target.value })}
            />
          </label>
          <label className="qe-field">
            <span>Mark-scheme points (one per line)</span>
            <textarea
              rows={2}
              value={(question.points ?? []).join("\n")}
              placeholder={"States that pressure = force ÷ area\nExplains the larger area"}
              onChange={(event) =>
                patch({
                  points: event.target.value
                    .split("\n")
                    .map((item) => item.trim())
                    .filter(Boolean)
                })
              }
            />
          </label>
        </>
      )}

      {(question.type === "mcq" ||
        question.type === "truefalse" ||
        question.type === "short") && (
        <label className="qe-field">
          <span>Explanation (shown after answering)</span>
          <textarea
            rows={2}
            value={question.explanation ?? ""}
            placeholder="Why that answer is right…"
            onChange={(event) => patch({ explanation: event.target.value })}
          />
        </label>
      )}

      {issues.length > 0 && (
        <ul className="qe-issues">
          {issues.map((issue) => (
            <li key={issue}>⚠️ {issue}</li>
          ))}
        </ul>
      )}
    </article>
  );
}
