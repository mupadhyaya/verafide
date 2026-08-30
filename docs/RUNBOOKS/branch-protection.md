# Branch protection setup for `main`

Applied once via `gh api` (or GitHub UI → Settings → Branches) after the first push, since the
branch and its check names need to exist first. Re-apply if the repo is ever recreated.

Required settings (matches the GitHub Workflow section of the plan):

- Require a pull request before merging; require branches to be up to date before merging.
- Required status checks (from `.github/workflows/ci.yml`): `install`, `lint`, `typecheck`,
  `test`, `db-migrations-check`, `rls-invariant-tests`.
- Require review from Code Owners (`.github/CODEOWNERS`) — this is what makes the
  autonomous-vs-escalate matrix in `.claude/skills/daily-backlog-work/SKILL.md` actually
  enforced rather than a convention someone has to remember.
- No force pushes, no branch deletion, on `main`.

Applied via:

```bash
gh api repos/mupadhyaya/verafide/branches/main/protection \
  --method PUT \
  -f required_status_checks[strict]=true \
  -f 'required_status_checks[contexts][]=install' \
  -f 'required_status_checks[contexts][]=lint' \
  -f 'required_status_checks[contexts][]=typecheck' \
  -f 'required_status_checks[contexts][]=test' \
  -f 'required_status_checks[contexts][]=db-migrations-check' \
  -f 'required_status_checks[contexts][]=rls-invariant-tests' \
  -f enforce_admins=false \
  -f required_pull_request_reviews[require_code_owner_reviews]=true \
  -f required_pull_request_reviews[required_approving_review_count]=1 \
  -f restrictions=null \
  -f allow_force_pushes=false \
  -f allow_deletions=false
```

`enforce_admins=false` so the founder (repo admin) can still push directly in an emergency;
tighten to `true` once the daily-agent workflow is proven out and PRs are the only path in
practice.
