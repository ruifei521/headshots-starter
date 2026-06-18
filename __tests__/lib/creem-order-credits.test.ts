import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  fulfillOrderCredits,
  grantPurchaseCredits,
  type OrderRow,
} from "@/lib/creem-order-credits";

function makeOrder(overrides: Partial<OrderRow> = {}): OrderRow {
  return {
    id: 1,
    user_id: "user-123",
    tier: "professional",
    credits_granted: false,
    creem_checkout_id: "chk_abc",
    ...overrides,
  };
}

describe("creem-order-credits", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("grantPurchaseCredits updates existing credits row", async () => {
    const update = vi.fn().mockReturnValue({
      eq: vi.fn().mockResolvedValue({ error: null }),
    });
    const supabase = {
      from: vi.fn((table: string) => {
        if (table === "credits") {
          return {
            select: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                order: vi.fn().mockReturnValue({
                  limit: vi.fn().mockReturnValue({
                    maybeSingle: vi.fn().mockResolvedValue({
                      data: { id: 9, credits: 2, tier: "starter" },
                      error: null,
                    }),
                  }),
                }),
              }),
            }),
            update,
          };
        }
        throw new Error(`Unexpected table ${table}`);
      }),
    };

    const ok = await grantPurchaseCredits(supabase as never, "user-123", "professional");
    expect(ok).toBe(true);
    expect(update).toHaveBeenCalledWith({
      credits: 3,
      tier: "professional",
    });
  });

  it("fulfillOrderCredits skips grant when already marked granted", async () => {
    const supabase = { from: vi.fn() };
    const result = await fulfillOrderCredits(
      supabase as never,
      makeOrder({ credits_granted: true })
    );
    expect(result).toEqual({ fulfilled: true, alreadyGranted: true });
    expect(supabase.from).not.toHaveBeenCalled();
  });

  it("fulfillOrderCredits grants credits and flags order on retry", async () => {
    const orderUpdate = vi.fn().mockReturnValue({
      eq: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            maybeSingle: vi.fn().mockResolvedValue({ data: { id: 1 }, error: null }),
          }),
        }),
      }),
    });

    const supabase = {
      from: vi.fn((table: string) => {
        if (table === "credits") {
          return {
            select: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                order: vi.fn().mockReturnValue({
                  limit: vi.fn().mockReturnValue({
                    maybeSingle: vi.fn().mockResolvedValue({
                      data: null,
                      error: null,
                    }),
                  }),
                }),
              }),
            }),
            insert: vi.fn().mockResolvedValue({ error: null }),
          };
        }
        if (table === "orders") {
          return { update: orderUpdate };
        }
        throw new Error(`Unexpected table ${table}`);
      }),
    };

    const result = await fulfillOrderCredits(supabase as never, makeOrder());
    expect(result).toEqual({ fulfilled: true, alreadyGranted: false });
    expect(orderUpdate).toHaveBeenCalledWith({ credits_granted: true });
  });
});
