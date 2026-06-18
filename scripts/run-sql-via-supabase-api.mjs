/**
 * Run SQL on Supabase via Management API (needs SUPABASE_ACCESS_TOKEN).
 * Usage: SUPABASE_ACCESS_TOKEN=sbp_xxx node scripts/run-sql-via-supabase-api.mjs [migration-file]
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const PROJECT_REF = 'vgrqvwhkvnqsawlwywld';

const token = process.env.SUPABASE_ACCESS_TOKEN;
if (!token) {
  console.error('Missing SUPABASE_ACCESS_TOKEN');
  process.exit(1);
}

const migrationArg = process.argv[2];
const sqlPath = migrationArg
  ? path.resolve(migrationArg)
  : path.join(root, 'supabase/migrations/20260607_p0_security_and_idempotency.sql');

const sql = fs.readFileSync(sqlPath, 'utf8');

const res = await fetch(
  `https://api.supabase.com/v1/projects/${PROJECT_REF}/database/query`,
  {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query: sql }),
  }
);

const body = await res.text();
if (!res.ok) {
  console.error('API error', res.status, body.slice(0, 500));
  process.exit(1);
}

console.log('SQL executed successfully via Supabase Management API.');
console.log('Response:', body.slice(0, 300));
