import type { VerificationStatus } from "./verification";

export type RelationshipStatus =
  | "single"
  | "in_a_relationship"
  | "married"
  | "its_complicated"
  | "prefer_not_to_say";

export interface DiscretionSettings {
  nicknameOnly: boolean;
  photosHidden: boolean;
  panicExitEnabled: boolean;
}

export interface Profile {
  id: string;
  userId: string;
  displayName: string;
  nickname: string | null;
  birthdate: string;
  relationshipStatus: RelationshipStatus;
  bio: string;
  photoUrls: string[];
  location: { lat: number; lng: number } | null;
  verificationStatus: VerificationStatus;
  discretion: DiscretionSettings;
  createdAt: string;
  updatedAt: string;
}
