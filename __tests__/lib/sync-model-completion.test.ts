import { describe, it, expect } from "vitest";
import { syncModelCompletion, PARTIAL_COMPLETE_IDLE_MIN } from "@/lib/sync-model-completion";

function createMockSupabase(options: {
  imageCount: number;
  updateError?: boolean;
}) {
  const updates: Record<string, unknown>[] = [];

  return {
    updates,
    client: {
      from: (table: string) => {
        if (table === "images") {
          return {
            select: () => ({
              eq: () => Promise.resolve({ count: options.imageCount }),
            }),
          };
        }
        if (table === "models") {
          return {
            update: (payload: Record<string, unknown>) => ({
              eq: () => {
                if (options.updateError) {
                  return Promise.resolve({ error: { message: "fail" } });
                }
                updates.push(payload);
                return Promise.resolve({ error: null });
              },
            }),
          };
        }
        throw new Error(`unexpected table ${table}`);
      },
    } as any,
  };
}

describe("syncModelCompletion", () => {
  const now = Date.now();

  function minutesAgo(min: number): string {
    return new Date(now - min * 60_000).toISOString();
  }

  it("marks full completion when image count meets total", async () => {
    const { client, updates } = createMockSupabase({ imageCount: 40 });

    const result = await syncModelCompletion({
      supabase: client,
      model: {
        id: 1,
        status: "finished",
        total_images: 40,
        created_at: minutesAgo(10),
        images_generated: 38,
      },
    });

    expect(result).toEqual({ action: "completed", imageCount: 40, partial: false });
    expect(updates[0]).toMatchObject({ status: "completed", images_generated: 40 });
  });

  it("marks partial idle models as completed", async () => {
    const { client, updates } = createMockSupabase({ imageCount: 26 });

    const result = await syncModelCompletion({
      supabase: client,
      model: {
        id: 2,
        status: "finished",
        total_images: 40,
        created_at: minutesAgo(PARTIAL_COMPLETE_IDLE_MIN + 5),
        images_generated: 26,
      },
    });

    expect(result).toEqual({ action: "completed", imageCount: 26, partial: true });
    expect(updates[0]?.status).toBe("completed");
  });

  it("syncs counter only for active generation", async () => {
    const { client, updates } = createMockSupabase({ imageCount: 15 });

    const result = await syncModelCompletion({
      supabase: client,
      model: {
        id: 3,
        status: "finished",
        total_images: 40,
        created_at: minutesAgo(10),
        images_generated: 10,
      },
    });

    expect(result).toEqual({ action: "counter", imageCount: 15 });
    expect(updates[0]).toEqual({ images_generated: 15 });
  });

  it("no-ops for completed models", async () => {
    const { client, updates } = createMockSupabase({ imageCount: 40 });

    const result = await syncModelCompletion({
      supabase: client,
      model: {
        id: 4,
        status: "completed",
        total_images: 40,
        created_at: minutesAgo(60),
        images_generated: 40,
      },
    });

    expect(result).toEqual({ action: "none" });
    expect(updates).toHaveLength(0);
  });
});
