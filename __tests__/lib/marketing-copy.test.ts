import { describe, expect, it } from "vitest";
import {
  HEADSHOT_PROFESSION_COUNT,
  STUDIO_PHOTOGRAPH_AVERAGE_USD,
  percentCheaperThanStudio,
} from "@/lib/marketing-copy";

describe("marketing-copy", () => {
  it("uses a single studio price anchor", () => {
    expect(STUDIO_PHOTOGRAPH_AVERAGE_USD).toBe(232);
  });

  it("matches profession landing page count", () => {
    expect(HEADSHOT_PROFESSION_COUNT).toBe(21);
  });

  it("computes starter pack savings vs studio average", () => {
    expect(percentCheaperThanStudio(29)).toBe(88);
  });
});
