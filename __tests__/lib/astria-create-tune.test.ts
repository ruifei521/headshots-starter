import { describe, it, expect } from "vitest";
import { buildAstriaTuneTitle } from "@/lib/astria-create-tune";

describe("buildAstriaTuneTitle", () => {
  it("embeds model id for Astria title idempotency", () => {
    expect(buildAstriaTuneTitle("LinkedIn 2026", 42)).toBe(
      "LinkedIn 2026 — snapprohead-42"
    );
  });

  it("trims model name whitespace", () => {
    expect(buildAstriaTuneTitle("  Jane  ", 7)).toBe("Jane — snapprohead-7");
  });
});
