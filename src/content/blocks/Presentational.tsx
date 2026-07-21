import { richText } from "../richText";
import type {
  CalloutBlock,
  CardGridBlock,
  ProseBlock,
  SequenceStripBlock,
  TermListBlock
} from "../schema";

// Plain paragraphs. The enclosing group supplies the h3 heading.
export function Prose({ block }: { block: ProseBlock }) {
  return (
    <>
      {block.body.map((paragraph, index) => (
        <p key={index}>{richText(paragraph)}</p>
      ))}
    </>
  );
}

export function Callout({ block }: { block: CalloutBlock }) {
  const variant = block.variant ?? "key";

  if (variant === "feature") {
    return (
      <div className="darwin-card">
        {block.emoji && (
          <span className="dc-emoji" aria-hidden="true">
            {block.emoji}
          </span>
        )}
        <div>{richText(block.body)}</div>
      </div>
    );
  }

  const className = variant === "help" ? "sort-help" : "lesson-key";
  return <p className={className}>{richText(block.body)}</p>;
}

// Each variant maps to the existing card CSS so the rendered DOM is pixel-identical.
export function CardGrid({ block }: { block: CardGridBlock }) {
  return (
    <>
      {block.heading && <h4 className="living-title">{block.heading}</h4>}
      {block.intro && <p>{richText(block.intro)}</p>}
      {renderCards(block)}
    </>
  );
}

function renderCards(block: CardGridBlock) {
  switch (block.variant) {
    case "badges":
      return (
        <div className="theory-pair">
          {block.cards.map((card) => (
            <div key={card.title} className="theory-card">
              <h4>
                {card.emoji && <span aria-hidden="true">{card.emoji}</span>} {card.title}
                {card.badge && (
                  <span className={`theory-tag ${card.badgeTone ?? ""}`.trim()}>
                    {card.badge}
                  </span>
                )}
              </h4>
              <p>{richText(card.body)}</p>
            </div>
          ))}
        </div>
      );
    case "facts":
      return (
        <div className="evo-facts">
          {block.cards.map((card) => (
            <div key={card.title} className="evo-fact">
              <span className="ef-emoji" aria-hidden="true">
                {card.emoji}
              </span>
              <div>
                <strong>{card.title}</strong>
                <span>{richText(card.body)}</span>
              </div>
            </div>
          ))}
        </div>
      );
    case "icons":
      return (
        <div className="evidence-grid">
          {block.cards.map((card) => (
            <div key={card.title} className="evidence-card">
              <span className="ev-emoji" aria-hidden="true">
                {card.emoji}
              </span>
              <strong>{card.title}</strong>
              <span>{richText(card.body)}</span>
            </div>
          ))}
        </div>
      );
    case "living":
      return (
        <div className="living-grid">
          {block.cards.map((card) => (
            <div key={card.title} className="living-card">
              <span className="lf-emoji" aria-hidden="true">
                {card.emoji}
              </span>
              <strong>{card.title}</strong>
              <span>{richText(card.body)}</span>
            </div>
          ))}
        </div>
      );
    case "plain":
    default:
      return (
        <div className="scientist-strip">
          {block.cards.map((card) => (
            <div key={card.title} className="scientist-card">
              <strong>{card.title}</strong>
              <span>{richText(card.body)}</span>
            </div>
          ))}
        </div>
      );
  }
}

export function SequenceStrip({ block }: { block: SequenceStripBlock }) {
  return (
    <>
      {block.intro && <p>{richText(block.intro)}</p>}
      <ol className="march-strip" aria-label="A sequence, earliest first">
        {block.items.map((item, index) => (
          <li key={item.id} style={{ animationDelay: `${index * 0.12}s` }}>
            <span className="ms-emoji" aria-hidden="true">
              {item.emoji}
            </span>
            <span className="ms-label">{item.label}</span>
          </li>
        ))}
      </ol>
      {block.note && <p className="sort-help">{richText(block.note)}</p>}
    </>
  );
}

export function TermList({ block }: { block: TermListBlock }) {
  return (
    <dl className="term-list">
      {block.terms.map((item) => (
        <div key={item.term} className="term-row">
          <dt>{item.term}</dt>
          <dd>{item.meaning}</dd>
        </div>
      ))}
    </dl>
  );
}
