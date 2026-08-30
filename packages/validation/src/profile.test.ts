import { describe, expect, it } from "vitest";
import { profileDraftSchema } from "./profile";

describe("profileDraftSchema", () => {
  it("accepts a valid profile draft", () => {
    const result = profileDraftSchema.safeParse({
      displayName: "Alex",
      nickname: "A.",
      birthdate: "1995-05-01",
      relationshipStatus: "single",
      bio: "Hi there.",
      photoUrls: ["https://example.com/photo.jpg"],
    });

    expect(result.success).toBe(true);
  });

  it("rejects a draft with no photos", () => {
    const result = profileDraftSchema.safeParse({
      displayName: "Alex",
      nickname: null,
      birthdate: "1995-05-01",
      relationshipStatus: "single",
      bio: "Hi there.",
      photoUrls: [],
    });

    expect(result.success).toBe(false);
  });

  it("rejects an invalid relationshipStatus", () => {
    const result = profileDraftSchema.safeParse({
      displayName: "Alex",
      nickname: null,
      birthdate: "1995-05-01",
      relationshipStatus: "married_but_secret",
      bio: "Hi there.",
      photoUrls: ["https://example.com/photo.jpg"],
    });

    expect(result.success).toBe(false);
  });
});
