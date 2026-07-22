import { getIllustration } from "../illustrations";
import { richText } from "../richText";
import { isSvgMarkup, sanitizeSvg } from "../sanitizeSvg";
import type { FigureBlock } from "../schema";

// Renders an SVG figure with an optional caption. `art` (a registry illustration) takes
// precedence; otherwise inline `svg` markup is sanitized and rendered. A figure with
// neither a valid art id nor svg markup renders nothing (a missing asset shouldn't crash
// a lesson).
export function Figure({ block }: { block: FigureBlock }) {
  const Illustration = block.art ? getIllustration(block.art) : undefined;
  const hasInline = isSvgMarkup(block.svg);

  if (!Illustration && !hasInline) {
    return null;
  }

  return (
    <>
      {block.heading && <h4 className="figure-heading">{block.heading}</h4>}
      <figure className={`figure-block figure-${block.size ?? "medium"}`}>
        <div className="figure-frame">
          {Illustration ? (
            <Illustration />
          ) : (
            <div
              className="figure-inline"
              role="img"
              aria-label={block.alt}
              // Sanitized above; markup is authored/reviewed content, not raw user input.
              dangerouslySetInnerHTML={{ __html: sanitizeSvg(block.svg!) }}
            />
          )}
        </div>
        {block.caption && <figcaption>{richText(block.caption)}</figcaption>}
      </figure>
    </>
  );
}
