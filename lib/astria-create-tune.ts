import axios from "axios";
import { logger } from "@/lib/logger";

const ASTRIA_TUNES_URL = "https://api.astria.ai/tunes";
const TUNES_PAGE_SIZE = 20;

export function buildAstriaTuneTitle(name: string, modelId: number): string {
  return `${name.trim()} — snapprohead-${modelId}`;
}

type AstriaTuneListItem = {
  id?: number;
  title?: string;
};

function parseTuneListPayload(data: unknown): AstriaTuneListItem[] {
  if (Array.isArray(data)) return data as AstriaTuneListItem[];
  if (data && typeof data === "object" && Array.isArray((data as { tunes?: unknown }).tunes)) {
    return (data as { tunes: AstriaTuneListItem[] }).tunes;
  }
  return [];
}

/** Paginate Astria GET /tunes and find an exact title match. */
export async function findAstriaTuneIdByTitle(
  apiKey: string,
  title: string,
  maxPages = 5
): Promise<number | null> {
  for (let page = 0; page < maxPages; page += 1) {
    try {
      const res = await axios.get(ASTRIA_TUNES_URL, {
        headers: { Authorization: `Bearer ${apiKey}` },
        params: { offset: page * TUNES_PAGE_SIZE },
        timeout: 12_000,
      });

      const items = parseTuneListPayload(res.data);
      if (!items.length) break;

      const match = items.find((t) => t.title === title);
      if (match?.id != null) {
        return match.id;
      }

      if (items.length < TUNES_PAGE_SIZE) break;
    } catch (error) {
      logger.warn("findAstriaTuneIdByTitle page failed:", error);
      break;
    }
  }

  return null;
}

function extractTuneId(data: unknown): number | null {
  if (!data || typeof data !== "object") return null;
  const id = (data as { id?: number }).id;
  return typeof id === "number" && Number.isFinite(id) ? id : null;
}

/**
 * After POST /tunes timed out, confirm whether Astria accepted the request.
 * Uses title idempotency (retry POST) then list search as fallback.
 */
export async function resolveAstriaTuneAfterTimeout(params: {
  apiKey: string;
  title: string;
  tuneBody: Record<string, unknown>;
  /** Brief pause so a slow first request can finish on Astria's side. */
  pauseMs?: number;
  retryTimeoutMs?: number;
  listMaxPages?: number;
}): Promise<number | null> {
  const {
    apiKey,
    title,
    tuneBody,
    pauseMs = 1000,
    retryTimeoutMs = 12_000,
    listMaxPages = 2,
  } = params;

  if (pauseMs > 0) {
    await new Promise((resolve) => setTimeout(resolve, pauseMs));
  }

  try {
    const retry = await axios.post(ASTRIA_TUNES_URL, tuneBody, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      timeout: retryTimeoutMs,
    });

    if (retry.status === 201 || retry.status === 200) {
      const tuneId = extractTuneId(retry.data);
      if (tuneId) {
        logger.log(`resolveAstriaTuneAfterTimeout: retry POST returned tune ${tuneId}`);
        return tuneId;
      }
    }
  } catch (error) {
    const isTimeout =
      axios.isAxiosError(error) &&
      (error.code === "ECONNABORTED" || error.message.includes("timeout"));
    if (!isTimeout) {
      logger.warn("resolveAstriaTuneAfterTimeout: retry POST failed:", error);
    }
  }

  const listed = await findAstriaTuneIdByTitle(apiKey, title, listMaxPages);
  if (listed) {
    logger.log(`resolveAstriaTuneAfterTimeout: found tune ${listed} via list`);
  }
  return listed;
}

export async function createAstriaTune(params: {
  apiKey: string;
  tuneBody: Record<string, unknown>;
  timeoutMs?: number;
}): Promise<{ status: number; tuneId: number | null; data: unknown }> {
  const response = await axios.post(ASTRIA_TUNES_URL, params.tuneBody, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${params.apiKey}`,
    },
    timeout: params.timeoutMs ?? 28_000,
  });

  return {
    status: response.status,
    tuneId: extractTuneId(response.data),
    data: response.data,
  };
}
