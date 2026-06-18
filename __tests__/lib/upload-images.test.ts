import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { uploadTrainingImages } from "@/lib/upload-images";

describe("uploadTrainingImages", () => {
  beforeEach(() => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => ({
        ok: true,
        json: async () => ({ url: "https://example.com/photo.jpg" }),
      }))
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("uploads all files with limited concurrency", async () => {
    const files = Array.from({ length: 5 }, (_, i) => ({
      file: new File(["x"], `photo-${i}.jpg`, { type: "image/jpeg" }),
    }));

    const urls = await uploadTrainingImages(files, { concurrency: 2 });
    expect(urls).toHaveLength(5);
    expect(fetch).toHaveBeenCalledTimes(5);
  });

  it("retries failed uploads", async () => {
    let attempts = 0;
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => {
        attempts += 1;
        if (attempts === 1) {
          return { ok: false, json: async () => ({ error: "fail" }) };
        }
        return {
          ok: true,
          json: async () => ({ url: "https://example.com/ok.jpg" }),
        };
      })
    );

    const urls = await uploadTrainingImages(
      [{ file: new File(["x"], "a.jpg", { type: "image/jpeg" }) }],
      { maxRetries: 1 }
    );
    expect(urls[0]).toBe("https://example.com/ok.jpg");
    expect(attempts).toBe(2);
  });
});
