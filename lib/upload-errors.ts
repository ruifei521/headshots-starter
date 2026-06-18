/** User-facing hints when photo upload or training start fails. */
export function getUploadErrorHints(message: string, statusCode?: number): string[] {
  const msg = message.toLowerCase();
  const hints: string[] = [];

  if (statusCode === 401 || msg.includes("unauthorized")) {
    hints.push("Your session may have expired — sign in again and retry.");
  } else if (
    statusCode === 413 ||
    msg.includes("413") ||
    msg.includes("payload too large") ||
    msg.includes("request entity too large") ||
    msg.includes("content too large")
  ) {
    hints.push(
      "One photo was too large for upload even after optimization — remove it and try a smaller JPG or a different browser (Chrome/Safari)."
    );
    hints.push("Large iPhone photos are auto-compressed; if this keeps happening, re-save the image or pick a different photo.");
  } else if (msg.includes("file type") || msg.includes("not allowed")) {
    hints.push("Use PNG, JPG, WEBP, or HEIC photos only.");
  } else if (msg.includes("size") || msg.includes("120mb") || msg.includes("exceeds")) {
    hints.push("Each file must be under 120MB before optimization. Try fewer or smaller photos.");
  } else if (msg.includes("network") || msg.includes("failed to fetch") || msg.includes("timeout")) {
    hints.push("Check your internet connection and try again.");
  } else if (msg.includes("no file")) {
    hints.push("Select at least 4 clear selfies before starting.");
  } else if (msg.includes("too large after optimization")) {
    hints.push("Replace the flagged photo with a smaller JPG or take a new selfie in good lighting.");
  } else {
    hints.push("Try fewer photos, smaller files, or a different browser.");
  }

  hints.push("Still stuck? Email contact@snapprohead.com with a screenshot.");
  return hints;
}
