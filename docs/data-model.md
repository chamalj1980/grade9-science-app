# Domain & Data Model

Status: **Proposed target.** Today the app is client-only and this data lives in
TypeScript modules and `localStorage`. This document is the schema we migrate toward when
the backend lands (see [ADR-0002](adr/0002-backend-platform-supabase.md)). It is the most
expensive thing to change after launch, so we pin it early.

Conventions: table names are `snake_case` singular; every table has `id uuid` (default
generated), `created_at`, `updated_at`. Ownership/visibility columns drive row-level
security ([ADR-0004](adr/0004-auth-roles-and-multitenancy.md)).

## Design principles

1. **Content is stored as blocks-as-JSONB, whole-section documents** — not one row per
   block. A `content_section` carries a `content jsonb` holding the exact `ContentSection`
   shape the app already renders (`hero` + `groups[]` + `blocks[]`). This maps 1:1 to
   `src/content/schema.ts`, so there is *no transform* between DB and renderer.
   See [ADR-0003](adr/0003-content-storage-and-versioning.md).
2. **Medium (Sinhala / Tamil / English) is a first-class dimension, not field-level
   translation.** A chapter exists per medium; content is authored (or AI-translated as a
   whole) per medium. See [ADR-0005](adr/0005-i18n-medium-as-dimension.md).
3. **Content is versioned; publishing is immutable.** Editing produces a new
   `content_version` (draft); publishing promotes one to the live pointer. Student-facing
   reads always hit a published version.
4. **Progress and attempts are append-mostly and scoped to a user.** Scores only move
   upward (mirrors the current `updateSectionProgress` contract).
5. **Multi-tenancy from day one.** An `organization` boundary + RLS, even if we launch with
   one org — retrofitting tenancy is painful.

## Entity-relationship overview

```mermaid
erDiagram
  organization  ||--o{ profile        : "has members"
  organization  ||--o{ class          : "runs"
  profile       ||--o{ class          : "teaches"
  class         ||--o{ enrollment     : "has"
  profile       ||--o{ enrollment     : "enrolled as student"
  profile       ||--o{ guardian_link  : "is guardian"
  profile       ||--o{ guardian_link  : "is student"

  subject       ||--o{ chapter        : "groups"
  learning_path ||--o{ path_chapter   : "orders"
  chapter       ||--o{ path_chapter   : "appears in"
  chapter       ||--o{ content_section: "has"
  content_section ||--o{ content_version : "versioned by"
  profile       ||--o{ content_version : "authored"
  profile       ||--o{ asset           : "owns"

  profile       ||--o{ section_progress : "tracks"
  content_section ||--o{ section_progress : "measured by"
  profile       ||--o{ attempt          : "makes"
  quiz_pack     ||--o{ attempt          : "assessed by"
  profile       ||--o{ quiz_pack        : "authors"

  profile       ||--o{ duel            : "challenger"
  profile       ||--o{ duel            : "opponent"
  profile       ||--o{ points_ledger   : "earns"
  competition   ||--o{ leaderboard_entry : "ranks"
  profile       ||--o{ leaderboard_entry : "placed"
```

## Identity & tenancy

| Table | Key columns | Notes |
|---|---|---|
| `organization` | name, region | Tenant boundary (a school / district). One at launch is fine. |
| `profile` | user_id (→ auth user), role, display_name, medium_pref, locale | Extends the auth user. `role` ∈ admin / teacher / parent / student (a user's primary role; class-scoped roles come via `class`/`enrollment`). |
| `class` | org_id, teacher_id, grade, subject_id?, medium, name | A teaching group. Drives teacher-assisted mode. |
| `enrollment` | class_id, student_id, status | Student ↔ class. |
| `guardian_link` | guardian_id, student_id | Parent sees their child's progress (read-only). |

## Content

| Table | Key columns | Notes |
|---|---|---|
| `subject` | key, name, domain | domain ∈ science / math / language / general (matches the block catalog's domains). |
| `chapter` | subject_id, grade (1–13), medium, n, title, blurb, art_id, status, order | One row **per medium**. Maps to today's `curriculum.ts` entries. |
| `learning_path` | name, grade, subject_id, medium | A syllabus-aligned ordered course. |
| `path_chapter` | path_id, chapter_id, order | Orders chapters within a path. |
| `content_section` | chapter_id, kind, title, order, current_version_id | kind ∈ lesson / exercise / recap / assessment / lab. Points at the live version. |
| `content_version` | section_id, version, status, content (jsonb), author_id | Immutable snapshot. `content` = the `ContentSection` JSON (`hero`, `groups[]`, `blocks[]`). status ∈ draft / in_review / published / archived. |
| `asset` | owner_id, kind, visibility, data/storage_url, alt, tags, medium | The shared visual/media library (SVG / image / audio / video). visibility ∈ private / org / public — the publish-to-library flywheel. |

> **Why whole-section JSONB, not per-block rows:** sections are authored and rendered as a
> unit, the block schema is inherently a nested document, and the app already holds this
> exact shape in memory. Per-block rows would buy SQL-level block queries we don't need and
> cost a constant serialize/deserialize transform. Revisit only if cross-content block
> analytics become a hard requirement.

## Learning & assessment

| Table | Key columns | Notes |
|---|---|---|
| `section_progress` | user_id, section_id, status, score, total, streak | Mirrors `utils/progress.ts` `SectionProgress`. Scores move upward only. |
| `quiz_pack` | owner_id, title, source, questions (jsonb) | Quiz Arena test packs (today in `localStorage`). |
| `attempt` | user_id, target_kind, target_id, answers (jsonb), score, submitted_at | A graded run of a quiz / exercise / term test. |
| `lab_session` | user_id, lab_section_id, state (jsonb) | Interactive Science/Language lab runs (future block tier). |
| `ai_generation` | author_id, model, phase, input_tokens, output_tokens, cost | Optional audit/cost log for AI authoring. |

## Social & gamification

| Table | Key columns | Notes |
|---|---|---|
| `duel` | challenger_id, opponent_id, quiz_ref, status, scores (jsonb) | MCQ duels. Realtime-backed. |
| `points_ledger` | user_id, source, amount | Append-only XP/points; streaks derived. |
| `competition` | period, scope, rules (jsonb) | Monthly competitions. |
| `leaderboard_entry` | competition_id, scope, user_id, points, rank | Materialized ranking (class / subject / global). |

## Current code → target table

| Today (client-side) | Target |
|---|---|
| `src/data/curriculum.ts` `Chapter[]` | `chapter` rows |
| `src/content/schema.ts` `ContentSection` + `chapters/*.ts` | `content_version.content` (jsonb) |
| `src/data/recaps.ts` | recap `content_section` |
| `src/content/illustrations.tsx` + inline `figure.svg` | `asset` rows |
| `src/utils/drafts.ts` working draft (`localStorage`) | `content_version` (status=draft) |
| `src/utils/progress.ts` `ProgressState` (`localStorage`) | `section_progress` rows |
| `src/data/quizQuestions.ts`, test-pack bank (`localStorage`) | `quiz_pack` + `attempt` |
| `src/ai/*` prompt/validation | server-side authoring service ([ADR-0006](adr/0006-ai-authoring-via-server-proxy.md)) |

## Open questions (resolve before building the backend)

1. **Org granularity:** school-level tenant, or a lighter teacher-owned workspace for
   launch? (Affects RLS shape.)
2. **Path vs chapter ordering:** is the syllabus path the primary nav, or is grade+subject
   enough for MVP? (`learning_path` may be deferred.)
3. **Assessment unification:** do in-chapter `mcq`/`sortBins` blocks and standalone
   `quiz_pack`s share one attempt/grading model, or stay separate?
4. **Asset licensing/moderation:** what gates a private asset becoming `public`?
5. **Offline/PWA:** which reads must work offline (SL connectivity), and how does that
   interact with `section_progress` sync?
