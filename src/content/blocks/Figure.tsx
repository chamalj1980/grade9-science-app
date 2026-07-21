import { getIllustration } from "../illustrations";
import { richText } from "../richText";
import type { FigureBlock } from "../schema";

// Renders a named SVG illustration with an optional caption. Unknown ids render nothing
// (a missing asset shouldn't crash a lesson).
export function Figure({ block }: { block: FigureBlock }) {
  const Illustration = getIllustration(block.art);
  if (!Illustration) {
    return null;
  }
  return (
    <>
      {block.heading && <h4 className="figure-heading">{block.heading}</h4>}
      <figure className={`figure-block figure-${block.size ?? "medium"}`}>
        <div className="figure-frame">
          <Illustration />
        </div>
        {block.caption && <figcaption>{richText(block.caption)}</figcaption>}
      </figure>
    </>
  );
}
