import { describe, it, expect } from "vitest";
import {
  IOS_BATCH_SIZE,
  MOBILE_BATCH_SIZE,
  resolveMobileBatchSize,
} from "@/lib/headshot-download";

describe("headshot-download", () => {
  it("uses smaller batches on iOS mobile", () => {
    expect(resolveMobileBatchSize(true)).toBe(MOBILE_BATCH_SIZE);
  });

  it("uses desktop threshold when not mobile", () => {
    expect(resolveMobileBatchSize(false)).toBe(25);
  });

  it("iOS batch size is 10", () => {
    expect(IOS_BATCH_SIZE).toBe(10);
  });
});
