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
| Architecture diagram (`docs/diagrams/architecture.drawio`) | ✅ Done |
| KYC/liveness vendor spike — broadened: (a) on-device SDK (FaceOnLive/FacePlugin), (b) **free** document-check vendor (Didit, 500/mo free forever) | Not started — see issue #1 |
| PostGIS performance spike (50-100k seed profiles, p50/p95 with RLS on) | Not started — see issue #2 |
| Content moderation feasibility spike | Not started — see issue #3 |
| Clickable UX prototype (onboarding → verify(mocked) → profile → swipe → match → chat) | Not started — see issue #4 |

**Phase 0 exit criteria:** CI green on `main`; KYC vendor chosen/shortlisted with a decision
date; PostGIS numbers written down and within budget; prototype walked end-to-end.

**Architecture revision (see plan's "Privacy-First Media & Verification Architecture"):** after
Phase 0's monorepo landed, the plan was revised toward on-device verification and zero-knowledge
encrypted photo storage instead of server-stored plaintext images — literal peer-to-peer
"client hosts the data" was evaluated and rejected (iOS background-execution limits, TURN relay
cost, availability). Phases 1-3 below absorb this; nothing in Phase 0 needed to be redone.

## Upcoming phases (see plan for full detail)

1. Auth, verification, profile, **encrypted media foundation** (on-device liveness/face-match,
   client-side photo encryption pipeline, `encrypted_photos`/`key_grants` schema — Invariants 3 & 4)
2. Matching, PostGIS geo, swipe/like flow, **public/private albums + view-duration policy**
3. Chat & safety (block/report), **hybrid moderation pipeline + report-triggered key escrow**,
   **screenshot guard** (Android `FLAG_SECURE`, iOS secure-layer block)
4. Monetization & GTM instrumentation — monetization model decision made here, not before
5. Polish, hosting decision, store submission, beta, launch
6. Post-launch, city-by-city expansion
