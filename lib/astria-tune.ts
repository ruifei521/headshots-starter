/** Flux1.dev gallery tune — required for Flux LoRA training (Astria docs) */
export const ASTRIA_FLUX_BASE_TUNE_ID = 1504944;

const ALLOWED_CHARACTERISTIC_KEYS = new Set([
  "age",
  "ethnicity",
  "eye_color",
  "facial_hair",
  "glasses",
  "hair_color",
  "hair_length",
  "hair_style",
  "is_bald",
]);

export function filterAstriaCharacteristics(
  raw: unknown
): Record<string, string> | null {
  if (!raw || typeof raw !== "object") return null;
  const filtered: Record<string, string> = {};
  for (const [key, value] of Object.entries(raw as Record<string, unknown>)) {
    if (
      ALLOWED_CHARACTERISTIC_KEYS.has(key) &&
      typeof value === "string" &&
      value.trim()
    ) {
      filtered[key] = value.trim();
    }
  }
  return Object.keys(filtered).length > 0 ? filtered : null;
}

export function buildAstriaTunePayload(params: {
  title: string;
  name: string;
  imageUrls: string[];
  trainCallbackUrl: string;
  characteristics?: unknown;
  testMode: boolean;
}): Record<string, unknown> {
  const tune: Record<string, unknown> = {
    title: params.title,
    name: params.name,
    token: "ohwx",
    image_urls: params.imageUrls,
    callback: params.trainCallbackUrl,
  };

  if (params.testMode) {
    tune.branch = "fast";
  } else {
    tune.base_tune_id = ASTRIA_FLUX_BASE_TUNE_ID;
    tune.model_type = "lora";
    tune.preset = "flux-lora-portrait";
  }

  const characteristics = filterAstriaCharacteristics(params.characteristics);
  if (characteristics) {
    tune.characteristics = characteristics;
  }

  return { tune };
}

/** Astria must download training images from these public URLs. */
export async function findUnreachableImageUrl(
  urls: string[]
): Promise<string | null> {
  for (const url of urls) {
    try {
      const res = await fetch(url, {
        method: "GET",
        headers: { Range: "bytes=0-1023" },
        signal: AbortSignal.timeout(8000),
      });
      if (!res.ok) {
        return url;
      }
    } catch {
      return url;
    }
  }
  return null;
}
