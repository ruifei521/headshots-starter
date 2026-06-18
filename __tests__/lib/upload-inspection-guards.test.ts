import { describe, it, expect } from "vitest";
import {
  getUploadInspectionBlocker,
  hasSeriousInspectionIssues,
} from "@/lib/upload-inspection-guards";
import {
  DEFAULT_INSPECTION_RESULT,
  INSPECTION_VERIFY_FAILED,
} from "@/lib/image-inspection-labels";

describe("upload-inspection-guards", () => {
  it("blocks while checks are running", () => {
    expect(
      getUploadInspectionBlocker(["a"], {
        a: { state: "checking", issues: [] },
      })
    ).toContain("still running");
  });

  it("blocks unverified photos", () => {
    expect(
      getUploadInspectionBlocker(["a"], {
        a: { state: "done", issues: [INSPECTION_VERIFY_FAILED] },
      })
    ).toContain("could not be verified");
  });

  it("blocks blurry photos", () => {
    expect(
      getUploadInspectionBlocker(["a"], {
        a: { state: "done", issues: ["Image is blurry — use a clearer photo"] },
      })
    ).toContain("blurry");
  });

  it("allows clean verified photos", () => {
    expect(
      getUploadInspectionBlocker(["a"], {
        a: { state: "done", issues: [] },
      })
    ).toBeNull();
  });

  it("detects serious inspection issues", () => {
    expect(
      hasSeriousInspectionIssues({
        ...DEFAULT_INSPECTION_RESULT,
        includes_multiple_people: true,
      })
    ).toBe(true);
  });
});
