/**
 * Applies supabase/migrations/20260611_add_credits.sql
 * Requires DATABASE_URL, POSTGRES_URL, or SUPABASE_DB_URL in env.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pg from 'pg';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

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

const root = path.join(__dirname, '..');
for (const f of ['.env.local', '.env.prod', '.env.migration.pull']) {
  loadEnvFile(path.join(root, f));
}

const databaseUrl =
  process.env.DATABASE_URL ||
  process.env.POSTGRES_URL ||
  process.env.POSTGRES_PRISMA_URL ||
  process.env.SUPABASE_DB_URL;

if (!databaseUrl) {
  console.error(
    'Missing DATABASE_URL. Add it to .env.local or Supabase → Settings → Database → Connection string (URI).'
  );
  process.exit(1);
}

const sqlPath = path.join(root, 'supabase/migrations/20260611_add_credits.sql');
const sql = fs.readFileSync(sqlPath, 'utf8');

const client = new pg.Client({
  connectionString: databaseUrl,
  ssl: { rejectUnauthorized: false },
});

try {
  await client.connect();
  console.log('Connected. Running add_credits migration...');
  await client.query(sql);
  const fn = await client.query(`
    SELECT routine_name FROM information_schema.routines
    WHERE routine_schema = 'public' AND routine_name = 'add_credits'
  `);
  console.log('Migration applied. add_credits function:', fn.rows.length ? 'yes' : 'no');
} catch (err) {
  console.error('Migration failed:', err.message);
  process.exit(1);
} finally {
  await client.end();
}
