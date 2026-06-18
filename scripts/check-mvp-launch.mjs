#!/usr/bin/env node
/**
 * One-shot MVP launch audit (keys only, no secret values).
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return {};
  const env = {};
  for (const line of fs.readFileSync(filePath, 'utf8').split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq);
    let val = trimmed.slice(eq + 1).trim().replace(/^["']|["']$/g, '');
    env[key] = val;
  }
  return env;
}

function flag(name, ok, detail = '') {
  return { name, ok, detail };
}

const prod = loadEnvFile(path.join(root, '.env.prod'));
const migration = loadEnvFile(path.join(root, '.env.migration.pull'));

const secretKeys = [
  'CREEM_WEBHOOK_SECRET',
  'CREEM_API_KEY',
  'ASTRIA_API_KEY',
  'APP_WEBHOOK_SECRET',
  'CRON_SECRET',
  'RESEND_API_KEY',
];

const results = [];

for (const k of secretKeys) {
  const v = prod[k];
  results.push(flag(k, Boolean(v?.length), v ? `set (${v.length} chars)` : 'missing in .env.prod'));
}

results.push(
  flag(
    'DEPLOYMENT_URL',
    (prod.DEPLOYMENT_URL || '').includes('snapprohead.com'),
    prod.DEPLOYMENT_URL || 'missing'
  )
);
results.push(
  flag(
    'ASTRIA_TEST_MODE',
    prod.ASTRIA_TEST_MODE !== 'true',
    prod.ASTRIA_TEST_MODE ? prod.ASTRIA_TEST_MODE : 'unset (ok)'
  )
);
results.push(
  flag(
    'RESEND_FROM_EMAIL',
    Boolean(prod.RESEND_FROM_EMAIL?.includes('@')),
    prod.RESEND_FROM_EMAIL || 'missing'
  )
);

// Supabase checks
const url = migration.NEXT_PUBLIC_SUPABASE_URL || prod.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = migration.SUPABASE_SERVICE_ROLE_KEY || prod.SUPABASE_SERVICE_ROLE_KEY;
const anonKey = migration.NEXT_PUBLIC_SUPABASE_ANON_KEY || prod.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (url && serviceKey) {
  const h = { apikey: serviceKey, Authorization: `Bearer ${serviceKey}` };

  const cg = await fetch(`${url}/rest/v1/orders?select=credits_granted&limit=1`, { headers: h });
  results.push(
    flag('orders.credits_granted column', cg.ok, cg.ok ? 'OK' : (await cg.text()).slice(0, 100))
  );

  const bucket = await fetch(`${url}/storage/v1/bucket/headshots`, { headers: h });
  if (bucket.ok) {
    const b = await bucket.json();
    results.push(flag('headshots bucket public', b.public === true, `public=${b.public}`));
  } else {
    results.push(flag('headshots bucket', false, `HTTP ${bucket.status}`));
  }

  // Unique index probe with real user if possible
  const users = await fetch(`${url}/rest/v1/users?select=id&limit=1`, { headers: h });
  if (users.ok) {
    const [user] = await users.json();
    if (user?.id) {
      const testId = `mvp_audit_${Date.now()}`;
      const payload = {
        user_id: user.id,
        creem_checkout_id: testId,
        creem_product_id: 'prod_test',
        tier: 'starter',
        amount_cents: 100,
        currency: 'USD',
        status: 'paid',
      };
      const first = await fetch(`${url}/rest/v1/orders`, {
        method: 'POST',
        headers: { ...h, 'Content-Type': 'application/json', Prefer: 'return=minimal' },
        body: JSON.stringify(payload),
      });
      const second = await fetch(`${url}/rest/v1/orders`, {
        method: 'POST',
        headers: { ...h, 'Content-Type': 'application/json', Prefer: 'return=minimal' },
        body: JSON.stringify(payload),
      });
      const dupBlocked = second.status === 409;
      results.push(
        flag('orders unique checkout index', first.ok && dupBlocked, dupBlocked ? 'duplicate rejected' : `first=${first.status} second=${second.status}`)
      );
      await fetch(`${url}/rest/v1/orders?creem_checkout_id=eq.${testId}`, {
        method: 'DELETE',
        headers: h,
      });
    }
  }

  if (anonKey) {
    const anonH = {
      apikey: anonKey,
      Authorization: `Bearer ${anonKey}`,
      'Content-Type': 'application/json',
    };
    const rls = await fetch(`${url}/rest/v1/credits`, {
      method: 'POST',
      headers: anonH,
      body: JSON.stringify({ user_id: '00000000-0000-0000-0000-000000000002', credits: 999 }),
    });
    results.push(flag('credits RLS blocks anon insert', rls.status === 401 || rls.status === 403, `HTTP ${rls.status}`));
  }
} else {
  results.push(flag('Supabase env', false, 'missing URL or service key'));
}

const failed = results.filter((r) => !r.ok);
console.log('\n=== MVP Launch Audit ===\n');
for (const r of results) {
  console.log(`${r.ok ? '✅' : '❌'} ${r.name}${r.detail ? ` — ${r.detail}` : ''}`);
}
console.log(`\n${results.length - failed.length}/${results.length} passed`);
if (failed.length) process.exit(1);
