/** Detect stale CDN / post-deploy chunk load failures. */
export function isChunkLoadError(error: unknown): boolean {
  if (!error) return false;
  const message =
    error instanceof Error
      ? `${error.name} ${error.message}`
      : String(error);
  const normalized = message.toLowerCase();
  return (
    normalized.includes("chunkloaderror") ||
    normalized.includes("loading chunk") ||
    normalized.includes("failed to fetch dynamically imported module") ||
    normalized.includes("importing a module script failed") ||
    normalized.includes("dynamically imported module")
  );
}

/** DOM reconciliation failures — treat like stale chunk errors. */
export function isDomReconciliationError(error: unknown): boolean {
  const message =
    error instanceof Error
      ? `${error.name} ${error.message}`
      : String(error);
  const normalized = message.toLowerCase();
  return (
    normalized.includes("removechild") ||
    normalized.includes("insertbefore") ||
    normalized.includes("not a child of this node")
  );
}

export function isRecoverableClientError(error: unknown): boolean {
  return isChunkLoadError(error) || isDomReconciliationError(error);
}

const RELOAD_KEY = "snapprohead_chunk_reload";

/** Reload once per session to recover from stale JS or DOM sync issues. */
export function tryAutoReloadForChunkError(error: unknown): boolean {
  if (typeof window === "undefined" || !isRecoverableClientError(error)) {
    return false;
  }
  try {
    if (sessionStorage.getItem(RELOAD_KEY) === "1") return false;
    sessionStorage.setItem(RELOAD_KEY, "1");
    window.location.reload();
    return true;
  } catch {
    return false;
  }
}
