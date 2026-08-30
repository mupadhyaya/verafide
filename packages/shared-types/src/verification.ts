/**
 * Invariant 1 (see CLAUDE.md): a profile is only ever visible to other users
 * when verification_status === "verified". This type exists so that check is
 * expressed once and reused everywhere, instead of re-derived per call site.
 */
export type VerificationStatus = "unverified" | "pending" | "verified" | "rejected";

export interface VerificationAttempt {
  id: string;
  userId: string;
  vendor: string;
  status: VerificationStatus;
  deepfakeCheckPassed: boolean | null;
  createdAt: string;
  updatedAt: string;
}

export function isVisibleToOthers(status: VerificationStatus): boolean {
  return status === "verified";
}
