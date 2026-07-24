import { useEffect, useState } from "react";
import { buildCopyablePrompt } from "../../ai/authoringPrompt";
import {
  DEFAULT_RECAP_INSTRUCTION,
  EXERCISE_TYPES,
  MAX_EXERCISES,
  defaultDraftOptions,
  type DraftOptions,
  type ExerciseType
} from "../../ai/draftOptions";
import { parseDraft } from "../../ai/draftValidation";
import { generateDraftViaApi } from "../../ai/generateDraft";
import { DEFAULT_MODEL, MODEL_OPTIONS } from "../../ai/models";
import { extractPdfText } from "../../ai/pdfText";
import { SAMPLE_DRAFT_JSON } from "../../ai/sampleDraft";
import type { ChapterDraft } from "./types";

const KEY_STORE = "grade9-anthropic-key";
const MODEL_STORE = "grade9-draft-model";
const OPTIONS_STORE = "grade9-draft-options";

// The AI-draft flow. Safe default (no backend, no key): choose what to build → copy the
// prompt → run it in Claude → paste the JSON back → validate → load the whole chapter into
// the editor. An optional direct API call exists for a single author with their own key.
export function AiDraftPanel({
  onLoad,
  onClose
}: {
  onLoad: (draft: ChapterDraft) => void;
  onClose: () => void;
}) {
  const [chapterText, setChapterText] = useState("");
  const [jsonText, setJsonText] = useState("");
  const [errors, setErrors] = useState<string[]>([]);
  const [warnings, setWarnings] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);
  const [showApi, setShowApi] = useState(false);
  const [busy, setBusy] = useState(false);
  const [extracting, setExtracting] = useState(false);
  const [apiKey, setApiKey] = useState(
    () => (typeof window === "undefined" ? "" : window.localStorage.getItem(KEY_STORE) ?? "")
  );
  const [model, setModel] = useState(
    () =>
      typeof window === "undefined"
        ? DEFAULT_MODEL
        : window.localStorage.getItem(MODEL_STORE) ?? DEFAULT_MODEL
  );
  const [options, setOptions] = useState<DraftOptions>(() => {
    if (typeof window === "undefined") return defaultDraftOptions();
    try {
      const raw = window.localStorage.getItem(OPTIONS_STORE);
      return raw ? (JSON.parse(raw) as DraftOptions) : defaultDraftOptions();
    } catch {
      return defaultDraftOptions();
    }
  });

  useEffect(() => {
    window.localStorage.setItem(OPTIONS_STORE, JSON.stringify(options));
  }, [options]);

  function review(text: string) {
    const result = parseDraft(text);
    setErrors(result.errors);
    setWarnings(result.warnings);
    if (result.draft) {
      onLoad(result.draft);
    }
  }

  async function copyPrompt() {
    try {
      await navigator.clipboard.writeText(buildCopyablePrompt(chapterText, options));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setErrors(["Couldn't copy to clipboard — select the prompt manually."]);
    }
  }

  async function handleFile(file: File) {
    setErrors([]);
    const isPdf = file.type === "application/pdf" || /\.pdf$/i.test(file.name);
    if (!isPdf) {
      setChapterText(await file.text());
      return;
    }
    setExtracting(true);
    try {
      const text = await extractPdfText(file);
      if (!text) {
        setErrors(["No text found in that PDF — it may be scanned images. Paste the text instead."]);
      }
      setChapterText(text);
    } catch (error) {
      setErrors([`Couldn't read the PDF: ${(error as Error).message}`]);
    } finally {
      setExtracting(false);
    }
  }

  async function generate() {
    setErrors([]);
    setWarnings([]);
    setBusy(true);
    try {
      window.localStorage.setItem(KEY_STORE, apiKey);
      window.localStorage.setItem(MODEL_STORE, model);
      const output = await generateDraftViaApi(chapterText, apiKey, model, options);
      setJsonText(output);
      review(output);
    } catch (error) {
      setErrors([(error as Error).message]);
    } finally {
      setBusy(false);
    }
  }

  function setExercise(index: number, type: ExerciseType) {
    setOptions({
      ...options,
      exercises: options.exercises.map((value, i) => (i === index ? type : value))
    });
  }

  return (
    <div className="ai-panel">
      <div className="ai-panel-head">
        <div>
          <p className="eyebrow">AI author</p>
          <h2>Draft a chapter</h2>
        </div>
        <button type="button" className="ai-close" onClick={onClose} aria-label="Close">
          ✕
        </button>
      </div>

      <ol className="ai-steps">
        {/* 1 — source */}
        <li>
          <span className="ai-step-num">1</span>
          <div className="ai-step-body">
            <strong>Paste the chapter text</strong>
            <textarea
              className="df-textarea"
              rows={4}
              placeholder="Paste the chapter's text here…"
              value={chapterText}
              onChange={(event) => setChapterText(event.target.value)}
            />
            <label className="ai-file">
              {extracting ? "Extracting PDF…" : "Upload a PDF or .txt file"}
              <input
                type="file"
                accept=".pdf,.txt,.md,application/pdf,text/plain,text/markdown"
                disabled={extracting}
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (file) handleFile(file);
                }}
              />
            </label>
          </div>
        </li>

        {/* 2 — what to build */}
        <li>
          <span className="ai-step-num">2</span>
          <div className="ai-step-body">
            <strong>Choose what to build</strong>

            <span className="df-label">Exercises</span>
            {options.exercises.length === 0 && <p className="ai-hint">No exercises — lesson only.</p>}
            {options.exercises.map((type, index) => (
              <div key={index} className="ai-exercise-row">
                <span className="ai-exercise-num">{index + 1}</span>
                <select
                  className="df-select"
                  aria-label={`Exercise ${index + 1} type`}
                  value={type}
                  onChange={(event) => setExercise(index, event.target.value as ExerciseType)}
                >
                  {EXERCISE_TYPES.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  className="df-remove"
                  aria-label={`Remove exercise ${index + 1}`}
                  onClick={() =>
                    setOptions({
                      ...options,
                      exercises: options.exercises.filter((_, i) => i !== index)
                    })
                  }
                >
                  ✕
                </button>
              </div>
            ))}
            {options.exercises.length < MAX_EXERCISES && (
              <button
                type="button"
                className="df-add"
                onClick={() =>
                  setOptions({ ...options, exercises: [...options.exercises, "mcq"] })
                }
              >
                + exercise
              </button>
            )}

            <label className="ai-check">
              <input
                type="checkbox"
                checked={options.includeRecap}
                onChange={(event) =>
                  setOptions({ ...options, includeRecap: event.target.checked })
                }
              />
              Include a recap
            </label>
            {options.includeRecap && (
              <>
                <textarea
                  className="df-textarea"
                  rows={2}
                  aria-label="Recap brief"
                  value={options.recapInstruction}
                  onChange={(event) =>
                    setOptions({ ...options, recapInstruction: event.target.value })
                  }
                />
                {options.recapInstruction !== DEFAULT_RECAP_INSTRUCTION && (
                  <button
                    type="button"
                    className="df-add"
                    onClick={() =>
                      setOptions({ ...options, recapInstruction: DEFAULT_RECAP_INSTRUCTION })
                    }
                  >
                    reset to default
                  </button>
                )}
              </>
            )}
          </div>
        </li>

        {/* 3 — generate */}
        <li>
          <span className="ai-step-num">3</span>
          <div className="ai-step-body">
            <strong>Generate the draft</strong>
            <p className="ai-hint">
              Copy the prompt and run it in Claude, then paste the JSON it returns below. A
              launched product would call the model through a server instead.
            </p>
            <div className="ai-row">
              <button
                type="button"
                className="ai-btn"
                onClick={copyPrompt}
                disabled={!chapterText.trim()}
              >
                {copied ? "Prompt copied ✓" : "Copy prompt"}
              </button>
              <button
                type="button"
                className="ai-btn ai-ghost"
                onClick={() => setShowApi((value) => !value)}
              >
                {showApi ? "Hide direct call" : "Use my API key (dev)"}
              </button>
            </div>
            {showApi && (
              <div className="ai-api">
                <label className="ai-model">
                  <span className="df-label">Model</span>
                  <select
                    className="df-select"
                    value={model}
                    onChange={(event) => setModel(event.target.value)}
                  >
                    {MODEL_OPTIONS.map((option) => (
                      <option key={option.id} value={option.id}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>
                <p className="ai-hint">
                  {MODEL_OPTIONS.find((option) => option.id === model)?.note}
                </p>
                <input
                  className="df-input"
                  type="password"
                  placeholder="sk-ant-… (stored only in this browser)"
                  value={apiKey}
                  onChange={(event) => setApiKey(event.target.value)}
                />
                <button
                  type="button"
                  className="ai-btn"
                  onClick={generate}
                  disabled={busy || !chapterText.trim() || !apiKey.trim()}
                >
                  {busy
                    ? "Generating…"
                    : `Generate with ${MODEL_OPTIONS.find((o) => o.id === model)?.label ?? "AI"}`}
                </button>
                <p className="ai-warn-note">
                  Dev/preview only — never ship a key in a browser app; use a server proxy in
                  production.
                </p>
              </div>
            )}
          </div>
        </li>

        {/* 4 — review */}
        <li>
          <span className="ai-step-num">4</span>
          <div className="ai-step-body">
            <strong>Review the draft</strong>
            <textarea
              className="df-textarea df-mono"
              rows={5}
              placeholder="Paste the model's JSON output here…"
              value={jsonText}
              onChange={(event) => setJsonText(event.target.value)}
            />
            <div className="ai-row">
              <button type="button" className="ai-btn ai-primary" onClick={() => review(jsonText)}>
                Load into editor →
              </button>
              <button
                type="button"
                className="ai-btn ai-ghost"
                onClick={() => {
                  setJsonText(SAMPLE_DRAFT_JSON);
                  review(SAMPLE_DRAFT_JSON);
                }}
              >
                Load sample chapter
              </button>
            </div>
          </div>
        </li>
      </ol>

      {errors.length > 0 && (
        <div className="ai-messages ai-errors" role="alert">
          {errors.map((message, index) => (
            <p key={index}>⚠ {message}</p>
          ))}
        </div>
      )}
      {warnings.length > 0 && (
        <div className="ai-messages ai-warnings">
          <p>Loaded with {warnings.length} auto-fix(es):</p>
          {warnings.map((message, index) => (
            <p key={index}>• {message}</p>
          ))}
        </div>
      )}
    </div>
  );
}
