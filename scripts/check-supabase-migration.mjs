import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

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

const env = loadEnv(envFile);
const supabase = createClient(
  env.NEXT_PUBLIC_SUPABASE_URL,
  env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

const checks = {};

const { error: colErr } = await supabase
  .from('models')
  .select('images_generated, total_images')
  .limit(1);

checks.progress_columns = colErr ? { ok: false, code: colErr.code, message: colErr.message } : { ok: true };

const { data: orders, error: ordErr } = await supabase
  .from('orders')
  .select('creem_checkout_id')
  .limit(1);

checks.orders_table = ordErr ? { ok: false, message: ordErr.message } : { ok: true };

console.log(JSON.stringify(checks, null, 2));
