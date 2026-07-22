import { useEffect, useMemo, useState } from "react";
import { blockCatalog } from "../content/catalog";
import type { Block, BlockType, ContentGroup, ContentSection } from "../content/schema";
import { SchemaSection } from "../content/SchemaSection";
import { emptyLesson, loadDraft, saveDraft } from "../utils/drafts";
import { AiDraftPanel } from "./design/AiDraftPanel";
import { BlockForm } from "./design/blockForms";
import { createStarterBlock, editableBlockTypes } from "./design/starters";

const blockName: Record<string, string> = Object.fromEntries(
  blockCatalog.map((entry) => [entry.type, entry.name])
);

// The Design Studio's first slice: author a Lesson as a list of sections (groups), each
// holding blocks edited with structured forms, with a live preview that uses the real
// SchemaSection renderer. Autosaves the draft to localStorage.
export function DesignStudio() {
  const [section, setSection] = useState<ContentSection>(() => loadDraft());
  const [saved, setSaved] = useState(true);
  const [showAi, setShowAi] = useState(false);

  useEffect(() => {
    saveDraft(section);
    setSaved(true);
  }, [section]);

  // Every mutation flows through here so autosave and the "saved" flag stay in sync.
  function edit(next: ContentSection) {
    setSaved(false);
    setSection(next);
  }

  function updateHero(patch: Partial<ContentSection["hero"]>) {
    edit({ ...section, hero: { ...section.hero, ...patch } });
  }

  function updateGroups(groups: ContentGroup[]) {
    edit({ ...section, groups });
  }

  function updateGroup(gi: number, patch: Partial<ContentGroup>) {
    updateGroups(section.groups.map((g, i) => (i === gi ? { ...g, ...patch } : g)));
  }

  function moveGroup(gi: number, dir: -1 | 1) {
    const target = gi + dir;
    if (target < 0 || target >= section.groups.length) return;
    const groups = [...section.groups];
    [groups[gi], groups[target]] = [groups[target], groups[gi]];
    updateGroups(groups);
  }

  function addBlock(gi: number, type: BlockType) {
    updateGroup(gi, { blocks: [...section.groups[gi].blocks, createStarterBlock(type)] });
  }

  function updateBlock(gi: number, bi: number, block: Block) {
    updateGroup(gi, {
      blocks: section.groups[gi].blocks.map((b, i) => (i === bi ? block : b))
    });
  }

  function moveBlock(gi: number, bi: number, dir: -1 | 1) {
    const target = bi + dir;
    const blocks = section.groups[gi].blocks;
    if (target < 0 || target >= blocks.length) return;
    const next = [...blocks];
    [next[bi], next[target]] = [next[target], next[bi]];
    updateGroup(gi, { blocks: next });
  }

  function deleteBlock(gi: number, bi: number) {
    updateGroup(gi, { blocks: section.groups[gi].blocks.filter((_, i) => i !== bi) });
  }

  const previewSection = useMemo(() => section, [section]);

  return (
    <section className="studio" aria-labelledby="studio-title">
      <header className="studio-head">
        <div>
          <p className="eyebrow">Teacher · Design Studio</p>
          <h1 id="studio-title">Lesson editor</h1>
        </div>
        <div className="studio-actions">
          <button
            type="button"
            className="studio-ai"
            onClick={() => setShowAi((value) => !value)}
          >
            ✨ Draft with AI
          </button>
          <span className={`studio-saved ${saved ? "is-saved" : ""}`}>
            {saved ? "Draft saved" : "Saving…"}
          </span>
          <button
            type="button"
            className="studio-new"
            onClick={() => {
              if (confirm("Start a new lesson? Your current draft will be replaced.")) {
                edit(emptyLesson());
              }
            }}
          >
            New lesson
          </button>
        </div>
      </header>

      {showAi && (
        <AiDraftPanel
          onClose={() => setShowAi(false)}
          onLoad={(draft) => {
            edit(draft);
            setShowAi(false);
          }}
        />
      )}

      <div className="studio-panes">
        {/* ---- Editor ---- */}
        <div className="studio-editor">
          <div className="studio-card studio-hero-editor">
            <span className="df-label">Lesson header</span>
            <input
              className="df-input"
              aria-label="Eyebrow"
              placeholder="Eyebrow (e.g. Lesson)"
              value={section.hero.eyebrow}
              onChange={(event) => updateHero({ eyebrow: event.target.value })}
            />
            <input
              className="df-input studio-title-input"
              aria-label="Lesson title"
              placeholder="Lesson title"
              value={section.hero.title}
              onChange={(event) => updateHero({ title: event.target.value })}
            />
            <textarea
              className="df-textarea"
              aria-label="Intro"
              rows={2}
              placeholder="Intro line"
              value={section.hero.intro ?? ""}
              onChange={(event) => updateHero({ intro: event.target.value })}
            />
          </div>

          {section.groups.map((group, gi) => (
            <div key={gi} className="studio-card studio-group">
              <div className="studio-group-head">
                <input
                  className="df-input"
                  aria-label="Section heading"
                  placeholder="Section heading"
                  value={group.heading ?? ""}
                  onChange={(event) => updateGroup(gi, { heading: event.target.value })}
                />
                <div className="studio-group-controls">
                  <button type="button" onClick={() => moveGroup(gi, -1)} aria-label="Move section up">↑</button>
                  <button type="button" onClick={() => moveGroup(gi, 1)} aria-label="Move section down">↓</button>
                  {section.groups.length > 1 && (
                    <button
                      type="button"
                      className="df-remove"
                      aria-label="Delete section"
                      onClick={() => updateGroups(section.groups.filter((_, i) => i !== gi))}
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>

              {group.blocks.map((block, bi) => (
                <div key={bi} className="studio-block">
                  <div className="studio-block-head">
                    <span className="studio-block-name">{blockName[block.type] ?? block.type}</span>
                    <div className="studio-block-controls">
                      <button type="button" onClick={() => moveBlock(gi, bi, -1)} aria-label="Move block up">↑</button>
                      <button type="button" onClick={() => moveBlock(gi, bi, 1)} aria-label="Move block down">↓</button>
                      <button
                        type="button"
                        className="df-remove"
                        aria-label="Delete block"
                        onClick={() => deleteBlock(gi, bi)}
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                  <BlockForm block={block} onChange={(next) => updateBlock(gi, bi, next)} />
                </div>
              ))}

              <div className="studio-palette" role="group" aria-label="Add a block">
                {editableBlockTypes.map((type) => (
                  <button key={type} type="button" onClick={() => addBlock(gi, type)}>
                    + {blockName[type] ?? type}
                  </button>
                ))}
              </div>
            </div>
          ))}

          <button
            type="button"
            className="studio-add-section"
            onClick={() => updateGroups([...section.groups, { heading: "New section", blocks: [] }])}
          >
            + Add section
          </button>
        </div>

        {/* ---- Live preview ---- */}
        <div className="studio-preview" aria-label="Live preview">
          <div className="studio-preview-label">Live preview — exactly what the student sees</div>
          <div className="studio-preview-frame">
            <SchemaSection section={previewSection} theme="matter" onProgress={() => {}} />
          </div>
        </div>
      </div>
    </section>
  );
}
