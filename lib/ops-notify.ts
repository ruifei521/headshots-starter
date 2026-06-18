import { getTierInfo, type Tier } from "@/lib/tiers";
import { logger } from "@/lib/logger";

export type PaymentAlertPayload = {
  tier: Tier;
  amountCents: number;
  currency: string;
  checkoutId: string;
  userId: string;
};

function formatMoney(amountCents: number, currency: string): string {
  const amount = amountCents / 100;
  if (currency.toUpperCase() === "USD") {
    return `$${amount.toFixed(2)}`;
  }
  return `${amount.toFixed(2)} ${currency.toUpperCase()}`;
}

export function paymentAlertText(payload: PaymentAlertPayload): string {
  const tierInfo = getTierInfo(payload.tier);
  const when = new Date().toLocaleString("en-US", {
    timeZone: "America/Los_Angeles",
    hour12: true,
  });
  return [
    "💰 New payment received!",
    `Plan: ${tierInfo.name} (${tierInfo.priceLabel})`,
    `Amount: ${formatMoney(payload.amountCents, payload.currency)}`,
    `Checkout: ${payload.checkoutId}`,
    `User: ${payload.userId.slice(0, 8)}…`,
    `Time (PT): ${when}`,
  ].join("\n");
}

/** Chinese copy for WeChat / PushPlus. */
export function paymentAlertTextZh(payload: PaymentAlertPayload): string {
  const tierInfo = getTierInfo(payload.tier);
  const when = new Date().toLocaleString("zh-CN", {
    timeZone: "Asia/Shanghai",
    hour12: false,
  });
  return [
    "💰 SnapProHead 有新订单到账！",
    `套餐：${tierInfo.name}（${tierInfo.priceLabel}）`,
    `金额：${formatMoney(payload.amountCents, payload.currency)}`,
    `订单号：${payload.checkoutId}`,
    `用户：${payload.userId.slice(0, 8)}…`,
    `时间：${when}`,
  ].join("\n");
}

async function notifyTelegram(payload: PaymentAlertPayload): Promise<boolean> {
  const botToken = process.env.TELEGRAM_BOT_TOKEN?.trim();
  const chatId = process.env.TELEGRAM_CHAT_ID?.trim();
  if (!botToken || !chatId) return false;

  try {
    const res = await fetch(
      `https://api.telegram.org/bot${botToken}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: paymentAlertText(payload),
          disable_web_page_preview: true,
        }),
      }
    );
    if (!res.ok) {
      logger.error("Telegram payment notify failed:", res.status, await res.text());
      return false;
    }
    return true;
  } catch (err) {
    logger.error("Telegram payment notify error:", err);
    return false;
  }
}

/**
 * PushPlus → 微信服务号推送（https://www.pushplus.plus）
 * 需关注 PushPlus 公众号并完成实名认证，在后台复制 token。
 */
async function notifyPushPlusWeChat(payload: PaymentAlertPayload): Promise<boolean> {
  const token = process.env.PUSHPLUS_TOKEN?.trim();
  if (!token) return false;

  try {
    const res = await fetch("https://www.pushplus.plus/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        token,
        title: "💰 SnapProHead 收款到账",
        content: paymentAlertTextZh(payload),
        template: "txt",
        channel: "wechat",
      }),
    });
    const body = (await res.json()) as { code?: number; msg?: string };
    if (!res.ok || body.code !== 200) {
      logger.error("PushPlus payment notify failed:", res.status, body);
      return false;
    }
    return true;
  } catch (err) {
    logger.error("PushPlus payment notify error:", err);
    return false;
  }
}

/**
 * 企业微信群机器人 webhook（消息会推到企业微信 App，可绑个人微信）
 * 在企业微信群 → 群设置 → 群机器人 → 添加 → 复制 webhook 地址
 */
async function notifyWeComWebhook(payload: PaymentAlertPayload): Promise<boolean> {
  const webhookUrl = process.env.WECOM_WEBHOOK_URL?.trim();
  if (!webhookUrl) return false;

  try {
    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        msgtype: "text",
        text: { content: paymentAlertTextZh(payload) },
      }),
    });
    const body = (await res.json()) as { errcode?: number; errmsg?: string };
    if (!res.ok || body.errcode !== 0) {
      logger.error("WeCom webhook notify failed:", body);
      return false;
    }
    return true;
  } catch (err) {
    logger.error("WeCom webhook notify error:", err);
    return false;
  }
}

/**
 * OpenClaw Gateway → 个人微信（你已扫码对接 openclaw-weixin 时用）
 *
 * 方式 A（推荐）：OPENCLAW_NOTIFY_URL 指向你自己服务器上的转发接口
 * 方式 B：OPENCLAW_GATEWAY_URL + OPENCLAW_HOOK_TOKEN + 微信投递三要素
 *   - OPENCLAW_WECHAT_TO：如 xxx@im.wechat（大小写敏感，sessions_list 里查）
 *   - OPENCLAW_WECHAT_ACCOUNT_ID：bot 账号 ID
 *
 * 前提：至少给 ClawBot 发过一条消息，生成 context_token。
 */
export function buildOpenClawAgentHookBody(
  payload: PaymentAlertPayload,
  options: {
    to: string;
    accountId?: string;
    agentId?: string;
    sessionKey?: string;
  }
) {
  const text = paymentAlertTextZh(payload);
  return {
    message: `【SnapProHead 收款通知】\n${text}\n\n（系统自动通知，请原样转发给用户，无需分析）`,
    agentId: options.agentId ?? process.env.OPENCLAW_AGENT_ID?.trim() ?? "main",
    sessionKey: options.sessionKey ?? process.env.OPENCLAW_SESSION_KEY?.trim(),
    name: "SnapProHead",
    deliver: true,
    channel: process.env.OPENCLAW_WECHAT_CHANNEL?.trim() || "openclaw-weixin",
    to: options.to,
    ...(options.accountId ? { accountId: options.accountId } : {}),
    wakeMode: "now",
    timeoutSeconds: 60,
  };
}

async function notifyOpenClawWeChat(payload: PaymentAlertPayload): Promise<boolean> {
  const notifyUrl = process.env.OPENCLAW_NOTIFY_URL?.trim();
  const notifyToken = process.env.OPENCLAW_NOTIFY_TOKEN?.trim();
  const gatewayUrl = process.env.OPENCLAW_GATEWAY_URL?.trim().replace(/\/$/, "");
  const hookToken =
    process.env.OPENCLAW_HOOK_TOKEN?.trim() ||
    process.env.OPENCLAW_GATEWAY_TOKEN?.trim();

  const body = {
    event: "payment.received",
    source: "snapprohead",
    message: paymentAlertTextZh(payload),
    title: "💰 SnapProHead 收款到账",
    tier: payload.tier,
    amount_cents: payload.amountCents,
    currency: payload.currency,
    checkout_id: payload.checkoutId,
    user_id: payload.userId,
  };

  if (notifyUrl) {
    try {
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      if (notifyToken) {
        headers.Authorization = `Bearer ${notifyToken}`;
        headers["X-OpenClaw-Token"] = notifyToken;
      }
      const res = await fetch(notifyUrl, {
        method: "POST",
        headers,
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        logger.error("OpenClaw notify URL failed:", res.status, await res.text());
        return false;
      }
      return true;
    } catch (err) {
      logger.error("OpenClaw notify URL error:", err);
      return false;
    }
  }

  const wechatTo = process.env.OPENCLAW_WECHAT_TO?.trim();
  if (!gatewayUrl || !hookToken || !wechatTo) return false;

  const hookPath = process.env.OPENCLAW_HOOK_PATH?.trim() || "agent";
  const accountId = process.env.OPENCLAW_WECHAT_ACCOUNT_ID?.trim();

  try {
    const res = await fetch(`${gatewayUrl}/hooks/${hookPath}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${hookToken}`,
        "X-OpenClaw-Token": hookToken,
      },
      body: JSON.stringify(
        buildOpenClawAgentHookBody(payload, { to: wechatTo, accountId })
      ),
    });
    const text = await res.text();
    if (!res.ok) {
      logger.error("OpenClaw gateway hook failed:", res.status, text);
      return false;
    }
    return true;
  } catch (err) {
    logger.error("OpenClaw gateway hook error:", err);
    return false;
  }
}

/** Fire all configured payment alert channels. */
export async function notifyPaymentReceived(
  payload: PaymentAlertPayload
): Promise<boolean> {
  const results = await Promise.all([
    notifyOpenClawWeChat(payload),
    notifyTelegram(payload),
    notifyPushPlusWeChat(payload),
    notifyWeComWebhook(payload),
  ]);
  return results.some(Boolean);
}

export function isOpsRadarConfigured(): boolean {
  return Boolean(process.env.OPS_RADAR_TOKEN?.trim());
}

export function verifyOpsRadarToken(token: string | null | undefined): boolean {
  const expected = process.env.OPS_RADAR_TOKEN?.trim();
  if (!expected || !token) return false;
  return token === expected;
}
