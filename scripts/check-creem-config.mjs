#!/usr/bin/env node
/**
 * Compare lib/tiers.ts Creem product IDs with Creem API + print webhook checklist.
 * Usage: node scripts/check-creem-config.mjs
 * Reads CREEM_API_KEY from process.env or .env.prod (local only).
 */
import { readFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

const EXPECTED = {
  starter: { id: "prod_fWHFyTDAhVb1xqwS71esu", priceUsd: 29, name: "Basic" },
  professional: { id: "prod_453s1kOCIVZECDNqx9z1o3", priceUsd: 39, name: "Professional" },
  executive: { id: "prod_4Bcd1ZArXQXbWl7GWkxzUe", priceUsd: 59, name: "Executive" },
};

function loadEnvProd() {
  const path = join(root, ".env.prod");
  if (!existsSync(path)) return;
  for (const line of readFileSync(path, "utf8").split("\n")) {
    const m = line.match(/^([A-Z_]+)="?(.*)"?\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^"|"$/g, "");
  }
}

function centsToUsd(cents) {
  if (cents == null) return null;
  return Number(cents) / 100;
}

async function main() {
  loadEnvProd();
  const apiKey = process.env.CREEM_API_KEY;
  const webhookSecret = process.env.CREEM_WEBHOOK_SECRET;

  console.log("=== Creem configuration check ===\n");
  console.log("Code source of truth: lib/tiers.ts\n");
  console.log("| Tier | Product ID | Expected price |");
  console.log("|------|------------|----------------|");
  for (const [tier, e] of Object.entries(EXPECTED)) {
    console.log(`| ${tier} | \`${e.id}\` | $${e.priceUsd} (${e.name}) |`);
  }

  console.log("\n--- Webhook (manual in Creem Dashboard) ---");
  console.log("URL:     https://snapprohead.com/api/webhook/creem");
  console.log("Event:   checkout.completed");
  console.log(
    "Secret:  CREEM_WEBHOOK_SECRET in Vercel",
    webhookSecret ? `(set locally, ${webhookSecret.length} chars)` : "(NOT SET in .env.prod)"
  );

  if (!apiKey) {
    console.log("\nCREEM_API_KEY not set — skip live API verification.");
    process.exit(0);
  }

  const res = await fetch("https://api.creem.io/v1/products/search?page_size=50", {
    headers: { "x-api-key": apiKey },
  });
  const body = await res.json();

  if (!res.ok) {
    console.error("\nCreem API error:", res.status, JSON.stringify(body, null, 2));
    process.exit(1);
  }

  const items = body.items || body.data || body.products || [];
  const byId = new Map(items.map((p) => [p.id, p]));

  console.log("\n--- Live Creem API vs code ---\n");
  let allOk = true;
  for (const [tier, e] of Object.entries(EXPECTED)) {
    const p = byId.get(e.id);
    if (!p) {
      console.log(`❌ ${tier}: ${e.id} NOT FOUND in Creem account`);
      allOk = false;
      continue;
    }
    const price =
      centsToUsd(p.price?.amount ?? p.price ?? p.amount) ??
      centsToUsd(p.prices?.[0]?.amount);
    const name = p.name || p.title || "?";
    const priceOk = price == null || Math.abs(price - e.priceUsd) < 0.01;
    console.log(
      `${priceOk ? "✅" : "⚠️"} ${tier}: ${e.id}`,
      `| Creem: "${name}" $${price ?? "?"} | code expects $${e.priceUsd}`
    );
    if (!priceOk) allOk = false;
  }

  const extra = items.filter(
    (p) => !Object.values(EXPECTED).some((e) => e.id === p.id)
  );
  if (extra.length) {
    console.log("\nOther products in Creem (not in current tiers.ts):");
    for (const p of extra) {
      const price = centsToUsd(p.price?.amount ?? p.price ?? p.amount);
      console.log(`  - ${p.id}: ${p.name || p.title} $${price ?? "?"}`);
    }
  }

  console.log(allOk ? "\n✅ Product IDs appear consistent." : "\n⚠️ Fix mismatches in Creem or lib/tiers.ts.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
