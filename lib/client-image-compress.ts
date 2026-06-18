/**
 * Client-side resize/compress for uploads.
 * Vercel serverless routes reject bodies above ~4.5MB — we target 4MB per file after compression.
 * Users can select large originals (e.g. 30MB iPhone photos); compression runs in the browser before upload.
 */

/** Per-file ceiling after compression (below Vercel ~4.5MB request limit). */
export const MAX_SINGLE_UPLOAD_BYTES = 4 * 1024 * 1024;

const SKIP_COMPRESS_BELOW_BYTES = 600 * 1024;

const COMPRESS_PASSES = [
  { maxDimension: 1600, quality: 0.82 },
  { maxDimension: 1200, quality: 0.72 },
  { maxDimension: 1024, quality: 0.62 },
  { maxDimension: 896, quality: 0.52 },
] as const;

export type CompressImageResult = {
  file: File;
  ok: boolean;
  reason?: string;
};

export type CompressImagesResult = {
  files: File[];
  rejected: { name: string; reason: string }[];
};

function jpegFileName(originalName: string): string {
  const baseName = originalName.replace(/\.[^.]+$/, "") || "photo";
  return `${baseName}.jpg`;
}

function scaledDimensions(
  width: number,
  height: number,
  maxDimension: number
): { width: number; height: number } {
  const longest = Math.max(width, height);
  if (longest <= maxDimension) return { width, height };
  const scale = maxDimension / longest;
  return {
    width: Math.round(width * scale),
    height: Math.round(height * scale),
  };
}

async function renderJpegFile(
  bitmap: ImageBitmap,
  maxDimension: number,
  quality: number,
  originalName: string
): Promise<File | null> {
  const { width, height } = scaledDimensions(bitmap.width, bitmap.height, maxDimension);
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  ctx.drawImage(bitmap, 0, 0, width, height);

  const blob = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob(resolve, "image/jpeg", quality);
  });
  if (!blob) return null;

  return new File([blob], jpegFileName(originalName), {
    type: "image/jpeg",
    lastModified: Date.now(),
  });
}

const TOO_LARGE_REASON =
  "This photo is still too large after optimization. Try a smaller JPG, a different angle, or another browser (Chrome/Safari).";

const NO_BITMAP_REASON =
  "We couldn't optimize this photo in your browser. Try exporting as JPG or use Chrome/Safari on iPhone.";

export async function compressImageForUpload(file: File): Promise<CompressImageResult> {
  if (!file.type.startsWith("image/")) {
    if (file.size <= MAX_SINGLE_UPLOAD_BYTES) return { file, ok: true };
    return { file, ok: false, reason: TOO_LARGE_REASON };
  }

  if (file.size <= SKIP_COMPRESS_BELOW_BYTES && file.size <= MAX_SINGLE_UPLOAD_BYTES) {
    return { file, ok: true };
  }

  if (typeof createImageBitmap === "undefined") {
    if (file.size <= MAX_SINGLE_UPLOAD_BYTES) return { file, ok: true };
    return { file, ok: false, reason: NO_BITMAP_REASON };
  }

  let bitmap: ImageBitmap | null = null;
  try {
    bitmap = await createImageBitmap(file);
    let best: File = file;

    for (const pass of COMPRESS_PASSES) {
      const candidate = await renderJpegFile(
        bitmap,
        pass.maxDimension,
        pass.quality,
        file.name
      );
      if (candidate && candidate.size < best.size) {
        best = candidate;
      }
      if (best.size <= MAX_SINGLE_UPLOAD_BYTES) {
        return { file: best, ok: true };
      }
    }

    if (best.size <= MAX_SINGLE_UPLOAD_BYTES) {
      return { file: best, ok: true };
    }

    return { file: best, ok: false, reason: TOO_LARGE_REASON };
  } catch {
    if (file.size <= MAX_SINGLE_UPLOAD_BYTES) return { file, ok: true };
    return { file, ok: false, reason: NO_BITMAP_REASON };
  } finally {
    bitmap?.close();
  }
}

export async function compressImagesForUpload(files: File[]): Promise<CompressImagesResult> {
  const accepted: File[] = [];
  const rejected: { name: string; reason: string }[] = [];

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const result = await compressImageForUpload(file);
    if (result.ok) {
      accepted.push(result.file);
    } else {
      rejected.push({
        name: file.name,
        reason: result.reason ?? TOO_LARGE_REASON,
      });
    }
    // Yield to the main thread between files so the UI stays responsive.
    if (i < files.length - 1) {
      await new Promise((resolve) => setTimeout(resolve, 0));
    }
  }

  return { files: accepted, rejected };
}
