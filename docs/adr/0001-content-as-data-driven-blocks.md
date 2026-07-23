# ADR-0001: Content is authored as data-driven blocks

- **Status:** Accepted (implemented in `src/content`)
- **Date:** 2026-07-23

## Context

The first chapters were bespoke per-chapter React components. That does not scale to a
platform spanning 13 grades × 3 media × many subjects, and it locks content authoring to
engineers. We needed content that non-engineers (and an AI) can produce, without giving up
the rich, interactive experiences that are the product's core value.

## Decision

A chapter is **data**: a section → groups → an ordered list of typed **blocks**. Each block
`type` maps to a full-power React component in a registry (`BlockRenderer`). Content is a
JSON document typed by `src/content/schema.ts` (to be validated at runtime with zod once it
lives in a database). Interactivity is not flattened — a block component is as rich as any
hand-built one; only its *content* is lifted out into data.

## Consequences

- **Easier:** authoring at scale; AI generation (output is schema JSON); DB-readiness (the
  types *are* the future JSON schema); reuse of interactions across chapters/subjects.
- **Harder:** a new *kind* of interaction requires a new block type (code, written once);
  the block registry + catalog must be maintained.
- Reference implementation: Chapter 9 (Evolution) and Chapter 10 (Electrolysis) render
  entirely from data. A live catalog exists (`src/content/catalog.ts`, the "Blocks" screen).

## Alternatives considered

- **Templated CMS primitives** (text/image/MCQ only): rejected — flattens exactly the
  interactivity that differentiates the product.
- **Keep bespoke components:** rejected — doesn't scale and excludes non-engineer authors.
