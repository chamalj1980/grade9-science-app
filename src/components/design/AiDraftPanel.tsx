import { useState } from "react";
import { buildCopyablePrompt } from "../../ai/authoringPrompt";
import { parseDraft } from "../../ai/draftValidation";
import { generateDraftViaApi } from "../../ai/generateDraft";
import { SAMPLE_DRAFT_JSON } from "../../ai/sampleDraft";
import type { ContentSection } from "../../content/schema";

const KEY_STORE = "grade9-anthropic-key";

// The AI-draft flow. Safe default (no backend, no key): assemble the prompt → run it in
// Claude → paste the JSON back → validate → load into the editor. An optional direct API
// call is available for a single author with their own key (dev/preview only).
export function AiDraftPanel({
  onLoad,
  onClose
}: {
  onLoad: (section: ContentSection) => void;
  onClose: () => void;
}) {
  const [chapterText, setChapterText] = useState("");
  const [jsonText, setJsonText] = useState("");
  const [errors, setErrors] = useState<string[]>([]);
  const [warnings, setWarnings] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);
  const [showApi, setShowApi] = useState(false);
  const [apiKey, setApiKey] = useState(
    () => (typeof window === "undefined" ? "" : window.localStorage.getItem(KEY_STORE) ?? "")
  );
  const [busy, setBusy] = useState(false);

  function review(text: string) {
    const result = parseDraft(text);
    setErrors(result.errors);
    setWarnings(result.warnings);
    if (result.section) {
      onLoad(result.section);
    }
  }

  async function copyPrompt() {
    try {
      await navigator.clipboard.writeText(buildCopyablePrompt(chapterText));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setErrors(["Couldn't copy to clipboard — select the prompt manually."]);
    }
  }

  async function readFile(file: File) {
    setChapterText(await file.text());
  }

  async function generate() {
    setErrors([]);
    setWarnings([]);
    setBusy(true);
    try {
      window.localStorage.setItem(KEY_STORE, apiKey);
      const output = await generateDraftViaApi(chapterText, apiKey);
      setJsonText(output);
      review(output);
    } catch (error) {
      setErrors([(error as Error).message]);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="ai-panel">
      <div className="ai-panel-head">
        <div>
          <p className="eyebrow">AI author</p>
          <h2>Draft a lesson from a chapter</h2>
        </div>
        <button type="button" className="ai-close" onClick={onClose} aria-label="Close">
          ✕
        </button>
      </div>

      <ol className="ai-steps">
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
              Upload a .txt file
              <input
                type="file"
                accept=".txt,.md,text/plain,text/markdown"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (file) readFile(file);
                }}
              />
            </label>
          </div>
        </li>

        <li>
          <span className="ai-step-num">2</span>
          <div className="ai-step-body">
            <strong>Generate the draft</strong>
            <p className="ai-hint">
              Copy the prompt and run it in Claude, then paste the JSON it returns below.
              Your key never leaves your machine — a launched product would call the model
              through a server instead.
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
                  {busy ? "Generating…" : "Generate with Opus 4.8"}
                </button>
                <p className="ai-warn-note">
                  Dev/preview only — never ship a key in a browser app; use a server proxy
                  in production.
                </p>
              </div>
            )}
          </div>
        </li>

        <li>
          <span className="ai-step-num">3</span>
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
                Load sample draft
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
