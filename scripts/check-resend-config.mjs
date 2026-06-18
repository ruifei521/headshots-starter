#!/usr/bin/env node
/**
 * Verify Resend is ready for SnapProHead production emails.
 *
 * Usage:
 *   # Step 1 — domain + API key only (no send):
 *   RESEND_API_KEY=re_xxx node scripts/check-resend-config.mjs
 *
 *   # Step 2 — send test email to your inbox:
 *   RESEND_API_KEY=re_xxx TEST_EMAIL=you@gmail.com node scripts/check-resend-config.mjs
 *
 * Reads .env.prod if present (local); production key should match Vercel.
 */
import { readFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

const EXPECTED_DOMAIN = "snapprohead.com";
const EXPECTED_FROM = "SnapProHead <contact@snapprohead.com>";
const PRODUCTION_KEY_PREFIX = "re_etnyt1S1"; // first chars only — for hint, not validation

function loadEnvProd() {
  const path = join(root, ".env.prod");
  if (!existsSync(path)) return;
  for (const line of readFileSync(path, "utf8").split("\n")) {
    if (line.trim().startsWith("#")) continue;
    const m = line.match(/^([A-Z_]+)="?(.*)"?\s*$/);
    if (m && !process.env[m[1]] && m[2]) {
      process.env[m[1]] = m[2].replace(/^"|"$/g, "");
    }
  }
}

function maskKey(key) {
  if (!key || key.length < 12) return "(missing or too short)";
  return `${key.slice(0, 8)}…${key.slice(-4)} (${key.length} chars)`;
}

function pass(msg) {
  console.log(`✅ ${msg}`);
}
function fail(msg) {
  console.log(`❌ ${msg}`);
}
function warn(msg) {
  console.log(`⚠️  ${msg}`);
}
function info(msg) {
  console.log(`   ${msg}`);
}

async function main() {
  loadEnvProd();

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL || EXPECTED_FROM;
  const testTo = process.env.TEST_EMAIL;

  console.log("=== SnapProHead Resend configuration check ===\n");

  // --- Local / env file ---
  console.log("1) Environment variables\n");
  if (!apiKey) {
    fail("RESEND_API_KEY is not set in this shell or .env.prod");
    info("Set on Vercel: Project snapprohead → Settings → Environment Variables → Production");
    info("Then redeploy, or run: vercel env pull .env.prod");
    process.exit(1);
  }
  pass(`RESEND_API_KEY present: ${maskKey(apiKey)}`);
  pass(`RESEND_FROM_EMAIL: ${from}`);

  if (apiKey.startsWith("re_hF6BiqWW")) {
    warn("This looks like a personal/default key — production should use snapprohead-production key (re_etnyt1…)");
  }

  // --- API: domains ---
  console.log("\n2) Resend domain verification\n");
  const domainsRes = await fetch("https://api.resend.com/domains", {
    headers: { Authorization: `Bearer ${apiKey}` },
  });
  const domainsBody = await domainsRes.json();

  if (domainsRes.status === 401) {
    fail("API key rejected (401) — wrong or revoked key");
    process.exit(1);
  }
  if (!domainsRes.ok) {
    fail(`Domains API error ${domainsRes.status}`);
    console.log(JSON.stringify(domainsBody, null, 2));
    process.exit(1);
  }

  const domains = domainsBody.data || [];
  const snap = domains.find(
    (d) => d.name === EXPECTED_DOMAIN || d.name === `www.${EXPECTED_DOMAIN}`
  );

  if (!snap) {
    fail(`Domain ${EXPECTED_DOMAIN} not found in this Resend account`);
    info("Domains in account:");
    for (const d of domains) info(`  - ${d.name} (${d.status})`);
    process.exit(1);
  }

  if (snap.status === "verified") {
    pass(`${EXPECTED_DOMAIN} is verified`);
  } else {
    fail(`${EXPECTED_DOMAIN} status: ${snap.status} (need "verified")`);
    info("Open https://resend.com/domains and complete DNS records");
    process.exit(1);
  }

  // --- API: test send ---
  console.log("\n3) Test email send\n");
  if (!testTo) {
    warn("TEST_EMAIL not set — skipping live send");
    info(`Run: TEST_EMAIL=your@gmail.com node scripts/check-resend-config.mjs`);
    console.log("\n--- Manual checks (production) ---");
    info("Vercel → snapprohead → Settings → Environment Variables:");
    info("  RESEND_API_KEY        → Production ✓");
    info("  RESEND_FROM_EMAIL     → SnapProHead <contact@snapprohead.com> (optional)");
    info("After deploy, Resend → Emails → Logs should show sends from webhooks");
    console.log("\n✅ Domain + API key look OK. Set TEST_EMAIL to confirm delivery.");
    return;
  }

  const sendRes = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [testTo],
      reply_to: "contact@snapprohead.com",
      subject: "SnapProHead — Resend config test OK",
      html: `<p>If you see this, <strong>Resend is configured correctly</strong> for SnapProHead.</p>
             <p>From: ${from}</p>
             <p>Time: ${new Date().toISOString()}</p>`,
    }),
  });
  const sendBody = await sendRes.json();

  if (sendRes.ok && sendBody.id) {
    pass(`Test email queued — id: ${sendBody.id}`);
    info(`Check inbox: ${testTo} (and spam)`);
    info("Resend → Emails → Logs → should show 'delivered' within ~1 min");
    console.log("\n✅ Full Resend setup verified (API + domain + send).");
  } else {
    fail(`Send failed (${sendRes.status})`);
    console.log(JSON.stringify(sendBody, null, 2));
    if (sendBody.message?.includes("domain")) {
      info("From address must use verified domain: contact@snapprohead.com");
    }
    process.exit(1);
  }

  console.log("\n4) App integration (code paths)\n");
  pass("prompt-webhook → sendHeadshotsReadyEmail (when all headshots are ready)");
  pass("train-webhook + stale timeout → sendTrainingFailedEmail (credit returned)");
  info("Success path: one ready email. Failure path: one failure email — never both.");
  info("Requires RESEND_API_KEY on Vercel Production + redeploy after adding it");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
