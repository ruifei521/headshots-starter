import * as crypto from "crypto";
import { getWebhookBaseUrl } from "@/lib/webhook-base-url";

export function generateAstriaWebhookToken(
  userId: string,
  modelId: number
): string | null {
  const secret = process.env.APP_WEBHOOK_SECRET;
  if (!secret) return null;
  return crypto
    .createHmac("sha256", secret)
    .update(`${userId}:${modelId}`)
    .digest("hex");
}

export function buildTrainWebhookUrl(userId: string, modelId: number): string {
  const baseUrl = getWebhookBaseUrl();
  const token = generateAstriaWebhookToken(userId, modelId);
  const base = `${baseUrl}/astria/train-webhook?user_id=${userId}&model_id=${modelId}`;
  return token ? `${base}&webhook_token=${token}` : base;
}

export function buildPromptWebhookUrl(userId: string, modelId: number): string {
  const baseUrl = getWebhookBaseUrl();
  const token = generateAstriaWebhookToken(userId, modelId);
  const base = `${baseUrl}/astria/prompt-webhook?user_id=${userId}&model_id=${modelId}`;
  return token ? `${base}&webhook_token=${token}` : base;
}
