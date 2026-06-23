import { NextResponse } from "next/server";
import https from "https";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {

  async function fetchUrl(url: string): Promise<{ status: number; title: string; snippet: string }> {
    return new Promise((resolve) => {
      const u = new URL(url);
      const opts = {
        hostname: u.hostname,
        path: u.pathname + u.search,
        method: "GET",
        headers: { "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)" },
        timeout: 8000,
      };
      const req = https.request(opts, (res: any) => {
        let data = "";
        res.on("data", (c: string) => (data += c));
        res.on("end", () => {
          const titleMatch = data.match(/<title>([^<]+)<\/title>/i);
          const title = titleMatch ? titleMatch[1].trim() : "";
          const snippet = data.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").substring(0, 300);
          resolve({ status: res.statusCode || 0, title, snippet });
        });
      });
      req.on("error", () => resolve({ status: 0, title: "", snippet: "" }));
      req.end();
    });
  }

  // Known AI kids portrait players + Astria-based sites to check
  const targets = [
    "https://dreamlab.ai",
    "https://www.dreampets.ai",
    "https://www.astria.ai/gallery?q=kids",
    "https://www.astria.ai/gallery?q=baby",
    "https://www.astria.ai/packs",
    "https://prisma-ai.com",
    "https://www.facetuneapp.com",
    "https://deepdreamgenerator.com",
    "https://www.shutterstock.com/ai-image-generator/portrait-kids",
    "https://stablediffusionweb.com",
  ];

  // Also try to find kids-specific ai portrait sites
  const kidsSpecific = [
    "https://childportrait.net",
    "https://babyportrait.ai",
    "https://kidsai.art",
    "https://portraitai.com",
    "https://snapheadshot.com",
    "https://headshotpro.com",
    "https://www.aiportrait.com",
    "https://portr.ai",
  ];

  const allTargets = [...targets, ...kidsSpecific];
  const results: Record<string, any> = {};

  const BATCH_SIZE = 4;
  for (let i = 0; i < allTargets.length; i += BATCH_SIZE) {
    const batch = allTargets.slice(i, i + BATCH_SIZE);
    const batchResults = await Promise.all(
      batch.map(async (url) => ({
        url,
        result: await fetchUrl(url),
      }))
    );
    batchResults.forEach((r) => {
      if (r.result.status === 200 || r.result.title) {
        results[r.url] = r.result;
      }
    });
  }

  return NextResponse.json(results);
}
