import { describe, expect, it } from "vitest";
import {
  PHOTOS_FAQ_ANSWER,
  TIER_PRIVACY_FEATURE,
  TRAIN_CONSENT_GENERATED_LINE,
  TRAIN_CONSENT_UPLOAD_LINE,
} from "@/lib/data-retention-policy";

describe("data-retention-policy", () => {
  it("does not promise automatic timed deletion", () => {
    const copy = [
      PHOTOS_FAQ_ANSWER,
      TIER_PRIVACY_FEATURE,
      TRAIN_CONSENT_UPLOAD_LINE,
      TRAIN_CONSENT_GENERATED_LINE,
    ].join(" ");

    expect(copy.toLowerCase()).not.toContain("automatically deleted");
    expect(copy.toLowerCase()).not.toContain("auto-delete");
    expect(copy.toLowerCase()).not.toContain("30 days, then");
  });

  it("mentions deletion on request", () => {
    expect(PHOTOS_FAQ_ANSWER.toLowerCase()).toContain("on request");
  });
});
