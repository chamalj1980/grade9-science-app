import { useRef, useState } from "react";
import {
  makeBlankQuestion,
  questionIssues,
  totalMarks,
  type TestPack,
  type TestQuestion
} from "../data/testModel";
import { parseQuestions } from "../utils/questionParser";
import {
  downloadPack,
  loadPacks,
  makeId,
  parsePackJson,
  removePack,
  savePacks,
  upsertPack
} from "../utils/testBank";
import type { LearningModule } from "../types";
import { QuestionEditor } from "./QuestionEditor";

interface TeacherStudioProps {
  modules: LearningModule[];
}

type View = "list" | "edit";

const SAMPLE = `(5) Select the group which only contain pure metals.
(1) Iron, Lead, Steel (2) Brass, Iron, Copper
(3) Copper, Iron, Gold (4) Nichrome, Iron, Zinc

(i) Name the straw-coloured liquid part of blood. ^1&

(ii) Explain why the left ventricle has a thicker wall than the right. ^3&`;

function emptyDraft(): TestPack {
  return {
    id: makeId(),
    title: "",
    kind: "term",
    questions: [],
    createdAt: Date.now(),
    source: "teacher"
  };
}

export function TeacherStudio({ modules }: TeacherStudioProps) {
  const [packs, setPacks] = useState<TestPack[]>(() => loadPacks());
  const [view, setView] = useState<View>("list");
  const [draft, setDraft] = useState<TestPack>(emptyDraft);
  const [raw, setRaw] = useState("");
  const [notice, setNotice] = useState<string | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);

  function persist(next: TestPack[]) {
    setPacks(next);
    savePacks(next);
  }

  function startNew() {
    setDraft(emptyDraft());
    setRaw("");
    setNotice(null);
    setView("edit");
  }

  function editPack(pack: TestPack) {
    setDraft(pack);
    setRaw("");
    setNotice(null);
    setView("edit");
  }

  function handleParse() {
    const parsed = parseQuestions(raw);
    if (parsed.length === 0) {
      setNotice("Nothing recognised — check the format, or add a question by hand.");
      return;
    }
    setDraft((current) => ({
      ...current,
      questions: [...current.questions, ...parsed]
    }));
    setRaw("");
    const mcqs = parsed.filter((question) => question.type === "mcq").length;
    setNotice(
      `Added ${parsed.length} question${parsed.length === 1 ? "" : "s"} (${mcqs} multiple choice). Check each answer key below.`
    );
  }

  function handleImportFile(file: File) {
    file.text().then((text) => {
      const result = parsePackJson(text);
      if (!result.ok) {
        setNotice(result.error);
        return;
      }
      persist(upsertPack(packs, result.pack));
      setNotice(`Imported “${result.pack.title}”.`);
    });
  }

  function savePack() {
    if (!draft.title.trim()) {
      setNotice("Give the test a name before saving.");
      return;
    }
    if (draft.questions.length === 0) {
      setNotice("Add at least one question before saving.");
      return;
    }
    persist(upsertPack(packs, { ...draft, title: draft.title.trim() }));
    setNotice(`Saved “${draft.title.trim()}”.`);
    setView("list");
  }

  const draftIssues = draft.questions.reduce(
    (sum, question) => sum + questionIssues(question).length,
    0
  );

  // ---------------- list ----------------
  if (view === "list") {
    return (
      <div className="ts">
        <header className="ts-hero">
          <p className="eyebrow">Teacher studio</p>
          <h1>Turn a paper into a playable test</h1>
          <p className="ts-lede">
            Paste the questions from a term paper — the app reformats them into
            interactive questions. Check the answer keys, then save it to this device or
            export it as a file to share.
          </p>
          <div className="ts-hero-actions">
            <button type="button" className="ts-primary" onClick={startNew}>
              + New test
            </button>
            <button
              type="button"
              className="ts-secondary"
              onClick={() => fileInput.current?.click()}
            >
              Import a test file
            </button>
            <input
              ref={fileInput}
              type="file"
              accept="application/json,.json"
              hidden
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) {
                  handleImportFile(file);
                }
                event.target.value = "";
              }}
            />
          </div>
        </header>

        {notice && (
          <p className="ts-notice" role="status">
            {notice}
          </p>
        )}

        <h2 className="ts-sub">Saved tests ({packs.length})</h2>
        {packs.length === 0 ? (
          <p className="ts-empty">
            No tests yet. Create one from a paper, or import a test file someone shared
            with you.
          </p>
        ) : (
          <ul className="ts-packs">
            {packs.map((pack) => (
              <li key={pack.id} className="ts-pack">
                <div>
                  <span className={`ts-kind ${pack.kind}`}>
                    {pack.kind === "term" ? "Term test" : "Chapter test"}
                  </span>
                  <h3>{pack.title}</h3>
                  <p>
                    {pack.questions.length} questions ·{" "}
                    {totalMarks(pack.questions)} marks
                  </p>
                </div>
                <div className="ts-pack-actions">
                  <button type="button" onClick={() => editPack(pack)}>
                    Edit
                  </button>
                  <button type="button" onClick={() => downloadPack(pack)}>
                    Export
                  </button>
                  <button
                    type="button"
                    className="ts-danger"
                    onClick={() => persist(removePack(packs, pack.id))}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }

  // ---------------- edit ----------------
  return (
    <div className="ts">
      <header className="ts-edit-head">
        <button type="button" className="ts-back" onClick={() => setView("list")}>
          ← Back
        </button>
        <h1>{draft.title || "New test"}</h1>
      </header>

      <section className="ts-panel">
        <h2 className="ts-sub">1 · Details</h2>
        <div className="ts-row">
          <label className="qe-field">
            <span>Test name</span>
            <input
              type="text"
              value={draft.title}
              placeholder="e.g. Term 2 mock paper"
              onChange={(event) =>
                setDraft({ ...draft, title: event.target.value })
              }
            />
          </label>
          <label className="qe-field qe-small">
            <span>Type</span>
            <select
              value={draft.kind}
              onChange={(event) =>
                setDraft({
                  ...draft,
                  kind: event.target.value as TestPack["kind"]
                })
              }
            >
              <option value="term">Term test (whole term)</option>
              <option value="module">Chapter test</option>
            </select>
          </label>
          {draft.kind === "module" && (
            <label className="qe-field qe-small">
              <span>Chapter</span>
              <select
                value={draft.moduleId ?? ""}
                onChange={(event) =>
                  setDraft({ ...draft, moduleId: event.target.value || undefined })
                }
              >
                <option value="">— choose —</option>
                {modules.map((module) => (
                  <option key={module.id} value={module.id}>
                    {module.title}
                  </option>
                ))}
              </select>
            </label>
          )}
        </div>
      </section>

      <section className="ts-panel">
        <h2 className="ts-sub">2 · Paste the questions</h2>
        <p className="ts-hint">
          Paste straight from the paper. MCQs written as <code>(1) … (2) …</code> or{" "}
          <code>a) … b) …</code> are detected automatically — mark the right option with a{" "}
          <code>*</code> if you have it. Marks like <code>^2&amp;</code> or{" "}
          <code>(2 marks)</code> are picked up too. A blank line between questions always
          helps.
        </p>
        <textarea
          className="ts-paste"
          rows={7}
          value={raw}
          placeholder={SAMPLE}
          onChange={(event) => setRaw(event.target.value)}
        />
        <div className="ts-paste-actions">
          <button
            type="button"
            className="ts-primary"
            disabled={!raw.trim()}
            onClick={handleParse}
          >
            Reformat into questions
          </button>
          <button
            type="button"
            className="ts-secondary"
            onClick={() => setRaw(SAMPLE)}
          >
            Use a sample
          </button>
        </div>
        {notice && (
          <p className="ts-notice" role="status">
            {notice}
          </p>
        )}
      </section>

      <section className="ts-panel">
        <div className="ts-review-head">
          <h2 className="ts-sub">
            3 · Review ({draft.questions.length} questions ·{" "}
            {totalMarks(draft.questions)} marks)
          </h2>
          {draftIssues > 0 && (
            <span className="ts-issue-count">{draftIssues} to fix</span>
          )}
        </div>

        {draft.questions.length === 0 ? (
          <p className="ts-empty">
            Nothing here yet — paste some questions above, or add one by hand.
          </p>
        ) : (
          <div className="ts-questions">
            {draft.questions.map((question, index) => (
              <QuestionEditor
                key={question.id}
                question={question}
                index={index}
                modules={modules}
                onChange={(next) =>
                  setDraft((current) => ({
                    ...current,
                    questions: current.questions.map((candidate) =>
                      candidate.id === question.id ? next : candidate
                    )
                  }))
                }
                onRemove={() =>
                  setDraft((current) => ({
                    ...current,
                    questions: current.questions.filter(
                      (candidate) => candidate.id !== question.id
                    )
                  }))
                }
                onMove={(direction) =>
                  setDraft((current) => {
                    const questions = [...current.questions];
                    const target = index + direction;
                    if (target < 0 || target >= questions.length) {
                      return current;
                    }
                    [questions[index], questions[target]] = [
                      questions[target],
                      questions[index]
                    ];
                    return { ...current, questions };
                  })
                }
              />
            ))}
          </div>
        )}

        <div className="ts-add-row">
          {(["mcq", "truefalse", "short", "essay"] as const).map((type) => (
            <button
              key={type}
              type="button"
              className="ts-secondary"
              onClick={() =>
                setDraft((current) => ({
                  ...current,
                  questions: [
                    ...current.questions,
                    makeBlankQuestion(makeId("q"), type)
                  ]
                }))
              }
            >
              + {type === "truefalse" ? "True/False" : type.toUpperCase()}
            </button>
          ))}
        </div>
      </section>

      <div className="ts-save-bar">
        <button type="button" className="ts-primary" onClick={savePack}>
          Save test
        </button>
        <button
          type="button"
          className="ts-secondary"
          disabled={draft.questions.length === 0}
          onClick={() => downloadPack(draft)}
        >
          Export as file
        </button>
        <button type="button" className="ts-secondary" onClick={() => setView("list")}>
          Cancel
        </button>
      </div>
    </div>
  );
}

export type { TestQuestion };
