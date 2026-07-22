import { illustrations } from "../../content/illustrations";
import type {
  Block,
  CalloutBlock,
  CardGridBlock,
  FigureBlock,
  McqBlock,
  ProseBlock
} from "../../content/schema";
import { uid } from "./starters";

// ---- small immutable helpers ----
function replaceAt<T>(arr: T[], index: number, value: T): T[] {
  return arr.map((item, i) => (i === index ? value : item));
}
function removeAt<T>(arr: T[], index: number): T[] {
  return arr.filter((_, i) => i !== index);
}

// ---- dispatcher: renders the form for a block's type ----
export function BlockForm({
  block,
  onChange
}: {
  block: Block;
  onChange: (block: Block) => void;
}) {
  switch (block.type) {
    case "prose":
      return <ProseForm block={block} onChange={onChange} />;
    case "callout":
      return <CalloutForm block={block} onChange={onChange} />;
    case "cardGrid":
      return <CardGridForm block={block} onChange={onChange} />;
    case "figure":
      return <FigureForm block={block} onChange={onChange} />;
    case "mcq":
      return <McqForm block={block} onChange={onChange} />;
    default:
      return (
        <p className="df-todo">
          No editor for <code>{block.type}</code> yet — coming soon.
        </p>
      );
  }
}

// ---- Prose ----
function ProseForm({
  block,
  onChange
}: {
  block: ProseBlock;
  onChange: (block: ProseBlock) => void;
}) {
  return (
    <div className="df-field">
      <span className="df-label">Paragraphs</span>
      {block.body.map((paragraph, index) => (
        <div key={index} className="df-row">
          <textarea
            className="df-textarea"
            rows={2}
            value={paragraph}
            onChange={(event) =>
              onChange({ ...block, body: replaceAt(block.body, index, event.target.value) })
            }
          />
          {block.body.length > 1 && (
            <button
              type="button"
              className="df-remove"
              aria-label="Remove paragraph"
              onClick={() => onChange({ ...block, body: removeAt(block.body, index) })}
            >
              ✕
            </button>
          )}
        </div>
      ))}
      <button
        type="button"
        className="df-add"
        onClick={() => onChange({ ...block, body: [...block.body, ""] })}
      >
        + paragraph
      </button>
    </div>
  );
}

// ---- Callout ----
function CalloutForm({
  block,
  onChange
}: {
  block: CalloutBlock;
  onChange: (block: CalloutBlock) => void;
}) {
  const variant = block.variant ?? "key";
  return (
    <>
      <label className="df-field">
        <span className="df-label">Style</span>
        <select
          className="df-select"
          value={variant}
          onChange={(event) =>
            onChange({ ...block, variant: event.target.value as CalloutBlock["variant"] })
          }
        >
          <option value="key">Key point</option>
          <option value="help">Helper tip</option>
          <option value="feature">Feature (emoji card)</option>
        </select>
      </label>
      {variant === "feature" && (
        <label className="df-field">
          <span className="df-label">Emoji</span>
          <input
            className="df-input"
            value={block.emoji ?? ""}
            onChange={(event) => onChange({ ...block, emoji: event.target.value })}
          />
        </label>
      )}
      <label className="df-field">
        <span className="df-label">Text</span>
        <textarea
          className="df-textarea"
          rows={2}
          value={block.body}
          onChange={(event) => onChange({ ...block, body: event.target.value })}
        />
      </label>
    </>
  );
}

// ---- Card grid ----
function CardGridForm({
  block,
  onChange
}: {
  block: CardGridBlock;
  onChange: (block: CardGridBlock) => void;
}) {
  function updateCard(index: number, patch: Partial<CardGridBlock["cards"][number]>) {
    onChange({
      ...block,
      cards: replaceAt(block.cards, index, { ...block.cards[index], ...patch })
    });
  }
  return (
    <>
      <label className="df-field">
        <span className="df-label">Layout</span>
        <select
          className="df-select"
          value={block.variant}
          onChange={(event) =>
            onChange({ ...block, variant: event.target.value as CardGridBlock["variant"] })
          }
        >
          <option value="badges">Badges (2 wide + tag)</option>
          <option value="facts">Facts (emoji rows)</option>
          <option value="icons">Icon cards</option>
          <option value="living">Icon cards (compact)</option>
          <option value="plain">Plain cards</option>
        </select>
      </label>
      <label className="df-field">
        <span className="df-label">Sub-heading (optional)</span>
        <input
          className="df-input"
          value={block.heading ?? ""}
          onChange={(event) => onChange({ ...block, heading: event.target.value || undefined })}
        />
      </label>
      <span className="df-label">Cards</span>
      <div className="df-cards">
        {block.cards.map((card, index) => (
          <div key={index} className="df-card">
            <div className="df-mini-row">
              <input
                className="df-input df-emoji"
                aria-label="Emoji"
                placeholder="⭐"
                value={card.emoji ?? ""}
                onChange={(event) => updateCard(index, { emoji: event.target.value })}
              />
              <input
                className="df-input"
                aria-label="Card title"
                placeholder="Title"
                value={card.title}
                onChange={(event) => updateCard(index, { title: event.target.value })}
              />
              {block.cards.length > 1 && (
                <button
                  type="button"
                  className="df-remove"
                  aria-label="Remove card"
                  onClick={() => onChange({ ...block, cards: removeAt(block.cards, index) })}
                >
                  ✕
                </button>
              )}
            </div>
            <textarea
              className="df-textarea"
              rows={2}
              aria-label="Card body"
              placeholder="Detail"
              value={card.body}
              onChange={(event) => updateCard(index, { body: event.target.value })}
            />
            {block.variant === "badges" && (
              <input
                className="df-input"
                aria-label="Badge"
                placeholder="Badge (optional)"
                value={card.badge ?? ""}
                onChange={(event) => updateCard(index, { badge: event.target.value || undefined })}
              />
            )}
          </div>
        ))}
      </div>
      <button
        type="button"
        className="df-add"
        onClick={() =>
          onChange({
            ...block,
            cards: [...block.cards, { emoji: "⭐", title: "Card title", body: "Card detail." }]
          })
        }
      >
        + card
      </button>
    </>
  );
}

// ---- Figure ----
const illustrationIds = Object.keys(illustrations);

function FigureForm({
  block,
  onChange
}: {
  block: FigureBlock;
  onChange: (block: FigureBlock) => void;
}) {
  const mode: "library" | "inline" = block.svg ? "inline" : "library";
  return (
    <>
      <label className="df-field">
        <span className="df-label">Source</span>
        <select
          className="df-select"
          value={mode}
          onChange={(event) =>
            event.target.value === "inline"
              ? onChange({ ...block, art: undefined, svg: block.svg ?? "<svg viewBox=\"0 0 100 60\"></svg>" })
              : onChange({ ...block, svg: undefined, art: block.art ?? illustrationIds[0] })
          }
        >
          <option value="library">Library illustration</option>
          <option value="inline">Inline SVG</option>
        </select>
      </label>
      {mode === "library" ? (
        <label className="df-field">
          <span className="df-label">Illustration</span>
          <select
            className="df-select"
            value={block.art ?? illustrationIds[0]}
            onChange={(event) => onChange({ ...block, art: event.target.value })}
          >
            {illustrationIds.map((id) => (
              <option key={id} value={id}>
                {id}
              </option>
            ))}
          </select>
        </label>
      ) : (
        <>
          <label className="df-field">
            <span className="df-label">SVG markup</span>
            <textarea
              className="df-textarea df-mono"
              rows={4}
              value={block.svg ?? ""}
              onChange={(event) => onChange({ ...block, svg: event.target.value })}
            />
          </label>
          <label className="df-field">
            <span className="df-label">Alt text</span>
            <input
              className="df-input"
              value={block.alt ?? ""}
              onChange={(event) => onChange({ ...block, alt: event.target.value })}
            />
          </label>
        </>
      )}
      <label className="df-field">
        <span className="df-label">Caption (optional)</span>
        <input
          className="df-input"
          value={block.caption ?? ""}
          onChange={(event) => onChange({ ...block, caption: event.target.value || undefined })}
        />
      </label>
      <label className="df-field">
        <span className="df-label">Size</span>
        <select
          className="df-select"
          value={block.size ?? "medium"}
          onChange={(event) =>
            onChange({ ...block, size: event.target.value as FigureBlock["size"] })
          }
        >
          <option value="small">Small</option>
          <option value="medium">Medium</option>
          <option value="large">Large</option>
        </select>
      </label>
    </>
  );
}

// ---- MCQ ----
function McqForm({
  block,
  onChange
}: {
  block: McqBlock;
  onChange: (block: McqBlock) => void;
}) {
  type Question = McqBlock["questions"][number];
  function updateQuestion(index: number, patch: Partial<Question>) {
    onChange({
      ...block,
      questions: replaceAt(block.questions, index, { ...block.questions[index], ...patch })
    });
  }
  return (
    <>
      <label className="df-field">
        <span className="df-label">Quiz title</span>
        <input
          className="df-input"
          value={block.title ?? ""}
          onChange={(event) => onChange({ ...block, title: event.target.value || undefined })}
        />
      </label>
      <div className="df-cards">
        {block.questions.map((question, qIndex) => (
          <div key={question.id} className="df-card">
            <div className="df-mini-row">
              <input
                className="df-input"
                aria-label="Question prompt"
                placeholder="Question?"
                value={question.prompt}
                onChange={(event) => updateQuestion(qIndex, { prompt: event.target.value })}
              />
              {block.questions.length > 1 && (
                <button
                  type="button"
                  className="df-remove"
                  aria-label="Remove question"
                  onClick={() =>
                    onChange({ ...block, questions: removeAt(block.questions, qIndex) })
                  }
                >
                  ✕
                </button>
              )}
            </div>
            <span className="df-sub">Options (select the correct one)</span>
            {question.options.map((option, oIndex) => (
              <div key={oIndex} className="df-option">
                <input
                  type="radio"
                  name={`answer-${question.id}`}
                  checked={question.answer === oIndex}
                  onChange={() => updateQuestion(qIndex, { answer: oIndex })}
                  aria-label={`Mark option ${oIndex + 1} correct`}
                />
                <input
                  className="df-input"
                  value={option}
                  onChange={(event) =>
                    updateQuestion(qIndex, {
                      options: replaceAt(question.options, oIndex, event.target.value)
                    })
                  }
                />
                {question.options.length > 2 && (
                  <button
                    type="button"
                    className="df-remove"
                    aria-label="Remove option"
                    onClick={() =>
                      updateQuestion(qIndex, {
                        options: removeAt(question.options, oIndex),
                        answer:
                          question.answer >= oIndex && question.answer > 0
                            ? question.answer - 1
                            : question.answer
                      })
                    }
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              className="df-add"
              onClick={() =>
                updateQuestion(qIndex, { options: [...question.options, "New option"] })
              }
            >
              + option
            </button>
          </div>
        ))}
      </div>
      <button
        type="button"
        className="df-add"
        onClick={() =>
          onChange({
            ...block,
            questions: [
              ...block.questions,
              { id: uid("q"), prompt: "Your question?", options: ["Option A", "Option B"], answer: 0 }
            ]
          })
        }
      >
        + question
      </button>
    </>
  );
}
