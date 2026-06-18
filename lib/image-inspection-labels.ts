import type { ImageInspectionResult } from "@/lib/imageInspection";

export const INSPECTION_ISSUE_LABELS = {
  includes_multiple_people: "Multiple people detected — use solo photos only",
  blurry: "Image is blurry — use a clearer photo",
  wearing_sunglasses: "Sunglasses may affect results",
  wearing_hat: "Hat may affect results — face should be fully visible",
  funny_face: "Unusual expression detected — neutral faces work best",
} as const;

export const DEFAULT_INSPECTION_RESULT: ImageInspectionResult = {
  selfie: false,
  blurry: false,
  includes_multiple_people: false,
  full_body_image_or_longshot: false,
  funny_face: false,
  wearing_hat: false,
  wearing_sunglasses: false,
};

export type InspectionUiState = "idle" | "checking" | "done";

export type InspectionUiStatus = {
  state: InspectionUiState;
  issues: string[];
};

export const INSPECTION_VERIFY_FAILED =
  "Could not verify this photo — check your connection and try re-uploading";

/** Map Astria inspect API result to user-visible warning strings. */
export function getInspectionIssues(result: ImageInspectionResult): string[] {
  const issues: string[] = [];
  if (result.includes_multiple_people) {
    issues.push(INSPECTION_ISSUE_LABELS.includes_multiple_people);
  }
  if (result.blurry) {
    issues.push(INSPECTION_ISSUE_LABELS.blurry);
  }
  if (result.wearing_sunglasses) {
    issues.push(INSPECTION_ISSUE_LABELS.wearing_sunglasses);
  }
  if (result.wearing_hat) {
    issues.push(INSPECTION_ISSUE_LABELS.wearing_hat);
  }
  if (result.funny_face) {
    issues.push(INSPECTION_ISSUE_LABELS.funny_face);
  }
  return issues;
}

/** Issues for UI — includes a warning when Astria did not respond successfully. */
export function getInspectionUiIssues(
  result: ImageInspectionResult,
  verified: boolean
): string[] {
  if (!verified) {
    return [INSPECTION_VERIFY_FAILED];
  }
  return getInspectionIssues(result);
}
