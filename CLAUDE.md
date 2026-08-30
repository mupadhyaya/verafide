# Verafide

## Mission

Verafide is a verified, discreet, adult dating app (iOS, Android, web) open to all relationship
statuses, combining Tinder's swipe/match mechanic with Gleeden-style discretion features. It
exists to directly counter the two most-cited 2026 dating-app complaints: fake/bot profiles and
aggressive paywalls. Two invariants make that a mechanism, not marketing copy — see below.

Full product/business plan: `/Users/mohit.upadhyaya/.claude/plans/explore-the-various-dating-cozy-boole.md`.
For the day-to-day task-picking procedure and autonomy boundaries, see
`.claude/skills/daily-backlog-work/SKILL.md`.

## Tech stack

| Layer | Choice |
|---|---|
| Monorepo | pnpm workspaces + Turborepo |
| Mobile | Expo (React Native) + Expo Router, TypeScript |
| Web | Next.js (App Router), TypeScript |
| Backend | Postgres + PostGIS via Supabase (Auth, Storage, Edge Functions, Realtime) |
| Mobile CI/CD | EAS Build + EAS Submit |
| Web hosting | Vercel |
| Hosting target | Deferred to Phase 5 — see `docs/DECISIONS/ADR-0003-hosting.md` once written |

## Repo map

- `apps/mobile` — Expo Router app. Each subdirectory may carry its own `CLAUDE.md`/`AGENTS.md`
  pointing at framework-version-specific docs; read those before touching Expo/RN APIs, since the
  installed SDK version postdates this file's authoring.
- `apps/web` — Next.js App Router app. Same note applies for Next.js APIs.
- `packages/shared-types` — domain types (`Profile`, `VerificationStatus`, `Match`, `Message`,
  the `MONETIZABLE_FEATURES` allowlist). No runtime logic.
- `packages/api-client` — the only place allowed to talk to Supabase directly. Owns the
  client-side cache layer (mobile: `expo-sqlite`/MMKV, web: `IndexedDB`) and pagination helpers.
- `packages/validation` — zod schemas. Single source of truth for input validation; do not
  duplicate validation logic inline in an app.
- `packages/config` — shared `tsconfig.base.json`, `eslint.base.mjs`, `prettier.base.mjs`.
- `supabase/` — `migrations/` (SQL, RLS, PostGIS), `functions/` (Edge Functions), `tests/`
  (pgTAP invariant tests), `seed.sql`.
- `infra/` — added in Phase 5 only if self-hosting is chosen; Docker Compose + backup scripts.
- `docs/` — `BACKLOG.md` (phase snapshot), `ARCHITECTURE.md`, `DECISIONS/` (ADRs),
  `RUNBOOKS/weekly-review.md`, `logs/YYYY-MM-DD.md` (daily agent handoff notes).

## Non-negotiable architecture rules

1. Apps never call Supabase directly for anything `packages/api-client` covers. This is the
   single choke point for propagating a fix (or the verification gate) to both apps at once.
2. Every table exposing user data must have Row Level Security enabled. A migration that creates
   such a table without RLS must not be merged.
3. **Invariant 1 — verification gate.** An unverified profile (`verification_status !=
   "verified"`, see `packages/shared-types/src/verification.ts`) must never be returned by any
   query, RPC, or API route reachable by another user. Enforced by RLS policy plus a passing
   pgTAP test at `supabase/tests/rls_verification_gate.sql`. Any PR touching `profiles` RLS,
   `verification_status`, or the discovery/match query path requires CODEOWNERS review (see
   `.github/CODEOWNERS`) and must not merge if that test doesn't pass.
4. **Invariant 2 — never paywall core.** Browsing, swiping, matching, and in-match messaging are
   never purchase-gated, regardless of which monetization model is eventually chosen. The
   allowlist at `packages/shared-types/src/monetization.ts` (`MONETIZABLE_FEATURES`) is the only
   place that may grant a paywall on anything. It ships empty — adding to it is a human decision
   made at the Phase 4 gate (see `docs/DECISIONS/ADR-0004-monetization.md` once written), not
   something an autonomous run does on its own.
5. **Lightweight-by-default.** New screens/queries use the client-side cache layer and pagination
   helpers in `packages/api-client` rather than re-fetching full datasets. This keeps hosting
   costs low regardless of which Phase 5 hosting option (see ADR-0003) is eventually chosen.

## Coding conventions

- TypeScript strict mode everywhere (`packages/config/tsconfig.base.json`).
- zod schemas in `packages/validation` are the single source of truth for validation shapes.
- Conventional Commits for commit messages.
- Branch naming: `feat|fix|chore/<issue-#>-<slug>`, PR against `main`, branch deleted on merge.
- One backlog issue per PR; PR description includes `Closes #<issue>`.

## How to run locally

```bash
pnpm install
supabase start                    # once supabase/ has migrations (Phase 1+)
pnpm --filter @verafide/mobile dev
pnpm --filter @verafide/web dev
```

Copy `.env.example` to `.env.local` in each app that needs it.

## How to test

```bash
pnpm lint        # turbo run lint
pnpm typecheck    # turbo run typecheck
pnpm test          # turbo run test
supabase test db  # pgTAP invariant tests, once supabase/tests/ exists
```

## Definition of Done

- [ ] Linked issue addressed, PR description includes `Closes #<issue>`
- [ ] Tests added/updated for the change
- [ ] `pnpm lint && pnpm typecheck && pnpm test` green locally
- [ ] Invariant tests (`rls_verification_gate.sql`, `rls_block_report.sql` once it exists)
      untouched, or updated and passing
- [ ] Docs updated if a new table/RPC/ADR-worthy decision was introduced
- [ ] No secrets committed
