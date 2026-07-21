import { useState } from "react";
import { richText } from "../richText";
import type { RevealTabsBlock } from "../schema";

// A button row that reveals one detail panel at a time (the life-theory explorer).
export function RevealTabs({ block }: { block: RevealTabsBlock }) {
  const [activeId, setActiveId] = useState(block.defaultId ?? block.tabs[0]?.id);
  const active = block.tabs.find((tab) => tab.id === activeId);

  return (
    <>
      <div className="part-buttons" role="group" aria-label={block.ariaLabel}>
        {block.tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={activeId === tab.id ? "is-active" : ""}
            aria-pressed={activeId === tab.id}
            onClick={() => setActiveId(tab.id)}
          >
            {tab.emoji && <span aria-hidden="true">{tab.emoji}</span>} {tab.label}
          </button>
        ))}
      </div>

      {active && (
        <div key={active.id} className="part-panel evo-reveal" role="status" aria-live="polite">
          <h4>
            {active.emoji && <span aria-hidden="true">{active.emoji}</span>} {active.title}
            {active.badge && (
              <span className={`theory-verdict ${active.badgeTone ?? ""}`.trim()}>
                {active.badge}
              </span>
            )}
          </h4>
          {active.lead && <p className="lesson-key">{richText(active.lead)}</p>}
          {active.body && <p>{richText(active.body)}</p>}
        </div>
      )}
    </>
  );
}
