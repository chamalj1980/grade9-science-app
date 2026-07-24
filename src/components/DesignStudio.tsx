import { useEffect, useState } from "react";
import { blockCatalog } from "../content/catalog";
import type { Block, BlockType, ContentGroup, ContentSection } from "../content/schema";
import { SchemaSection } from "../content/SchemaSection";
import { emptyChapter, loadDraft, saveDraft, starterSection } from "../utils/drafts";
import { AiDraftPanel } from "./design/AiDraftPanel";
import { BlockForm } from "./design/blockForms";
import { createStarterBlock, uid } from "./design/starters";
import {
  PALETTE_BY_KIND,
  sectionKindLabel,
  toContentSection,
  type SectionKind
} from "./design/types";

const blockName: Record<string, string> = Object.fromEntries(
  blockCatalog.map((entry) => [entry.type, entry.name])
);

// The Design Studio: author a CHAPTER as an ordered list of sections (lesson, N exercises,
// recap), each a list of block groups edited with structured forms, with a live preview of
// the active section via the real SchemaSection renderer. Autosaves to localStorage.
export function DesignStudio() {
  const [draft, setDraft] = useState(() => loadDraft());
  const [activeKey, setActiveKey] = useState(() => draft.sections[0]?.key ?? "");
  const [saved, setSaved] = useState(true);
  const [showAi, setShowAi] = useState(false);

  useEffect(() => {
    saveDraft(draft);
    setSaved(true);
  }, [draft]);

  const active = draft.sections.find((s) => s.key === activeKey) ?? draft.sections[0];

  // Every mutation flows through here so autosave and the "saved" flag stay in sync.
  function edit(nextSections: typeof draft.sections, title = draft.title) {
    setSaved(false);
    setDraft({ title, sections: nextSections });
  }

  function updateActive(patch: Partial<(typeof draft.sections)[number]>) {
    edit(draft.sections.map((s) => (s.key === active.key ? { ...s, ...patch } : s)));
  }

  // ---- Section (chapter-level) management ----
  function addSection(kind: SectionKind) {
    const count = draft.sections.filter((s) => s.kind === kind).length;
    const label = kind === "exercise" ? `Exercise ${count + 1}` : sectionKindLabel[kind];
    const section = starterSection(kind, label);
    edit([...draft.sections, section]);
    setActiveKey(section.key);
  }

  function moveSection(key: string, dir: -1 | 1) {
    const index = draft.sections.findIndex((s) => s.key === key);
    const target = index + dir;
    if (target < 0 || target >= draft.sections.length) return;
    const sections = [...draft.sections];
    [sections[index], sections[target]] = [sections[target], sections[index]];
    edit(sections);
  }

  function deleteSection(key: string) {
    if (draft.sections.length <= 1) return;
    const index = draft.sections.findIndex((s) => s.key === key);
    const sections = draft.sections.filter((s) => s.key !== key);
    if (key === activeKey) {
      setActiveKey(sections[Math.max(0, index - 1)].key);
    }
    edit(sections);
  }

  // ---- Hero / group / block ops on the active section ----
  function updateHero(patch: Partial<ContentSection["hero"]>) {
    updateActive({ hero: { ...active.hero, ...patch } });
  }
  function updateGroups(groups: ContentGroup[]) {
    updateActive({ groups });
  }
  function updateGroup(gi: number, patch: Partial<ContentGroup>) {
    updateGroups(active.groups.map((g, i) => (i === gi ? { ...g, ...patch } : g)));
  }
  function moveGroup(gi: number, dir: -1 | 1) {
    const target = gi + dir;
    if (target < 0 || target >= active.groups.length) return;
    const groups = [...active.groups];
    [groups[gi], groups[target]] = [groups[target], groups[gi]];
    updateGroups(groups);
  }
  function addBlock(gi: number, type: BlockType) {
    updateGroup(gi, { blocks: [...active.groups[gi].blocks, createStarterBlock(type)] });
  }
  function updateBlock(gi: number, bi: number, block: Block) {
    updateGroup(gi, { blocks: active.groups[gi].blocks.map((b, i) => (i === bi ? block : b)) });
  }
  function moveBlock(gi: number, bi: number, dir: -1 | 1) {
    const target = bi + dir;
    const blocks = active.groups[gi].blocks;
    if (target < 0 || target >= blocks.length) return;
    const next = [...blocks];
    [next[bi], next[target]] = [next[target], next[bi]];
    updateGroup(gi, { blocks: next });
  }
  function deleteBlock(gi: number, bi: number) {
    updateGroup(gi, { blocks: active.groups[gi].blocks.filter((_, i) => i !== bi) });
  }

  // ---- AI draft → the chapter's lesson section ----
  function loadAiLesson(section: ContentSection) {
    const es = {
      key: uid("sec"),
      kind: "lesson" as const,
      label: "Lesson",
      hero: section.hero,
      wrapperClass: section.wrapperClass,
      groups: section.groups
    };
    const lessonIndex = draft.sections.findIndex((s) => s.kind === "lesson");
    const sections =
      lessonIndex >= 0
        ? draft.sections.map((s, i) => (i === lessonIndex ? es : s))
        : [es, ...draft.sections];
    edit(sections, section.hero.title || draft.title);
    setActiveKey(es.key);
    setShowAi(false);
  }

  const palette = PALETTE_BY_KIND[active.kind];

  return (
    <section className="studio" aria-labelledby="studio-title">
      <header className="studio-head">
        <div>
          <p className="eyebrow">Teacher · Design Studio</p>
          <h1 id="studio-title">Chapter editor</h1>
        </div>
        <div className="studio-actions">
          <button type="button" className="studio-ai" onClick={() => setShowAi((v) => !v)}>
            ✨ Draft with AI
          </button>
          <span className={`studio-saved ${saved ? "is-saved" : ""}`}>
            {saved ? "Draft saved" : "Saving…"}
          </span>
          <button
            type="button"
            className="studio-new"
            onClick={() => {
              if (confirm("Start a new chapter? Your current draft will be replaced.")) {
                const fresh = emptyChapter();
                setSaved(false);
                setDraft(fresh);
                setActiveKey(fresh.sections[0].key);
              }
            }}
          >
            New chapter
          </button>
        </div>
      </header>

      {showAi && <AiDraftPanel onClose={() => setShowAi(false)} onLoad={loadAiLesson} />}

      <label className="studio-chapter-title">
        <span className="df-label">Chapter title</span>
        <input
          className="df-input studio-title-input"
          value={draft.title}
          onChange={(event) => edit(draft.sections, event.target.value)}
        />
      </label>

      {/* Section tabs */}
      <div className="studio-tabs" role="tablist" aria-label="Chapter sections">
        {draft.sections.map((s) => (
          <button
            key={s.key}
            type="button"
            role="tab"
            aria-selected={s.key === activeKey}
            className={`studio-tab ${s.key === activeKey ? "is-active" : ""}`}
            onClick={() => setActiveKey(s.key)}
          >
            {s.label}
          </button>
        ))}
        <span className="studio-tab-add">
          <button type="button" onClick={() => addSection("exercise")}>+ Exercise</button>
          <button type="button" onClick={() => addSection("recap")}>+ Recap</button>
          <button type="button" onClick={() => addSection("lesson")}>+ Lesson</button>
        </span>
      </div>

      <div className="studio-panes">
        {/* ---- Editor ---- */}
        <div className="studio-editor">
          <div className="studio-card studio-hero-editor">
            <div className="studio-section-meta">
              <span className={`studio-kind kind-${active.kind}`}>
                {sectionKindLabel[active.kind]}
              </span>
              <input
                className="df-input"
                aria-label="Section label"
                value={active.label}
                onChange={(event) => updateActive({ label: event.target.value })}
              />
              <div className="studio-group-controls">
                <button type="button" onClick={() => moveSection(active.key, -1)} aria-label="Move section left">↑</button>
                <button type="button" onClick={() => moveSection(active.key, 1)} aria-label="Move section right">↓</button>
                {draft.sections.length > 1 && (
                  <button
                    type="button"
                    className="df-remove"
                    aria-label="Delete section"
                    onClick={() => deleteSection(active.key)}
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>
            <span className="df-label">Header shown to students</span>
            <input
              className="df-input"
              aria-label="Eyebrow"
              placeholder="Eyebrow (e.g. Lesson)"
              value={active.hero.eyebrow}
              onChange={(event) => updateHero({ eyebrow: event.target.value })}
            />
            <input
              className="df-input studio-title-input"
              aria-label="Section title"
              placeholder="Title"
              value={active.hero.title}
              onChange={(event) => updateHero({ title: event.target.value })}
            />
            <textarea
              className="df-textarea"
              aria-label="Intro"
              rows={2}
              placeholder="Intro line"
              value={active.hero.intro ?? ""}
              onChange={(event) => updateHero({ intro: event.target.value })}
            />
          </div>

          {active.groups.map((group, gi) => (
            <div key={gi} className="studio-card studio-group">
              <div className="studio-group-head">
                <input
                  className="df-input"
                  aria-label="Group heading"
                  placeholder="Group heading (optional)"
                  value={group.heading ?? ""}
                  onChange={(event) => updateGroup(gi, { heading: event.target.value })}
                />
                <div className="studio-group-controls">
                  <button type="button" onClick={() => moveGroup(gi, -1)} aria-label="Move group up">↑</button>
                  <button type="button" onClick={() => moveGroup(gi, 1)} aria-label="Move group down">↓</button>
                  {active.groups.length > 1 && (
                    <button
                      type="button"
                      className="df-remove"
                      aria-label="Delete group"
                      onClick={() => updateGroups(active.groups.filter((_, i) => i !== gi))}
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
                {palette.map((type) => (
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
            onClick={() => updateGroups([...active.groups, { heading: "", blocks: [] }])}
          >
            + Add group
          </button>
        </div>

        {/* ---- Live preview ---- */}
        <div className="studio-preview" aria-label="Live preview">
          <div className="studio-preview-label">Live preview — exactly what the student sees</div>
          <div className="studio-preview-frame">
            <SchemaSection section={toContentSection(active)} theme="matter" onProgress={() => {}} />
          </div>
        </div>
      </div>
    </section>
  );
}
