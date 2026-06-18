/**
 * Verify P0 migration: unique checkout index + credits RLS hardening.
 * Usage: node scripts/check-p0-migration.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  for (const line of fs.readFileSync(filePath, 'utf8').split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq);
    let val = trimmed.slice(eq + 1).trim().replace(/^["']|["']$/g, '');
    if (!process.env[key]) process.env[key] = val;
  }
}

for (const f of ['.env.local', '.env.migration.pull']) {
  loadEnvFile(path.join(root, f));
}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!url || !serviceKey || !anonKey) {
  console.error('Missing Supabase env vars in .env.local');
  process.exit(1);
}

const serviceHeaders = {
  apikey: serviceKey,
  Authorization: `Bearer ${serviceKey}`,
  'Content-Type': 'application/json',
  Prefer: 'return=minimal',
};

const anonHeaders = {
  apikey: anonKey,
  Authorization: `Bearer ${anonKey}`,
  'Content-Type': 'application/json',
  Prefer: 'return=minimal',
};

async function checkUniqueCheckoutIndex() {
  const existingRes = await fetch(
    `${url}/rest/v1/orders?select=user_id&limit=1`,
    { headers: serviceHeaders }
  );
  if (!existingRes.ok) {
    console.log('orders unique index: SKIP (cannot read orders table)');
    return;
  }
  const existing = await existingRes.json();
  const userId = existing[0]?.user_id;
  if (!userId) {
    console.log('orders unique index: SKIP (no orders yet — index may still exist)');
    return;
  }

  const testCheckoutId = `test_p0_${Date.now()}`;
  const payload = {
    user_id: userId,
    creem_checkout_id: testCheckoutId,
    creem_product_id: 'prod_test',
    tier: 'starter',
    amount_cents: 100,
    currency: 'USD',
    status: 'paid',
  };

  const first = await fetch(`${url}/rest/v1/orders`, {
    method: 'POST',
    headers: serviceHeaders,
    body: JSON.stringify(payload),
  });

  if (!first.ok) {
    const body = await first.text();
    console.log('orders unique index: UNKNOWN (insert failed:', first.status, body.slice(0, 120), ')');
    return;
  }

  const second = await fetch(`${url}/rest/v1/orders`, {
    method: 'POST',
    headers: serviceHeaders,
    body: JSON.stringify(payload),
  });

  const secondBody = await second.text();
  if (second.status === 409 || secondBody.includes('duplicate') || secondBody.includes('23505')) {
    console.log('orders unique index: OK (duplicate checkout rejected)');
  } else {
    console.log('orders unique index: MISSING (duplicate checkout was allowed)');
  }

  await fetch(`${url}/rest/v1/orders?creem_checkout_id=eq.${testCheckoutId}`, {
    method: 'DELETE',
    headers: serviceHeaders,
  });
}

async function checkCreditsRls() {
  const fakeUserId = '00000000-0000-0000-0000-000000000002';
  const res = await fetch(`${url}/rest/v1/credits`, {
    method: 'POST',
    headers: {
      ...anonHeaders,
      Authorization: `Bearer ${anonKey}`,
    },
    body: JSON.stringify({ user_id: fakeUserId, credits: 999, tier: 'starter' }),
  });

  if (res.status === 401 || res.status === 403) {
    console.log('credits RLS (anon insert blocked): OK');
    return;
  }

  const body = await res.text();
  if (body.includes('permission') || body.includes('policy') || res.status === 401) {
    console.log('credits RLS (insert blocked): OK');
  } else {
    console.log('credits RLS: OPEN (anon/authenticated may still insert — run migration)');
  }
}

async function checkImagesGeneratedColumn() {
  const res = await fetch(
    `${url}/rest/v1/models?select=id,images_generated,total_images&limit=1`,
    { headers: serviceHeaders }
  );
  console.log(
    'models.images_generated column:',
    res.ok ? 'OK' : `MISSING/ERROR (${res.status})`
  );
}

await checkImagesGeneratedColumn();
await checkUniqueCheckoutIndex();
await checkCreditsRls();
