/** Mobile / iOS-aware download helpers for the results gallery. */

export const IOS_BATCH_SIZE = 10;
export const MOBILE_BATCH_SIZE = 15;
export const DESKTOP_BATCH_THRESHOLD = 25;

export function isIosDevice(): boolean {
  if (typeof navigator === "undefined") return false;
  return (
    /iPad|iPhone|iPod/i.test(navigator.userAgent) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)
  );
}

/** Coarse pointer, narrow viewport, or touch — recomputed on resize / orientation. */
export function isMobileDownloadContext(): boolean {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(max-width: 767px)").matches ||
    window.matchMedia("(pointer: coarse)").matches ||
    "ontouchstart" in window
  );
}

/** Narrow phone/tablet portrait or iOS — use batch ZIP instead of one huge archive. */
export function shouldPreferBatchDownload(): boolean {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(max-width: 767px)").matches || isIosDevice()
  );
}

export function resolveMobileBatchSize(
  preferBatch = shouldPreferBatchDownload()
): number {
  if (!preferBatch) return DESKTOP_BATCH_THRESHOLD;
  return isIosDevice() ? IOS_BATCH_SIZE : MOBILE_BATCH_SIZE;
}

export type SaveBlobResult = "shared" | "downloaded" | "cancelled";

/**
 * Save a blob on device. On iOS / mobile, prefers the native Share sheet (Save to Files, etc.).
 * Falls back to <a download> when Share is unavailable (desktop Chrome still uses picker elsewhere).
 */
export async function saveBlobToDevice(
  blob: Blob,
  filename: string,
  options?: { preferShare?: boolean }
): Promise<SaveBlobResult> {
  if (typeof window === "undefined") return "downloaded";

  const preferShare = options?.preferShare ?? isMobileDownloadContext();
  const mime = blob.type || "application/octet-stream";

  if (preferShare && typeof navigator !== "undefined" && "share" in navigator) {
    try {
      const file = new File([blob], filename, { type: mime });
      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], title: filename });
        return "shared";
      }
    } catch (err) {
      if ((err as DOMException)?.name === "AbortError") return "cancelled";
    }
  }

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  return "downloaded";
}

export const ZIP_STORE_OPTIONS = {
  type: "blob" as const,
  compression: "STORE" as const,
};
