import { z } from "zod";

/**
 * Single source of truth for profile-shape validation, shared by
 * apps/mobile and apps/web (see CLAUDE.md architecture rule: no duplicate
 * inline validation).
 */
export const relationshipStatusSchema = z.enum([
  "single",
  "in_a_relationship",
  "married",
  "its_complicated",
  "prefer_not_to_say",
]);

export const profileDraftSchema = z.object({
  displayName: z.string().min(1).max(60),
  nickname: z.string().min(1).max(30).nullable(),
  birthdate: z.string().date(),
  relationshipStatus: relationshipStatusSchema,
  bio: z.string().max(500),
  photoUrls: z.array(z.string().url()).min(1).max(6),
});

export type ProfileDraft = z.infer<typeof profileDraftSchema>;
