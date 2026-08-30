# Backlog snapshot

Human-readable weekly snapshot of phase status. The operational queue is GitHub Issues + Project
board (labels: `phase:0`-`phase:6`, `priority:P0`-`P3`,
`status:ready-for-agent`/`in-progress`/`needs-human-review`/`blocked`, `area:*`, `type:*`); this
file is updated during the weekly review, not moment-to-moment.

Full phase definitions and exit criteria: see the plan at
`/Users/mohit.upadhyaya/.claude/plans/explore-the-various-dating-cozy-boole.md`.

## Current phase: 0 — Prototype & de-risk

Goal: stand up the monorepo (done — see below); de-risk the KYC vendor choice, PostGIS query
performance, and core UX before real build-out, all on $0 infra.

| Spike | Status |
|---|---|
| Monorepo skeleton (pnpm + Turborepo, apps/mobile, apps/web, packages/*, CI wiring) | ✅ Done |
| KYC/liveness vendor spike (sandbox 2 vendors, deepfake coverage, cost) | Not started |
| PostGIS performance spike (50-100k seed profiles, p50/p95 with RLS on) | Not started |
| Content moderation feasibility spike | Not started |
| Clickable UX prototype (onboarding → verify(mocked) → profile → swipe → match → chat) | Not started |

**Phase 0 exit criteria:** CI green on `main`; KYC vendor chosen/shortlisted with a decision
date; PostGIS numbers written down and within budget; prototype walked end-to-end.

## Upcoming phases (see plan for full detail)

1. Auth, verification, profile
2. Matching, PostGIS geo, swipe/like flow
3. Chat & safety (block/report)
4. Monetization & GTM instrumentation — monetization model decision made here, not before
5. Polish, hosting decision, store submission, beta, launch
6. Post-launch, city-by-city expansion
