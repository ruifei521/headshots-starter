import { Resend } from "resend";
import { logger } from "@/lib/logger";

const SITE_URL = "https://snapprohead.com";
const SUPPORT_EMAIL = "contact@snapprohead.com";

function getResendClient(): Resend | null {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return null;
  return new Resend(apiKey);
}

/** Verified domain sender; override via RESEND_FROM_EMAIL if needed. */
export function getResendFromAddress(): string {
  return process.env.RESEND_FROM_EMAIL || `SnapProHead <${SUPPORT_EMAIL}>`;
}

function emailShell(title: string, bodyHtml: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:32px 16px;">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e4e4e7;">
        <tr><td style="background:#2563eb;padding:24px 32px;">
          <p style="margin:0;color:#ffffff;font-size:20px;font-weight:700;">SnapProHead</p>
        </td></tr>
        <tr><td style="padding:32px;">
          <h1 style="margin:0 0 16px;font-size:22px;color:#18181b;">${title}</h1>
          ${bodyHtml}
        </td></tr>
        <tr><td style="padding:0 32px 32px;">
          <p style="margin:0;font-size:12px;color:#71717a;line-height:1.6;">
            Questions? Reply to this email or write to
            <a href="mailto:${SUPPORT_EMAIL}" style="color:#2563eb;">${SUPPORT_EMAIL}</a>.
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function ctaButton(href: string, label: string): string {
  return `<p style="margin:24px 0 0;text-align:center;">
    <a href="${href}" style="display:inline-block;background:#2563eb;color:#ffffff;text-decoration:none;font-weight:600;padding:14px 28px;border-radius:8px;font-size:15px;">${label}</a>
  </p>`;
}

const TRAINING_PROGRESS_EMAIL_LINE =
  "You can close this page — we'll email you when training finishes (headshots ready, or next steps if something goes wrong).";

/** Shorter variant for toasts and redirect messages. */
export const TRAINING_FINISH_EMAIL_SHORT =
  "We'll email you when training finishes";

/** Shared copy for in-app training progress banners and upload toasts. */
export function trainingProgressEmailHint(): string {
  return TRAINING_PROGRESS_EMAIL_LINE;
}

/** Sent when all headshots for a model are generated. */
export async function sendHeadshotsReadyEmail(params: {
  to: string;
  modelId: number;
  modelName?: string | null;
  imageCount: number;
}): Promise<boolean> {
  const resend = getResendClient();
  if (!resend || !params.to) return false;

  const name = params.modelName?.trim() || "your headshots";
  const resultsUrl = `${SITE_URL}/overview/models/${params.modelId}`;
  const html = emailShell(
    "Your AI headshots are ready!",
    `<p style="margin:0 0 12px;color:#3f3f46;line-height:1.6;font-size:15px;">
      Great news — <strong>${params.imageCount} professional headshots</strong> for
      <strong>${name}</strong> are ready to view and download.
    </p>
    <p style="margin:0;color:#3f3f46;line-height:1.6;font-size:15px;">
      Open your results page to preview every photo, pick your favorites for LinkedIn,
      and download them all as a ZIP in one click.
    </p>
    ${ctaButton(resultsUrl, "View my headshots")}`
  );

  try {
    const { error } = await resend.emails.send({
      from: getResendFromAddress(),
      to: params.to,
      reply_to: SUPPORT_EMAIL,
      subject: `Your ${params.imageCount} AI headshots are ready — SnapProHead`,
      html,
    });
    if (error) {
      logger.error("sendHeadshotsReadyEmail failed:", error);
      return false;
    }
    return true;
  } catch (err) {
    logger.error("sendHeadshotsReadyEmail error:", err);
    return false;
  }
}

/** Sent when Astria training or prompt submission fails before headshots are ready. */
export async function sendTrainingFailedEmail(params: {
  to: string;
  modelId: number;
  modelName?: string | null;
  reason?: "astria_training" | "prompt_submit" | "stale_timeout" | "partial_generation";
}): Promise<boolean> {
  const resend = getResendClient();
  if (!resend || !params.to) return false;

  const name = params.modelName?.trim() || "your headshots";
  const retryUrl = `${SITE_URL}/overview`;
  const supportLine =
    params.reason === "stale_timeout"
      ? "Training took longer than expected and was stopped automatically."
      : params.reason === "partial_generation"
        ? "Only part of your headshot set was generated before the job stopped."
        : "The AI training step did not complete successfully.";

  const html = emailShell(
    "We couldn't finish your AI headshots",
    `<p style="margin:0 0 12px;color:#3f3f46;line-height:1.6;font-size:15px;">
      ${supportLine} Your credit for <strong>${name}</strong> has been returned so you can try again.
    </p>
    <p style="margin:0;color:#3f3f46;line-height:1.6;font-size:15px;">
      Upload 4–10 clear, well-lit selfies with different angles. Avoid group photos, heavy filters, or sunglasses.
    </p>
    ${ctaButton(retryUrl, "Go to your dashboard")}`
  );

  try {
    const { error } = await resend.emails.send({
      from: getResendFromAddress(),
      to: params.to,
      reply_to: SUPPORT_EMAIL,
      subject: "SnapProHead — training didn't finish (credit returned)",
      html,
    });
    if (error) {
      logger.error("sendTrainingFailedEmail failed:", error);
      return false;
    }
    return true;
  } catch (err) {
    logger.error("sendTrainingFailedEmail error:", err);
    return false;
  }
}
