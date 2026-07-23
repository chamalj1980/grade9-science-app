# ADR-0006: AI authoring runs through a server proxy, never a client key

- **Status:** Proposed
- **Date:** 2026-07-23

## Context

The AI-draft flow calls the Anthropic API. A browser must **never** hold the API key — it
would be exposed to every user. We also want capabilities that only make sense server-side:
per-phase model routing, prompt caching of the static catalog/schema, and cost/audit
logging. Today's client-side "bring-your-own-key" path exists only as a dev convenience.

## Decision

Route **all** model calls through a **server proxy** (a Supabase Edge Function or a small
service) that holds the key. The client sends the chapter text + options; the proxy builds
the prompt (`src/ai/authoringPrompt.ts` logic moves server-side), calls the model(s),
validates the returned `ContentSection` JSON, and returns it. The browser direct-call path
is **dev-only and removed at launch**.

## Consequences

- **Easier:** the key stays server-side; enables **per-phase model routing** (cheap model
  for outline/draft, Opus for assessment + diagrams — the `PHASE_MODEL_DEFAULTS` seam in
  `src/ai/models.ts`), **prompt caching** of the ~13K-token static catalog/schema (near-free
  on repeat), and per-chapter cost logging (`ai_generation`).
- **Harder:** AI features now depend on the backend (fine — it's on the roadmap anyway); the
  phased pipeline is built in the proxy, not the client.
- The validator (`src/ai/draftValidation.ts`) can run in both places, but the proxy is the
  authoritative gate.

## Alternatives considered

- **Direct browser calls with per-user keys:** rejected for production — key exposure, no
  central cost/model control, no caching across users.
- **Manual paste-only (no proxy):** works and is the safe default today, but gives no
  automation or routing — a stopgap, not the platform answer.
