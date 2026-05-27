import { NextResponse } from "next/server";
import https from "https";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {

  function fetchHtml(hostname: string, path: string): Promise<string> {
    return new Promise((resolve) => {
      const opts = {
        hostname, path, method: "GET",
        headers: {
          "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
          Accept: "text/html,application/json,*/*",
          Cookie: "locale=en",
        },
        timeout: 15000,
      };
      const req = https.request(opts, (res: any) => {
        let data = "";
        res.on("data", (c: string) => (data += c));
        res.on("end", () => resolve(data));
      });
      req.on("error", () => resolve(""));
      req.end();
    });
  }

  // Fetch key pages
  const [tpl, tplKids, tplCheap, gallery, packsPage] = await Promise.all([
    fetchHtml("www.astria.ai", "/gallery/packs"),
    fetchHtml("www.astria.ai", "/gallery/packs?q=kids"),
    fetchHtml("www.astria.ai", "/gallery/packs?q=children+baby"),
    fetchHtml("www.astria.ai", "/gallery.json?page=1&per_page=100"),
    fetchHtml("www.astria.ai", "/packs"),
  ]);

  // Extract pricing data from HTML
  function extractPrices(html: string, label: string): string[] {
    const items: string[] = [];
    
    // Find price spans - typical pattern: "$0.99", "$0.00", "$14.99"
    const priceMatches = html.match(/\$(\d+\.\d{2})/g);
    if (priceMatches) {
      items.push(...priceMatches.map(p => `Price: ${p}`));
    }

    // Find grid cards with prices
    const cardRegex = /<div[^>]*class="[^"]*(?:card|item|pack)[^"]*"[^>]*>[\s\S]*?<\/(?:div|a)>/gi;
    let m;
    while ((m = cardRegex.exec(html)) !== null) {
      const card = m[0];
      const prices = card.match(/\$(\d+\.\d{2})/);
      const name = card.match(/<h[23][^>]*>([^<]+)<\//);
      const img = card.match(/<img[^>]*src="([^"]+)"/);
      if (prices || name) {
        items.push(`${prices ? prices[0] : "no-price"} | ${name ? name[1].trim() : "unnamed"} ${img ? "🖼️" : ""}`);
      }
    }

    return items.slice(0, 50);
  }

  // Also find any JSON data in scripts
  function extractJsonFromScript(html: string, label: string): any[] {
    const results: any[] = [];
    const scriptRegex = /<script[^>]*id="[^"]*"[^>]*>([\s\S]*?)<\/script>/gi;
    let m;
    while ((m = scriptRegex.exec(html)) !== null) {
      const s = m[1].trim();
      try {
        const parsed = JSON.parse(s);
        if (Array.isArray(parsed)) results.push({ label, data: parsed.slice(0, 5) });
      } catch {}
    }
    return results;
  }

  return NextResponse.json({
    templates_page_prices: extractPrices(tpl, "templates"),
    kids_packs_prices: extractPrices(tplKids, "kids-packs"),
    children_packs_prices: extractPrices(tplCheap, "children-baby"),
    gallery_items_count: gallery.length,
    packs_page_prices: extractPrices(packsPage, "packs"),
    // Also include the cheap template list
    cheap_templates: extractCheapTemplates(gallery),
  });

  function extractCheapTemplates(html: string): any[] {
    const items: any[] = [];
    try {
      const data = JSON.parse(html);
      if (Array.isArray(data)) {
        const withCost = data.filter((p: any) => p.cost_mc && p.cost_mc < 100000);
        withCost.sort((a: any, b: any) => a.cost_mc - b.cost_mc);
        withCost.slice(0, 30).forEach((p: any) => {
          items.push({
            cost: `$${(p.cost_mc / 1000000).toFixed(4)}`,
            tune_id: p.tune_id,
            prompt: (p.title || p.prompt || "").substring(0, 80),
            base_pack: p.base_pack_id,
          });
        });
      }
    } catch {}
    return items;
  }
}
