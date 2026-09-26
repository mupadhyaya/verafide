# Backlog snapshot

Human-readable weekly snapshot of phase status. The operational queue is GitHub Issues + Project
board (labels: `phase:0`-`phase:8`, `priority:P0`-`P3`,
`status:ready-for-agent`/`in-progress`/`needs-human-review`/`blocked`, `area:*`, `type:*`); this
file is updated during the weekly review, not moment-to-moment.

Full phase definitions and exit criteria: see the plan at
`/Users/mohit.upadhyaya/.claude/plans/explore-the-various-dating-cozy-boole.md`.

**Two architecture revisions since Phase 0 shipped** (see the plan's Context section for the
full history — nothing below required redoing Phase 0):
1. Photo storage moved to zero-knowledge client-side encryption (server never reads plaintext);
   literal peer-to-peer "client hosts the data" was evaluated and rejected.
2. Platform rollout resequenced to **web first** — full web product through a closed beta, *then*
   iOS/App Store, *then* Android/Play Store, instead of building all three together. KYC also
   simplified to a single free cloud vendor (Didit) rather than pursuing on-device SDKs now.

## Current phase: 0 — Prototype & de-risk

Goal: stand up the monorepo (done); de-risk KYC, PostGIS performance, and core UX before real
build-out, all on $0 infra.

| Spike | Status |
|---|---|
| Monorepo skeleton (pnpm + Turborepo, apps/mobile, apps/web, packages/*, CI wiring) | ✅ Done |
| Architecture diagram (`docs/diagrams/architecture.drawio`) | ✅ Done |
| KYC vendor spike — sandbox **Didit** (free forever, 500/mo, $0) for the full verification step | Not started — see issue #1 |
| PostGIS performance spike (50-100k seed profiles, p50/p95 with RLS on) | Not started — see issue #2 |
| Content moderation feasibility spike | Not started — see issue #3 |
| Clickable UX prototype (onboarding → verify(mocked) → profile → swipe → match → chat) | Not started — see issue #4 |

**Phase 0 exit criteria:** CI green on `main` (done); KYC vendor (Didit) sandboxed; PostGIS
numbers written down and within budget; prototype walked end-to-end.

## Upcoming phases (see plan for full detail) — Web First

1. **Web** — Auth, verification (Didit), profile, **encrypted media foundation**
   (`packages/api-client/src/crypto`, `encrypted_photos`/`key_grants` schema — Invariants 3 & 4)
2. **Web** — Matching, **browser Geolocation API → PostGIS**, swipe/like, **public/private
   albums + view-duration policy**
3. **Web** — Chat & safety (block/report), hybrid moderation pipeline + report-triggered key
   escrow, **web leak-deterrence** (right-click/drag disabled, per-viewer watermarking — real
   screenshot-blocking isn't possible in a browser, see plan's Platform Rollout Sequencing)
4. **Web — Closed Beta.** Invite-gated, 50-150 person seeded cohort in one city. Hosting decision
   happens here (Vercel + Supabase free tier, $0) — see plan's Beta Program Plan for full mechanics
5. **Web — Public Launch + Monetization.** Open signups once GTM's density threshold is hit;
   monetization model decision made from real beta data
6. **iOS port + App Store.** `apps/mobile` work resumes here (paused since Phase 0); TestFlight
   beta first, then App Store submission
7. **Android port + Play Store.** Same Expo codebase; Play's mandatory 12-tester/14-day closed
   testing track, then submission
8. **Post-launch, multi-platform, city-by-city expansion**

**Headline timeline (see plan for full breakdown):** live web beta in ~2-3.5 months from now;
full web+iOS+Android public launch in ~6-10 months from now.
