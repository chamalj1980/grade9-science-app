# ADR-0005: Medium (Sinhala / Tamil / English) as a first-class content dimension

- **Status:** Proposed
- **Date:** 2026-07-23

## Context

Content must exist in three media: Sinhala, Tamil, and English. Block content is deeply
nested JSON; field-by-field translation of that JSON is brittle, and content genuinely
differs by language (examples, script, sometimes diagrams and audio), especially for a
Language-lab. Machine-translating science terminology at render time risks quality.

## Decision

Treat **medium as a first-class dimension** on `chapter` and content: a chapter exists **per
medium**, and its content is authored — or AI-translated as a *whole section* into a new
per-medium version — rather than translated field by field. UI-chrome strings (buttons,
labels) use a conventional i18n string catalog, separate from content.

## Consequences

- **Easier:** each medium is real, reviewable authored content; the AI-draft flow can
  translate an English section into a Sinhala/Tamil version wholesale (one more use of the
  authoring pipeline); queries are simple (`where medium = …`).
- **Harder:** structure is duplicated across media (accepted — the content diverges anyway);
  we need a "coverage" view of which media each chapter exists in, and a way to keep media
  versions loosely in sync when the source changes.

## Alternatives considered

- **Field-level translation table** keyed by (entity, field, medium): rejected — brittle and
  awkward over nested block JSON.
- **Auto-translate at render:** rejected — quality (science terms), latency, and cost;
  unacceptable for a curriculum product.
