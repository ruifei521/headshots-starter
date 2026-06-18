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

for (const f of ['.env.local', '.env.prod', '.env.migration.pull']) {
  loadEnvFile(path.join(root, f));
}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  console.error('Missing Supabase URL or service role key');
  process.exit(1);
}

const headers = {
  apikey: key,
  Authorization: `Bearer ${key}`,
  'Content-Type': 'application/json',
};

const fakeUser = '00000000-0000-0000-0000-000000000000';

async function probe(name, body) {
  const res = await fetch(`${url}/rest/v1/rpc/${name}`, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  });
  const text = await res.text();
  const exists =
    res.status !== 404 &&
    !text.includes('Could not find the function') &&
    !text.includes('does not exist');
  return { exists, status: res.status, text: text.slice(0, 200) };
}

const add = await probe('add_credits', { p_amount: 0, p_user_id: fakeUser });
const deduct = await probe('deduct_credits', { p_amount: 0, p_user_id: fakeUser });

console.log('add_credits:', add.exists ? 'OK' : 'MISSING', add.status, add.text);
console.log('deduct_credits:', deduct.exists ? 'OK' : 'MISSING', deduct.status, deduct.text);

process.exit(add.exists ? 0 : 2);
