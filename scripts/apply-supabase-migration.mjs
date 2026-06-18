/**
 * Applies a Supabase migration SQL file using DATABASE_URL or POSTGRES_URL.
 * Usage: node scripts/apply-supabase-migration.mjs [migration-file]
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pg from 'pg';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  const text = fs.readFileSync(filePath, 'utf8');
  for (const line of text.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq);
    let val = trimmed.slice(eq + 1).trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = val;
  }
}

const root = path.join(__dirname, '..');
for (const f of ['.env.local', '.env.prod', '.env.migration.pull']) {
  loadEnvFile(path.join(root, f));
}

const migrationArg = process.argv[2];
const defaultMigration = 'supabase/migrations/20260607_p0_security_and_idempotency.sql';
const sqlPath = path.join(root, migrationArg || defaultMigration);

if (!fs.existsSync(sqlPath)) {
  console.error(`Migration file not found: ${sqlPath}`);
  process.exit(1);
}

const databaseUrl =
  process.env.DATABASE_URL ||
  process.env.POSTGRES_URL ||
  process.env.POSTGRES_PRISMA_URL ||
  process.env.SUPABASE_DB_URL;

if (!databaseUrl) {
  console.error(
    'Missing DATABASE_URL / POSTGRES_URL. Set it in .env.local or run: vercel env pull .env.migration.pull --environment=production'
  );
  process.exit(1);
}

const sql = fs.readFileSync(sqlPath, 'utf8');

const client = new pg.Client({
  connectionString: databaseUrl,
  ssl: { rejectUnauthorized: false },
});

async function verify(client) {
  const cols = await client.query(`
    SELECT column_name FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'models'
      AND column_name IN ('images_generated', 'total_images')
  `);
  const idx = await client.query(`
    SELECT indexname FROM pg_indexes
    WHERE schemaname = 'public' AND tablename = 'orders'
      AND indexname = 'idx_orders_creem_checkout_id_unique'
  `);
  const policies = await client.query(`
    SELECT policyname FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'credits'
      AND policyname IN (
        'Enable insert for authenticated users only',
        'Enable update for authenticated users'
      )
  `);
  return {
    columns: cols.rows.map((r) => r.column_name),
    hasCheckoutUniqueIndex: idx.rows.length > 0,
    removedAuthCreditPolicies: policies.rows.length === 0,
  };
}

try {
  await client.connect();
  console.log(`Connected. Running migration: ${path.relative(root, sqlPath)}`);
  await client.query(sql);
  const result = await verify(client);
  console.log('Migration applied successfully.');
  console.log('models columns:', result.columns.join(', ') || '(none)');
  console.log('orders checkout unique index:', result.hasCheckoutUniqueIndex ? 'yes' : 'no');
  console.log('auth credit write policies removed:', result.removedAuthCreditPolicies ? 'yes' : 'no');
} catch (err) {
  console.error('Migration failed:', err.message);
  process.exit(1);
} finally {
  await client.end();
}
