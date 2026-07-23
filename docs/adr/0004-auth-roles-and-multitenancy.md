# ADR-0004: Auth, roles & multi-tenancy via RLS

- **Status:** Proposed
- **Date:** 2026-07-23

## Context

The platform has four roles (admin, teacher, parent, student), teaching groups (classes),
parent visibility into their own child's progress, and student data that must stay private.
Multi-tenancy (schools/orgs) is painful to retrofit, so tenancy must be present from the
first schema.

## Decision

Use **Supabase Auth** for identity. Model authorization as `profile.role` plus
relationships — `class` / `enrollment` / `guardian_link` — for scoping, under an
`organization` tenant boundary. Enforce access with **Postgres Row-Level Security policies**
on every table, so the data layer itself is the security boundary (not just app code).

## Consequences

- **Easier:** access rules are enforced at the database — a client or app bug can't leak
  another tenant's or student's data; parents get a read-only scope to their linked child
  via `guardian_link`; tenancy exists from day one.
- **Harder:** every table needs correct RLS policies (the real work of this decision, and
  easy to get subtly wrong — needs tests); the role/tenant model must be settled early
  (see the org-granularity open question in `data-model.md`).

## Alternatives considered

- **App-layer authorization only:** rejected — a single missing check leaks data; RLS is
  defense in depth at the layer that matters.
- **A database per tenant:** rejected — operational overkill at this scale; RLS on shared
  tables is sufficient.
