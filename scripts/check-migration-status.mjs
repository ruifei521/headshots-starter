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

loadEnvFile(path.join(root, '.env.local'));

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  console.error('Missing Supabase URL or service role key in .env.local');
  process.exit(1);
}

const headers = {
  apikey: key,
  Authorization: `Bearer ${key}`,
  'Content-Type': 'application/json',
};

async function check() {
  const modelsRes = await fetch(
    `${url}/rest/v1/models?select=id,images_generated,total_images&limit=1`,
    { headers }
  );
  const modelsBody = await modelsRes.text();

  const rpcRes = await fetch(`${url}/rest/v1/rpc/deduct_credits`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ p_amount: 0, p_user_id: '00000000-0000-0000-0000-000000000000' }),
  });
  const rpcBody = await rpcRes.text();

  console.log('models.images_generated column:', modelsRes.ok ? 'OK' : `MISSING/ERROR (${modelsRes.status})`);
  if (!modelsRes.ok) console.log('  detail:', modelsBody.slice(0, 200));

  const rpcExists =
    rpcRes.status !== 404 &&
    !rpcBody.includes('Could not find the function') &&
    !rpcBody.includes('does not exist');
  console.log('deduct_credits RPC:', rpcExists ? 'OK (callable)' : `MISSING/ERROR (${rpcRes.status})`);
  if (!rpcExists) console.log('  detail:', rpcBody.slice(0, 200));
}

check().catch((e) => {
  console.error(e);
  process.exit(1);
});
