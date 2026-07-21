import { useMemo, useState } from "react";
import { BlockView } from "../content/BlockRenderer";
import {
  blockCatalog,
  plannedBlocks,
  type BlockCategory,
  type BlockDomain,
  type BlockCatalogEntry
} from "../content/catalog";

const categoryOrder: BlockCategory[] = ["presentational", "interactive", "assessment"];

const categoryLabel: Record<BlockCategory, string> = {
  presentational: "Presentational",
  interactive: "Interactive",
  assessment: "Assessment"
};

const categoryBlurb: Record<BlockCategory, string> = {
  presentational: "Show content. No interaction, nothing scored.",
  interactive: "Explore by clicking — engaging, but not graded.",
  assessment: "Scored activities that report progress and completion."
};

const domainOrder: BlockDomain[] = ["general", "science", "math", "language"];

const domainLabel: Record<BlockDomain, string> = {
  general: "General",
  science: "Science",
  math: "Mathematics",
  language: "Language"
};

// The Block Gallery: a live reference of every block type — what it does, when to use it,
// and a working sample. Reuses the real BlockRenderer, so each preview behaves exactly as
// it would inside a lesson. Doubles as the palette for teachers and the AI author.
export function BlockGallery() {
  const [domain, setDomain] = useState<BlockDomain | "all">("all");

  const visible = useMemo(
    () =>
      domain === "all"
        ? blockCatalog
        : blockCatalog.filter((entry) => entry.domains.includes(domain)),
    [domain]
  );

  return (
    <section className="gallery" aria-labelledby="gallery-title">
      <header className="gallery-hero">
        <p className="eyebrow">Admin · Teacher reference</p>
        <h1 id="gallery-title">Block Gallery</h1>
        <p>
          The building blocks a lesson is made of. Each block is a reusable component —
          content lives in data, the interaction lives in the block. This is the menu a
          teacher (or the AI author) picks from when turning a chapter into a lesson.
        </p>
        <div className="gallery-stats">
          <span>
            <strong>{blockCatalog.length}</strong> live blocks
          </span>
          <span>
            <strong>{blockCatalog.filter((entry) => entry.scored).length}</strong> scored
          </span>
          <span>
            <strong>{plannedBlocks.length}</strong> planned
          </span>
        </div>
      </header>

      <div className="gallery-filter" role="group" aria-label="Filter blocks by subject">
        <button
          type="button"
          className={domain === "all" ? "is-active" : ""}
          aria-pressed={domain === "all"}
          onClick={() => setDomain("all")}
        >
          All subjects
        </button>
        {domainOrder.map((option) => (
          <button
            key={option}
            type="button"
            className={domain === option ? "is-active" : ""}
            aria-pressed={domain === option}
            onClick={() => setDomain(option)}
          >
            {domainLabel[option]}
          </button>
        ))}
      </div>

      {categoryOrder.map((category) => {
        const entries = visible.filter((entry) => entry.category === category);
        if (entries.length === 0) {
          return null;
        }
        return (
          <section key={category} className="gallery-group" aria-label={categoryLabel[category]}>
            <div className="gallery-group-head">
              <h2>{categoryLabel[category]}</h2>
              <p>{categoryBlurb[category]}</p>
            </div>
            <div className="gallery-grid">
              {entries.map((entry) => (
                <BlockCard key={entry.type} entry={entry} />
              ))}
            </div>
          </section>
        );
      })}

      <section className="gallery-group" aria-label="Planned blocks">
        <div className="gallery-group-head">
          <h2>Planned blocks</h2>
          <p>
            The subject-specific roadmap. Each becomes a real block by adding its component,
            schema type and catalog entry.
          </p>
        </div>
        <div className="planned-columns">
          {domainOrder.map((option) => {
            const items = plannedBlocks.filter((block) => block.domain === option);
            if (items.length === 0) {
              return null;
            }
            return (
              <div key={option} className="planned-column">
                <h3>{domainLabel[option]}</h3>
                <ul>
                  {items.map((block) => (
                    <li key={block.name}>
                      <strong>{block.name}</strong>
                      <span>{block.description}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </section>
    </section>
  );
}

function BlockCard({ entry }: { entry: BlockCatalogEntry }) {
  return (
    <article className="block-card">
      <div className="block-card-head">
        <div>
          <h3>{entry.name}</h3>
          <code>{entry.type}</code>
        </div>
        <div className="block-card-tags">
          {entry.scored && <span className="tag tag-scored">Scored</span>}
          {entry.domains.map((domain) => (
            <span key={domain} className="tag">
              {domainLabel[domain]}
            </span>
          ))}
        </div>
      </div>

      <p className="block-card-desc">{entry.description}</p>
      <p className="block-card-when">
        <strong>When:</strong> {entry.whenToUse}
      </p>

      <div className="block-card-preview" aria-label={`${entry.name} preview`}>
        <span className="preview-label">Live preview</span>
        <div className="lesson">
          <section className={entry.previewClass ?? "lesson-block"}>
            <BlockView block={entry.sample} blockId={`gallery-${entry.type}`} />
          </section>
        </div>
      </div>
    </article>
  );
}
