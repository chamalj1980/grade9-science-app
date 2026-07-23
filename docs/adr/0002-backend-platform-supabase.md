# ADR-0002: Backend platform — Supabase

- **Status:** Proposed
- **Date:** 2026-07-23

## Context

The app is client-only with data in `localStorage`. The platform needs, roughly in order:
accounts + the four roles, a database for content and progress, row-level access control
(students, teachers, parents, tenants), realtime (MCQ duels, leaderboards), file storage
(assets/media), and a place to run the AI authoring proxy. We're a small team optimizing
for launch speed, and we want to keep the existing Vite SPA rather than migrate frameworks
now.

## Decision

Use **Supabase** as the backend: managed **Postgres** + **Auth** + **Row-Level Security** +
**Realtime** + **Storage** + **Edge Functions**. Keep the current React + Vite SPA and add
Supabase as its backend; revisit an SSR framework (e.g. Next.js) later only if SEO/SSR needs
it.

## Consequences

- **Easier:** one integrated stack covers auth, roles/RLS, realtime, and storage; Postgres
  gives relational rigor *and* JSONB for block content ([ADR-0003](0003-content-storage-and-versioning.md));
  RLS enforces multi-tenancy at the data layer ([ADR-0004](0004-auth-roles-and-multitenancy.md));
  Edge Functions can host the AI proxy ([ADR-0006](0006-ai-authoring-via-server-proxy.md)).
- **Harder:** some vendor coupling (mitigated — it's standard Postgres underneath, so
  portable); an RLS learning curve; realtime scaling to watch for duels/leaderboards.

## Alternatives considered

- **Custom Node/Express + Postgres:** maximum control, but far more to build and operate
  (auth, RLS tooling, realtime, storage all DIY).
- **Firebase:** fast auth/realtime, but weaker relational + JSONB querying for versioned
  content and analytics.
- Revisit this ADR if scale or cost economics change materially.
