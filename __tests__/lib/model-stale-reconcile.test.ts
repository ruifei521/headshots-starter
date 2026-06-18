import { describe, it, expect } from "vitest";
import {
  getStaleModelFailureReason,
  modelAgeMinutes,
  STALE_FINISHED_PARTIAL_MIN,
  STALE_PROCESSING_MIN,
  STALE_PROCESSING_WITH_TUNE_MIN,
} from "@/lib/model-stale-reconcile";

describe("model-stale-reconcile", () => {
  const now = Date.now();

  function minutesAgo(min: number): string {
    return new Date(now - min * 60_000).toISOString();
  }

  it("modelAgeMinutes calculates elapsed minutes", () => {
    expect(modelAgeMinutes(minutesAgo(30))).toBeGreaterThanOrEqual(29);
    expect(modelAgeMinutes(minutesAgo(30))).toBeLessThan(31);
  });

  it("flags processing without tune after timeout", () => {
    expect(
      getStaleModelFailureReason(
        {
          status: "processing",
          created_at: minutesAgo(STALE_PROCESSING_MIN + 5),
          modelId: null,
          total_images: 40,
        },
        0
      )
    ).toBe("stale_timeout");
  });

  it("flags processing with tune after webhook timeout", () => {
    expect(
      getStaleModelFailureReason(
        {
          status: "processing",
          created_at: minutesAgo(STALE_PROCESSING_WITH_TUNE_MIN + 5),
          modelId: "999",
          total_images: 40,
        },
        0
      )
    ).toBe("stale_timeout");
  });

  it("ignores processing with tune while still within delivery window", () => {
    expect(
      getStaleModelFailureReason(
        {
          status: "processing",
          created_at: minutesAgo(30),
          modelId: "999",
          total_images: 40,
        },
        0
      )
    ).toBeNull();
  });

  it("flags finished partial generation after timeout", () => {
    expect(
      getStaleModelFailureReason(
        {
          status: "finished",
          created_at: minutesAgo(STALE_FINISHED_PARTIAL_MIN + 10),
          modelId: "123",
          total_images: 45,
        },
        10
      )
    ).toBe("partial_generation");
  });

  it("ignores recently finished models still generating", () => {
    expect(
      getStaleModelFailureReason(
        {
          status: "finished",
          created_at: minutesAgo(20),
          modelId: "123",
          total_images: 45,
        },
        10
      )
    ).toBeNull();
  });
});
