import { useState } from "react";
import { getIllustration } from "../illustrations";
import { richText } from "../richText";
import type { HotspotDiagramBlock } from "../schema";

// An illustration overlaid with clickable markers. Tapping a marker selects it and
// reveals its label + detail below — the spatial cousin of revealTabs. Exploratory
// (not scored). Marker positions are percentages of the illustration box.
export function HotspotDiagram({ block }: { block: HotspotDiagramBlock }) {
  const Illustration = getIllustration(block.art);
  const [activeId, setActiveId] = useState<string | null>(block.defaultId ?? null);
  const active = block.hotspots.find((spot) => spot.id === activeId);

  if (!Illustration) {
    return null;
  }

  return (
    <>
      {block.heading && <h4 className="figure-heading">{block.heading}</h4>}
      {block.intro && <p>{richText(block.intro)}</p>}
      <div className="hotspot-diagram">
        <div className="hotspot-stage">
          <Illustration />
          {block.hotspots.map((spot) => (
            <button
              key={spot.id}
              type="button"
              className={`hotspot-marker ${activeId === spot.id ? "is-active" : ""}`.trim()}
              style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
              aria-pressed={activeId === spot.id}
              aria-label={spot.label}
              onClick={() => setActiveId((current) => (current === spot.id ? null : spot.id))}
            >
              {spot.emoji ?? "＋"}
            </button>
          ))}
        </div>
        <div className="hotspot-readout" role="status" aria-live="polite">
          {active ? (
            <>
              <strong>
                {active.emoji && <span aria-hidden="true">{active.emoji} </span>}
                {active.label}
              </strong>
              {active.body && <p>{richText(active.body)}</p>}
            </>
          ) : (
            <span className="hotspot-hint">Tap a marker to explore.</span>
          )}
        </div>
      </div>
    </>
  );
}
