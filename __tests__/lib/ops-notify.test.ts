import { describe, it, expect } from "vitest";
import { paymentAlertText, paymentAlertTextZh, buildOpenClawAgentHookBody } from "@/lib/ops-notify";

describe("ops-notify", () => {
  const payload = {
    tier: "professional" as const,
    amountCents: 3900,
    currency: "USD",
    checkoutId: "chk_test_123",
    userId: "00000000-0000-0000-0000-000000000099",
  };

  it("paymentAlertText includes tier and amount", () => {
    const text = paymentAlertText(payload);
    expect(text).toContain("New payment received");
    expect(text).toContain("Professional");
    expect(text).toContain("$39.00");
    expect(text).toContain("chk_test_123");
  });

  it("paymentAlertTextZh includes Chinese copy", () => {
    const text = paymentAlertTextZh(payload);
    expect(text).toContain("有新订单到账");
    expect(text).toContain("Professional");
    expect(text).toContain("$39.00");
  });

  it("buildOpenClawAgentHookBody targets weixin delivery", () => {
    const body = buildOpenClawAgentHookBody(payload, {
      to: "AbCdEf@im.wechat",
      accountId: "bot-123",
    });
    expect(body.deliver).toBe(true);
    expect(body.channel).toBe("openclaw-weixin");
    expect(body.to).toBe("AbCdEf@im.wechat");
    expect(body.accountId).toBe("bot-123");
    expect(body.message).toContain("SnapProHead");
  });
});
