import { useEffect, useMemo, useRef } from "react";

import {
  inspectImage,
  type ImageInspectionResult,
} from "@/lib/imageInspection";

import {
  DEFAULT_INSPECTION_RESULT,
  getInspectionUiIssues,
  type InspectionUiStatus,
} from "@/lib/image-inspection-labels";

const CONCURRENCY = 3;
const INSPECT_TIMEOUT_MS = 30_000;

type FileLike = { id: string; file: File };

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(
      () => reject(new Error("Inspection timed out")),
      ms
    );
    promise
      .then((value) => {
        clearTimeout(timer);
        resolve(value);
      })
      .catch((err) => {
        clearTimeout(timer);
        reject(err);
      });
  });
}

function isIdleStatus(status?: InspectionUiStatus): boolean {
  return !status || status.state === "idle";
}

function isInspectableGender(
  modelType: string | null | undefined
): modelType is "man" | "woman" {
  return modelType === "man" || modelType === "woman";
}

/** Sync status map before the queue runs — keeps completed checks, re-queues the rest. */
export function buildInitialInspectionStatus(
  files: FileLike[],
  prev: Record<string, InspectionUiStatus>
): Record<string, InspectionUiStatus> {
  const next: Record<string, InspectionUiStatus> = {};
  for (const f of files) {
    const existing = prev[f.id];
    if (existing?.state === "done") {
      next[f.id] = existing;
    } else {
      next[f.id] = { state: "idle", issues: [] };
    }
  }
  return next;
}

/**
 * Queue image inspections in the parent — avoids mounting many ImageInspector
 * components (which caused React DOM insertBefore errors).
 * Skips until gender (man/woman) is selected.
 */
export function useUploadInspectionQueue(
  files: FileLike[],
  modelType: string | null | undefined,
  onResult: (fileId: string, result: ImageInspectionResult) => void,
  setStatus: React.Dispatch<
    React.SetStateAction<Record<string, InspectionUiStatus>>
  >
) {
  const statusRef = useRef<Record<string, InspectionUiStatus>>({});
  const onResultRef = useRef(onResult);
  const modelTypeRef = useRef(modelType);
  const filesRef = useRef(files);
  const generationRef = useRef(0);

  onResultRef.current = onResult;
  modelTypeRef.current = modelType;
  filesRef.current = files;

  const fileIdsKey = useMemo(
    () => files.map((f) => f.id).join("\0"),
    [files]
  );

  useEffect(() => {
    const currentFiles = filesRef.current;
    const generation = ++generationRef.current;

    if (!isInspectableGender(modelTypeRef.current)) {
      statusRef.current = {};
      setStatus({});
      return;
    }

    if (currentFiles.length === 0) {
      statusRef.current = {};
      setStatus({});
      return;
    }

    const initial = buildInitialInspectionStatus(
      currentFiles,
      statusRef.current
    );
    statusRef.current = initial;
    setStatus(initial);

    async function processOne(file: FileLike): Promise<void> {
      if (generation !== generationRef.current) return;

      setStatus((prev) => {
        const next = {
          ...prev,
          [file.id]: { state: "checking" as const, issues: [] },
        };
        statusRef.current = next;
        return next;
      });

      const type = modelTypeRef.current === "woman" ? "woman" : "man";
      const outcome = await withTimeout(
        inspectImage(file.file, type),
        INSPECT_TIMEOUT_MS
      ).catch(() => ({
        result: DEFAULT_INSPECTION_RESULT,
        verified: false as const,
      }));

      if (generation !== generationRef.current) return;

      onResultRef.current(file.id, outcome.result);
      setStatus((prev) => {
        const next = {
          ...prev,
          [file.id]: {
            state: "done" as const,
            issues: getInspectionUiIssues(outcome.result, outcome.verified),
          },
        };
        statusRef.current = next;
        return next;
      });
    }

    async function drainQueue() {
      while (generation === generationRef.current) {
        const idle = filesRef.current.filter((f) =>
          isIdleStatus(statusRef.current[f.id])
        );
        if (idle.length === 0) break;
        await Promise.all(idle.slice(0, CONCURRENCY).map(processOne));
      }
    }

    void drainQueue();
  }, [fileIdsKey, modelType, setStatus]);
}
