# Architecture & Design Docs

Living documentation for the learning platform. These are **decision- and model-focused**,
kept lean and updated alongside the code — not a big upfront spec. Below container level,
the code is the source of truth.

## Contents

- [`functional-architecture.md`](functional-architecture.md) — actors, core loops
  (Learn / Assess / Author / Compete), content taxonomy & dimensions, modes; current-vs-target.
- [`technical-architecture.md`](technical-architecture.md) — C4 context + container view,
  the recommended stack, data flows, the AI pipeline, and cross-cutting concerns.
- [`data-model.md`](data-model.md) — the domain/data model: entities, relationships, and
  the storage decisions that are hardest to change after launch.
- [`roadmap.md`](roadmap.md) — phased milestones, the MVP/launch cut, and the explicit
  "not now" list.
- [`adr/`](adr/) — Architecture Decision Records: short, dated, one-decision-each notes
  capturing *why*, so settled calls aren't re-litigated.

Suggested reading order: functional → technical → data model → roadmap, with the ADRs as
the rationale behind each.

## How to use these

- **Change something structural?** Update the relevant doc in the same PR.
- **Made a load-bearing decision?** Add an ADR (copy [`adr/0000-adr-template.md`](adr/0000-adr-template.md)).
- **Status labels** on ADRs: `Accepted` = decided/implemented; `Proposed` = agreed direction,
  not yet built; `Superseded` = replaced (link the successor).

## Where we are today (2026-07)

A **client-only React + Vite SPA**, no backend. Content is authored as **data-driven blocks**
(`src/content`), progress lives in `localStorage`, and there's a teacher **Design Studio**
with an **AI-draft** path. The docs here describe the **target platform** and the migration
from this starting point — grounded in what already exists, not a green-field fiction.
