# ADR-0003: Store content as whole-section JSONB, with immutable versioning

- **Status:** Proposed
- **Date:** 2026-07-23

## Context

Block content ([ADR-0001](0001-content-as-data-driven-blocks.md)) is an inherently nested
document, authored and rendered as a whole section. The app already holds this exact
`ContentSection` shape in memory. We also need drafts, safe publishing, and history/rollback
for teacher- and AI-authored content.

## Decision

Store a section's content as a single **`content jsonb`** column (the `ContentSection`
shape: `hero` + `groups[]` + `blocks[]`) on **`content_version`** rows. `content_section`
holds metadata and a `current_version_id` pointer. **Publishing is immutable:** each edit
creates a new version (status `draft`); promoting one sets the live pointer. We do **not**
store one row per block.

## Consequences

- **Easier:** zero transform between DB and the renderer (the JSONB *is* what the app
  renders); drafts, publish, and rollback are trivial (version rows); whole-section diffs.
- **Harder:** no SQL-level per-block queries or cross-content block analytics (accepted —
  not a current requirement; revisit if it becomes one); JSONB shape must be validated in
  the app/service layer (zod against the schema types), not by DB constraints.

## Alternatives considered

- **Normalized block rows:** SQL-queryable blocks, but adds a serialize/deserialize
  transform and join complexity for a capability we don't need yet.
- **Single mutable `content` column:** simplest, but no history and no safe publish — a bad
  save would overwrite live student-facing content.
