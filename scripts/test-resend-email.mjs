#!/usr/bin/env node
/**
 * Smoke-test Resend: verify API key + optional send to TEST_EMAIL.
 * Usage:
 *   RESEND_API_KEY=re_xxx node scripts/test-resend-email.mjs
 *   RESEND_API_KEY=re_xxx TEST_EMAIL=you@gmail.com node scripts/test-resend-email.mjs
 */
const apiKey = process.env.RESEND_API_KEY;
const testTo = process.env.TEST_EMAIL;
const from = process.env.RESEND_FROM_EMAIL || "SnapProHead <contact@snapprohead.com>";

if (!apiKey) {
  console.error("Missing RESEND_API_KEY");
  process.exit(1);
}

async function main() {
  const domainsRes = await fetch("https://api.resend.com/domains", {
    headers: { Authorization: `Bearer ${apiKey}` },
  });
  const domainsBody = await domainsRes.json();
  console.log("Domains status:", domainsRes.status);
  console.log(JSON.stringify(domainsBody, null, 2));

  if (!testTo) {
    console.log("\nSet TEST_EMAIL to send a test completion email.");
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
      subject: "SnapProHead — test: your headshots are ready",
      html: "<p>If you received this, Resend is configured correctly for SnapProHead.</p>",
    }),
  });
  const sendBody = await sendRes.json();
  console.log("\nTest send status:", sendRes.status);
  console.log(JSON.stringify(sendBody, null, 2));
  if (!sendRes.ok) process.exit(1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
