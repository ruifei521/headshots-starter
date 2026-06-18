import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const envFile = path.join(root, '.env.migration.pull');

function loadEnv(filePath) {
  const env = {};
  for (const line of fs.readFileSync(filePath, 'utf8').split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    let val = trimmed.slice(eq + 1).trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    env[trimmed.slice(0, eq)] = val;
  }
  return env;
}

const { ASTRIA_API_KEY } = loadEnv(envFile);
if (!ASTRIA_API_KEY) {
  console.log(JSON.stringify({ ok: false, reason: 'no_api_key' }));
  process.exit(0);
}

const res = await fetch('https://api.astria.ai/users/self', {
  headers: { Authorization: `Bearer ${ASTRIA_API_KEY}` },
});

if (!res.ok) {
  console.log(JSON.stringify({ ok: false, status: res.status }));
  process.exit(0);
}

const data = await res.json();
console.log(
  JSON.stringify({
    ok: true,
    balance_usd: data.balance ?? data.credit_balance ?? data.account_balance ?? null,
    email: data.email ? '(set)' : null,
  })
);
