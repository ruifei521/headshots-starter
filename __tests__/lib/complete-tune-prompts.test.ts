import { describe, it, expect } from "vitest";
import { ESTIMATED_DELIVERY_MINUTES } from "@/lib/tiers";
import {
  getStaleModelFailureReason,
  STALE_FINISHED_ZERO_MIN,
} from "@/lib/model-stale-reconcile";

describe("complete-tune-prompts stale helpers", () => {
  const now = Date.now();

  function minutesAgo(min: number): string {
    return new Date(now - min * 60_000).toISOString();
  }

  it("does not fail finished-zero models before resubmit window", () => {
    expect(
      getStaleModelFailureReason(
        {
          status: "finished",
          created_at: minutesAgo(STALE_FINISHED_ZERO_MIN + 2),
          modelId: "123",
          total_images: 45,
        },
        0
      )
    ).toBeNull();
  });

  it("fails finished-zero models after extended timeout", () => {
    expect(
      getStaleModelFailureReason(
        {
          status: "finished",
          created_at: minutesAgo(ESTIMATED_DELIVERY_MINUTES + 25),
          modelId: "123",
          total_images: 45,
        },
        0
      )
    ).toBe("stale_timeout");
  });
});
