import { describe, it, expect } from "vitest";
import {
  isAstriaTuneStillTraining,
  isAstriaTuneTrainingComplete,
} from "@/lib/astria-recover-tune";

describe("astria-recover-tune", () => {
  it("detects completed tune training", () => {
    expect(
      isAstriaTuneTrainingComplete({
        id: 1,
        trained_at: "2026-01-01T00:00:00Z",
      })
    ).toBe(true);
  });

  it("detects in-progress tune training", () => {
    expect(
      isAstriaTuneStillTraining({
        id: 1,
        trained_at: null,
      })
    ).toBe(true);
  });

  it("treats failed tune as not training", () => {
    expect(
      isAstriaTuneStillTraining({
        id: 1,
        status: "failed",
        trained_at: null,
      })
    ).toBe(false);
  });
});
