import { describe, it, expect } from "vitest";
import { isAstriaTuneFailure } from "@/lib/training-failure";

describe("training-failure", () => {
  describe("isAstriaTuneFailure", () => {
    it("detects explicit error string on tune", () => {
      expect(isAstriaTuneFailure({ error: "Training failed" })).toBe(true);
    });

    it("detects failed status", () => {
      expect(isAstriaTuneFailure({ status: "failed", id: 1 })).toBe(true);
    });

    it("treats successful tune payload as not failed", () => {
      expect(
        isAstriaTuneFailure({
          id: 1,
          trained_at: "2026-01-01T00:00:00Z",
          status: "completed",
        })
      ).toBe(false);
    });

    it("ignores blank error strings", () => {
      expect(isAstriaTuneFailure({ error: "   " })).toBe(false);
    });
  });
});
