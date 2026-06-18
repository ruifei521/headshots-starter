import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const envFile = path.join(root, process.argv[2] || '.env.prod.check');

function loadEnv(filePath) {
  const env = {};
  if (!fs.existsSync(filePath)) return env;
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

console.log(
  JSON.stringify(
    {
      ASTRIA_TEST_MODE: env.ASTRIA_TEST_MODE ?? '(missing)',
      ASTRIA_TEST_MODE_ok: env.ASTRIA_TEST_MODE !== 'true',
      DEPLOYMENT_URL: env.DEPLOYMENT_URL ?? '(missing)',
      DEPLOYMENT_URL_ok: (env.DEPLOYMENT_URL || '').includes('snapprohead.com'),
      CRON_SECRET_set: Boolean(env.CRON_SECRET?.length),
      CREEM_WEBHOOK_SECRET_set: Boolean(env.CREEM_WEBHOOK_SECRET),
      CREEM_API_KEY_set: Boolean(env.CREEM_API_KEY),
      ASTRIA_API_KEY_set: Boolean(env.ASTRIA_API_KEY),
      DATABASE_URL_set: Boolean(env.DATABASE_URL || env.POSTGRES_URL),
    },
    null,
    2
  )
);
