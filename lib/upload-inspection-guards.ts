import type { ImageInspectionResult } from "@/lib/imageInspection";
import {
  INSPECTION_VERIFY_FAILED,
  type InspectionUiStatus,
} from "@/lib/image-inspection-labels";

export function hasSeriousInspectionIssues(
  result: ImageInspectionResult
): boolean {
  return result.includes_multiple_people || result.blurry;
}

/** Returns a user-facing blocker when uploads are not safe to train yet. */
export function getUploadInspectionBlocker(
  fileIds: string[],
  statusByFileId: Record<string, InspectionUiStatus>
): string | null {
  if (fileIds.length === 0) return null;

  for (const fileId of fileIds) {
    const status = statusByFileId[fileId];
    if (!status || status.state === "idle" || status.state === "checking") {
      return "Photo checks are still running — wait a moment before creating headshots.";
    }

    if (status.issues.includes(INSPECTION_VERIFY_FAILED)) {
      return "Some photos could not be verified. Re-upload or replace flagged photos before continuing.";
    }

    if (
      status.issues.some(
        (issue) =>
          issue.includes("Multiple people") ||
          issue.toLowerCase().includes("blurry")
      )
    ) {
      return "Fix flagged photo issues (blurry photos or multiple people) before continuing.";
    }
  }

  return null;
}
