import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
for (const f of ['.env.migration.pull']) {
  for (const line of fs.readFileSync(path.join(root, f), 'utf8').split('\n')) {
    const t = line.trim();
    if (!t || t.startsWith('#')) continue;
    const eq = t.indexOf('=');
    if (eq < 0) continue;
    const k = t.slice(0, eq);
    let v = t.slice(eq + 1).trim().replace(/^["']|["']$/g, '');
    if (!process.env[k]) process.env[k] = v;
  }
}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
const h = {
  apikey: key,
  Authorization: `Bearer ${key}`,
  'Content-Type': 'application/json',
  Prefer: 'return=minimal',
};

const list = await fetch(`${url}/rest/v1/orders?select=creem_checkout_id,user_id,creem_product_id,tier,amount_cents,currency&limit=1`, { headers: h });
const rows = await list.json();
if (!rows?.[0]?.creem_checkout_id) {
  console.log('orders unique index: SKIP (no orders yet)');
  process.exit(0);
}

const o = rows[0];
const dup = await fetch(`${url}/rest/v1/orders`, {
  method: 'POST',
  headers: h,
  body: JSON.stringify({ ...o, status: 'paid' }),
});
const body = await dup.text();
console.log(
  dup.status === 409 || body.includes('duplicate') || body.includes('23505')
    ? 'orders unique index: OK'
    : `orders unique index: UNKNOWN (${dup.status} ${body.slice(0, 100)})`
);
