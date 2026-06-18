import { describe, it, expect } from "vitest";
import { isChunkLoadError } from "@/lib/chunk-error";

describe("isChunkLoadError", () => {
  it("detects webpack chunk errors", () => {
    expect(
      isChunkLoadError(new Error("Loading chunk 123 failed"))
    ).toBe(true);
  });

  it("detects dynamic import failures", () => {
    expect(
      isChunkLoadError(
        new Error("Failed to fetch dynamically imported module: https://example.com/_next/static/chunks/foo.js")
      )
    ).toBe(true);
  });

  it("ignores normal errors", () => {
    expect(isChunkLoadError(new Error("useFormField should be used within FormField"))).toBe(false);
  });
});

describe("isDomReconciliationError", () => {
  it("detects removeChild failures", async () => {
    const { isDomReconciliationError, isRecoverableClientError } = await import("@/lib/chunk-error");
    const err = new Error(
      "Failed to execute 'removeChild' on 'Node': The node to be removed is not a child of this node."
    );
    expect(isDomReconciliationError(err)).toBe(true);
    expect(isRecoverableClientError(err)).toBe(true);
  });
});
