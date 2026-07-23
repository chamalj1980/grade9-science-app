# Development Plan & Roadmap

Phased milestones, the launch cut, and — most importantly — what we are **not** building
yet. Ties to the [functional](functional-architecture.md) and [technical](technical-architecture.md)
architectures. This is a living plan; dates are deliberately omitted in favour of ordering
and dependencies.

## Where we are (2026-07)

A client-only React + Vite SPA proving the product: the **block content model** + renderer,
a live **block catalog**, 9 chapters (2 fully data-driven), the **visual/figure tier**,
**Quiz Arena**, and the teacher **Design Studio** with a **live preview** and the **AI-draft**
path (paste/PDF → validate → review). No backend, no accounts; Grade 9 · Science · English;
progress in `localStorage`.

## Phases

| Phase | Theme | Key work | Depends on |
|---|---|---|---|
| **1 (in progress)** | Finish the content model | Flexible typed sections (N exercises, recap/assessment/lab kinds); publish a draft into the live course; block-editor forms for the remaining block types; exercises + recap in the Studio | — |
| **2** | Backend & accounts | Stand up Supabase; migrate the data model; Auth + the four roles + RLS; move progress and content to Postgres; the AI **server proxy** | ADR-0002/0003/0004/0006 |
| **3** | Dimensions & i18n | grade × subject × medium × path; per-medium authoring (+ AI whole-section translation); the shared **asset library** | Phase 2, ADR-0005 |
| **4** | Authoring at scale | Full Design Studio; the **phased AI pipeline** (per-phase model routing, caching); review/moderation & publish workflow | Phase 2–3 |
| **5** | Social & gamified | Points/streaks → leaderboards → **async challenges** → **live MCQ duels** → monthly competitions | Phase 2 (+ Realtime) |
| **6** | Teacher-assisted mode | Classes, enrollment, assignments; teacher dashboards; **parent** read-only visibility | Phase 2 |
| **Labs** (cross-cut) | Interactive labs | The `simulation` / lab block tier (Science labs; the Language-lab idea) | Phase 1 blocks, best after 3 |

## The MVP / launch cut

The smallest coherent thing worth launching: **an account-based Grade 9 Science
self-learning app with teacher authoring.**

**In:**
- Grade 9 · Science · **English only**
- Self-learning mode: students learn + self-assess (existing content types)
- Accounts + **persisted progress** (needs Phase 2 backend)
- Teacher authoring via the Design Studio + AI (server proxy)

**This is essentially Phase 1 + Phase 2** on the content that largely exists. It proves the
core loop (learn/assess/author) with real accounts, before adding breadth or the social
layer.

## Explicitly NOT now (deferred past MVP)

- Multiple grades (1–13) and other subjects
- Sinhala / Tamil media (English-only at launch)
- The social/competitive layer (duels, leaderboards, competitions)
- Parent role and teacher-assisted classes
- Interactive labs (Science / Language)
- Offline/PWA (nice-to-have; revisit based on user connectivity data)

Keeping this list explicit is the main defence against scope creep.

## One-way doors — decide before/at Phase 2

These are expensive to reverse; settle them as ADRs before building on them:
the **backend platform**, the **content storage & versioning model**, **auth/roles/
multi-tenancy (RLS)**, the **i18n dimension**, and the **AI proxy boundary**. All six are
drafted in [`adr/`](adr/) — review and accept before Phase 2 code.

## Risks & mitigations

| Risk | Mitigation |
|---|---|
| **Data-model lock-in** | Model pinned up front ([`data-model.md`](data-model.md)); JSONB content keeps the shape flexible. |
| **AI cost at scale** | Model tiering + prompt caching + logging; per-chapter budget visibility. |
| **Content quality / moderation** | Human-in-the-loop review in the Studio; publish gates; asset moderation before "public". |
| **RLS correctness** | Treat access policies as first-class, with tests, from Phase 2. |
| **Scope creep** | The "NOT now" list; MVP cut; phase gates. |
| **Solo/small-team bandwidth** | Managed backend (Supabase) to minimise ops; ship the MVP cut before breadth. |
| **Connectivity (SL)** | Cache-friendly published content; offline as a fast-follow if data shows it's needed. |
