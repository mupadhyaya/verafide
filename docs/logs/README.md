# Daily agent handoff logs

One file per day worked, `YYYY-MM-DD.md`, appended by the end-of-day handoff step in
`.claude/skills/daily-backlog-work/SKILL.md`. Keeps the weekly review
(`docs/RUNBOOKS/weekly-review.md`) starting warm instead of cold.

Format per entry:

```markdown
## YYYY-MM-DD

- Picked up: #12, #14
- Opened: #12 (merged), #14 (needs human review — touches RLS on `profiles`)
- Blockers: none
```
