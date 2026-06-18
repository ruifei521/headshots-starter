import { describe, it, expect } from "vitest";

import {

  getInspectionIssues,

  getInspectionUiIssues,

  DEFAULT_INSPECTION_RESULT,

  INSPECTION_VERIFY_FAILED,

} from "@/lib/image-inspection-labels";

import { normalizeInspectionResult } from "@/lib/imageInspection";

import { buildInitialInspectionStatus } from "@/lib/use-upload-inspection-queue";



describe("getInspectionIssues", () => {

  it("returns empty for clean photos", () => {

    expect(getInspectionIssues(DEFAULT_INSPECTION_RESULT)).toEqual([]);

  });



  it("flags blurry and sunglasses", () => {

    const issues = getInspectionIssues({

      ...DEFAULT_INSPECTION_RESULT,

      blurry: true,

      wearing_sunglasses: true,

    });

    expect(issues.some((i) => i.includes("blurry"))).toBe(true);

    expect(issues.some((i) => i.includes("Sunglasses"))).toBe(true);

  });

});



describe("getInspectionUiIssues", () => {

  it("warns when verification failed", () => {

    expect(getInspectionUiIssues(DEFAULT_INSPECTION_RESULT, false)).toEqual([

      INSPECTION_VERIFY_FAILED,

    ]);

  });

});



describe("normalizeInspectionResult", () => {

  it("coerces string booleans from API", () => {

    const result = normalizeInspectionResult({

      name: "woman",

      wearing_sunglasses: "true",

      includes_multiple_people: "false",

    });

    expect(result.wearing_sunglasses).toBe(true);

    expect(result.includes_multiple_people).toBe(false);

  });

});



describe("buildInitialInspectionStatus", () => {

  it("re-queues checking files as idle", () => {

    const files = [{ id: "a", file: {} as File }];

    const prev = {

      a: { state: "checking" as const, issues: [] },

    };

    expect(buildInitialInspectionStatus(files, prev).a.state).toBe("idle");

  });



  it("keeps done results", () => {

    const files = [{ id: "a", file: {} as File }];

    const prev = {

      a: { state: "done" as const, issues: ["Looks bad"] },

    };

    expect(buildInitialInspectionStatus(files, prev).a).toEqual(prev.a);

  });

});

