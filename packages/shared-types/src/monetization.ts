/**
 * Invariant 2 (see CLAUDE.md): core features are never purchase-gated.
 * This allowlist is the ONLY place that may grant a paywall. Adding to it is
 * a human decision (Phase 4 monetization gate), not something an autonomous
 * agent run should do on its own — see .claude/skills/daily-backlog-work/SKILL.md.
 *
 * Empty until the Phase 4 monetization model is chosen (freemium+boosts vs.
 * Gleeden-style asymmetric/credit-based — see docs/DECISIONS/ADR-0004).
 */
export const MONETIZABLE_FEATURES = [] as const;

export type MonetizableFeature = (typeof MONETIZABLE_FEATURES)[number];

export function isMonetizable(feature: string): feature is MonetizableFeature {
  return (MONETIZABLE_FEATURES as readonly string[]).includes(feature);
}
