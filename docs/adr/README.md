# Architecture Decision Records

Short, dated, immutable notes capturing **one load-bearing decision each** — the *why*
behind choices that are expensive to reverse, so they aren't silently re-litigated.

Format: [Michael Nygard's ADR template](0000-adr-template.md) — Context → Decision →
Consequences. Don't edit a decided ADR; instead add a new one that **supersedes** it.

## Index

| # | Decision | Status |
|---|---|---|
| [0001](0001-content-as-data-driven-blocks.md) | Content is authored as data-driven blocks | Accepted |
| [0002](0002-backend-platform-supabase.md) | Backend platform: Supabase (Postgres + Auth + RLS + Realtime + Storage) | Proposed |
| [0003](0003-content-storage-and-versioning.md) | Store content as whole-section JSONB, with immutable versioning | Proposed |
| [0004](0004-auth-roles-and-multitenancy.md) | Auth, roles & multi-tenancy via RLS | Proposed |
| [0005](0005-i18n-medium-as-dimension.md) | Medium (Sinhala/Tamil/English) as a first-class content dimension | Proposed |
| [0006](0006-ai-authoring-via-server-proxy.md) | AI authoring runs through a server proxy, never a client key | Proposed |

Status: `Accepted` (decided/implemented) · `Proposed` (agreed direction, not yet built) ·
`Superseded` (replaced — links the successor).
