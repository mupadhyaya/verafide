---
name: daily-backlog-work
description: Procedure for autonomously picking up and completing the next backlog task in the Verafide repo; defines what can proceed without human review and what must be flagged. Use at the start of a daily autonomous work session on this repo.
---

# Daily backlog work

This is the recurring procedure for a daily autonomous work session on Verafide, under the
hybrid working model in `CLAUDE.md`: most days run unattended against a scoped backlog; the
founder does a weekly review (`docs/RUNBOOKS/weekly-review.md`) to clear anything flagged here.

## 1. Task selection

1. Pull open GitHub Issues labeled `status:ready-for-agent`.
2. Sort by `priority:P0` > `P1` > `P2` > `P3`, then by the current phase (`phase:N` matching
   `docs/BACKLOG.md`'s current phase).
3. Skip any issue whose "blocked by" linked issue is still open.
4. If nothing is ready, say so explicitly in the end-of-day log (step 5) rather than inventing
   work or picking something out of scope for the current phase.

## 2. Branch / PR convention

- Branch: `feat|fix|chore/<issue-#>-<slug>`.
- PR description includes `Closes #<issue>`.
- PR body states which invariants (if any — see `CLAUDE.md`) were touched, and confirms the
  relevant tests still pass.

## 3. Autonomous vs. escalate

Always escalate — open the PR, do **not** self-merge even if CI is green, and leave a comment
tagging the founder — when the change touches any of:

- A path matched by `.github/CODEOWNERS` (migrations, verification/moderation Edge Functions,
  `packages/validation/src/verification/`, `**/billing/**`, `**/payments/**`, `infra/`,
  `.github/workflows/`, `CLAUDE.md`, `.claude/`, `eas.json`).
- Any RLS policy on `profiles`, `verification_attempts`, `matches`, `messages`, `blocks`, or
  `reports`.
- The `MONETIZABLE_FEATURES` allowlist in `packages/shared-types/src/monetization.ts`.
- A new third-party vendor credential or API key.
- Requirements that are ambiguous or under-specified in the linked issue.
- A migration that drops or renames a column/table containing user data.

Everything else can proceed to a normal PR; PRs outside CODEOWNERS-protected paths may auto-merge
once required CI checks pass (this is what makes daily autonomy real — see `CLAUDE.md`'s
branch-protection description). If a PR is queued for human review, move on to the next
`status:ready-for-agent` issue rather than blocking on it.

## 4. Guardrail-as-test rule

Before opening a PR, run the invariant test suite (`supabase test db` plus the relevant
`pnpm test` targets). If a change could plausibly affect the verification-gate or
never-paywall-core invariant and no test yet covers the specific case touched, **write the test
first, then the code.** Don't ship an invariant-adjacent change backed only by manual reasoning.

## 5. End-of-day handoff

Append a short entry to `docs/logs/YYYY-MM-DD.md`:

- Tasks picked up, PRs opened/merged.
- Anything flagged for human review (and why).
- Blockers discovered.
- If nothing was ready to work (step 1.4), say so here instead of leaving the day unlogged.

This keeps the weekly review starting warm instead of cold.
