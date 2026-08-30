# Architecture

See `CLAUDE.md` for the authoritative, enforced architecture rules (apps → `packages/api-client`
choke point, RLS-everywhere, the two invariants, lightweight-by-default). This document is the
narrative version.

## Monorepo

pnpm workspaces + Turborepo. pnpm for strict non-hoisted `node_modules` (avoids
phantom-dependency bugs — a real cost when an autonomous agent is writing code daily). Turborepo
for cached task pipelines (`build`/`lint`/`typecheck`/`test`) and native Vercel remote-cache
integration.

```
apps/mobile   — Expo Router (iOS/Android/web-preview)
apps/web       — Next.js App Router
packages/shared-types — domain types, no runtime logic
packages/api-client   — the only Supabase touchpoint; owns client-side caching + pagination
packages/validation   — zod schemas, single source of truth
packages/config        — shared tsconfig/eslint/prettier
supabase/                — migrations, Edge Functions, pgTAP tests
```

## Data layer

Postgres + PostGIS via Supabase. Row Level Security is the enforcement mechanism for both
invariants (verification gate, never-paywall-core) — application code is not trusted as the only
gate, because an autonomous agent's application-layer bug should not be able to leak an
unverified profile or bypass the paywall-free promise. RLS + pgTAP tests are the actual
guarantee; see `supabase/tests/`.

## Client-side caching (lightweight-by-default)

Mobile persists profile/match/recent-chat data locally (`expo-sqlite` or MMKV) so repeat screens
don't re-fetch; web uses standard HTTP caching + `IndexedDB` for the same data. This is a
`packages/api-client` concern, not duplicated per-screen, so both apps get it for free and it
keeps hosting costs low under any Phase 5 hosting choice (see `docs/DECISIONS/` once
`ADR-0003-hosting.md` exists).

## Deployment

- Web: Vercel, native GitHub integration, PR previews automatic.
- Mobile: EAS Build/Submit, `development`/`preview`/`production` profiles. Production releases
  require a manually-triggered, environment-gated promotion workflow — see
  `.github/workflows/mobile-eas-promote.yml` once it exists (Phase 5).
