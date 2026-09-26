# Branch protection setup for `main`

**Status: applied (2026-09-26).** The repo is public. The founder explicitly does not want a
PR-required workflow — no time to manage reviews — so this is deliberately lighter than a typical
team setup: **direct commits/merges to `main` are allowed, by design.**

**What actually guarantees "no one but the founder can change the code":** the collaborator list,
not branch protection. GitHub repos — public or private — only grant push access to explicitly
added collaborators; this repo has exactly one (`mupadhyaya`, admin). Outsiders on a public repo
can fork and open a PR, but merging that PR still requires someone with write access to click
merge — nothing here can bypass that. Branch protection settings below are a safety net against
*accidental* mistakes (a stray force-push or branch deletion), not an access-control mechanism —
access control is already fully handled by the collaborator list being just one person.

Applied settings, deliberately minimal:

```bash
gh api repos/mupadhyaya/verafide/branches/main/protection \
  --method PUT \
  -F "required_status_checks=null" \
  -F "enforce_admins=false" \
  -F "required_pull_request_reviews=null" \
  -F "restrictions=null" \
  -F "allow_force_pushes=false" \
  -F "allow_deletions=false" \
  -F "lock_branch=false"
```

- `required_pull_request_reviews=null` — **no PR required**; direct pushes to `main` are allowed.
- `required_status_checks=null` — not set, since required status checks are a PR-merge-time gate
  and are largely inert without a PR requirement. `ci.yml` still runs on every push to `main` and
  reports pass/fail — visibility without a hard gate.
- `allow_force_pushes=false`, `allow_deletions=false` — the actual protection this buys: `main`
  can't be accidentally force-pushed over or deleted, by anyone including the owner via a stray
  command.

If a PR-required workflow is ever wanted later (e.g. if a second contributor joins), re-apply with
`required_pull_request_reviews` and `required_status_checks` set — see git history of this file
for the previous (unapplied, PR-based) version of this config as a reference.
