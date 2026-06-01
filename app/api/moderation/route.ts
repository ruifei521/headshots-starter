import { NextRequest, NextResponse } from "next/server";
import https from "https";
import { logger } from "@/lib/logger";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// Try env first, fall back to hardcoded key
const rawKey = (process.env.CREEM_API_KEY || "").replace(/["'\s]/g, "");
const CREEM_API_KEY = rawKey;

/**
 * Call CREEM moderation API using Node https module (bypasses any proxy/redirect issues)
 */
function callCreemModeration(
  prompt: string,
  externalId: string
): Promise<{ status: number; body: string }> {
  return new Promise((resolve, reject) => {
    const bodyStr = JSON.stringify({ prompt, external_id: externalId });

    const options = {
      hostname: "api.creem.io",
      path: "/v1/moderation/prompt",
      method: "POST",
      headers: {
        "x-api-key": CREEM_API_KEY,
        "Content-Type": "application/json",
        Accept: "application/json",
        "Content-Length": Buffer.byteLength(bodyStr),
      },
    };

    const req = https.request(options, (res) => {
      let data = "";
      res.on("data", (chunk: string) => (data += chunk));
      res.on("end", () =>
        resolve({ status: res.statusCode || 500, body: data })
      );
    });

    req.on("error", (err: Error) => reject(err));
    req.write(bodyStr);
    req.end();
  });
}

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json();

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json(
        { message: "Prompt is required and must be a string" },
        { status: 400 }
      );
    }

    if (!CREEM_API_KEY) {
      return NextResponse.json({
        id: "mod-skipped",
        object: "moderation_result",
        prompt,
        decision: "allow",
        usage: { units: 0 },
      });
    }

    // Call CREEM Moderation API via Node https directly
    const externalId = `snapprohead-${Date.now()}`;
    const { status, body } = await callCreemModeration(prompt, externalId);

    // Try parse response body as JSON
    let resultObj: Record<string, unknown>;
    try {
      resultObj = JSON.parse(body);
    } catch {
      resultObj = { raw_response: body };
    }

    if (status !== 200) {
      return NextResponse.json({
        id: "mod-skipped",
        object: "moderation_result",
        prompt,
        decision: "allow",
        note: `CREEM moderation API returned ${status}`,
        usage: { units: 0 },
      });
    }

    return NextResponse.json(resultObj);
  } catch (error: any) {
    logger.error("Moderation API error:", error?.message || error);
    return NextResponse.json(
      {
        id: "mod-error",
        object: "moderation_result",
        prompt: "unknown",
        decision: "allow",
        reason: "Error contacting moderation service, allowing as fallback",
        usage: { units: 0 },
      }
    );
  }
}
