import type { Theme } from "../types";
import type { SectionProgressUpdate } from "../utils/progress";
import { BlockView } from "./BlockRenderer";
import { ProgressProvider, useSectionProgress } from "./progress";
import { richText } from "./richText";
import type { ContentSection, SectionHero } from "./schema";

// Renders one section (lesson / exercise / recap) from data: a hero, then the groups,
// each group a <section> wrapping its blocks. A single progress aggregator is provided to
// every block via context, so the section reports one combined update to App — the same
// contract the old bespoke components used.
export function SchemaSection({
  section,
  theme,
  onProgress
}: {
  section: ContentSection;
  theme: Theme;
  onProgress: (update: SectionProgressUpdate) => void;
}) {
  const report = useSectionProgress(onProgress);

  return (
    <ProgressProvider value={report}>
      <article className={section.wrapperClass ?? "lesson"}>
        <SectionHeader hero={section.hero} theme={theme} />
        {section.groups.map((group, groupIndex) => (
          <section
            key={groupIndex}
            className={group.className ?? "lesson-block"}
            aria-labelledby={group.id}
          >
            {group.heading && <h3 id={group.id}>{group.heading}</h3>}
            {group.blocks.map((block, blockIndex) => (
              <BlockView
                key={blockIndex}
                block={block}
                blockId={`${groupIndex}-${blockIndex}`}
              />
            ))}
          </section>
        ))}
      </article>
    </ProgressProvider>
  );
}

function SectionHeader({ hero, theme }: { hero: SectionHero; theme: Theme }) {
  const variant = hero.variant ?? "lesson";

  if (variant === "intro") {
    return (
      <div className="playground-intro">
        <p className="eyebrow">{hero.eyebrow}</p>
        <h2>{hero.title}</h2>
        {hero.intro && <p>{richText(hero.intro)}</p>}
      </div>
    );
  }

  const headerClass =
    variant === "lesson" ? `lesson-hero ${theme} evo-hero` : `lesson-hero ${theme}`;

  return (
    <header className={headerClass}>
      {variant === "lesson" && hero.decoration && hero.decoration.length > 0 && (
        <div className="evo-swirl" aria-hidden="true">
          {hero.decoration.map((emoji, index) => (
            <span key={index} className={`es es${index + 1}`}>
              {emoji}
            </span>
          ))}
        </div>
      )}
      <p className="eyebrow">{hero.eyebrow}</p>
      <h2>{hero.title}</h2>
      {hero.intro && <p>{richText(hero.intro)}</p>}
    </header>
  );
}
