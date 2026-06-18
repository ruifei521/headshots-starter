#!/usr/bin/env node
/**
 * Generate CRON_SECRET and set it on Vercel production for headshots-starter.
 * Usage: node scripts/vercel-set-cron-secret.mjs [--redeploy]
 */
import { randomBytes } from 'node:crypto';
import { readFileSync, existsSync, writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const tokenFile = join(root, '.vercel-token.local');
const PROJECT = 'headshots-starter';
const KEY = 'CRON_SECRET';

function getToken() {
  if (process.env.VERCEL_TOKEN) return process.env.VERCEL_TOKEN.trim();
  if (existsSync(tokenFile)) return readFileSync(tokenFile, 'utf8').trim();
  console.error('Missing VERCEL_TOKEN or .vercel-token.local');
  process.exit(1);
}

async function listEnv(token) {
  const res = await fetch(
    `https://api.vercel.com/v9/projects/${PROJECT}/env`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  if (!res.ok) {
    throw new Error(`list env failed: ${res.status} ${await res.text()}`);
  }
  return res.json();
}

async function deleteEnv(token, id) {
  const res = await fetch(`https://api.vercel.com/v9/projects/${PROJECT}/env/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok && res.status !== 404) {
    throw new Error(`delete env failed: ${res.status} ${await res.text()}`);
  }
}

async function createEnv(token, value) {
  const res = await fetch(`https://api.vercel.com/v10/projects/${PROJECT}/env`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      key: KEY,
      value,
      type: 'encrypted',
      target: ['production'],
    }),
  });
  if (!res.ok) {
    throw new Error(`create env failed: ${res.status} ${await res.text()}`);
  }
  return res.json();
}

const token = getToken();
const secret = randomBytes(32).toString('hex');

console.log(`Setting ${KEY} on Vercel project "${PROJECT}" (production)...`);

const existing = await listEnv(token);
const matches = (existing.envs || []).filter((e) => e.key === KEY);
for (const env of matches) {
  console.log(`Removing existing ${KEY} (${env.id})...`);
  await deleteEnv(token, env.id);
}

await createEnv(token, secret);
console.log(`✅ ${KEY} created (${secret.length} chars). Value stored encrypted on Vercel.`);

// Save locally for audit script (gitignored file)
const localFile = join(root, '.cron-secret.local');
writeFileSync(localFile, `${KEY}=${secret}\n`, 'utf8');
console.log(`Local copy: ${localFile} (do not commit)`);

if (process.argv.includes('--redeploy')) {
  console.log('Redeploying production...');
  const deployScript = join(root, 'scripts', 'vercel-deploy-now.mjs');
  const result = spawnSync(process.execPath, [deployScript], {
    cwd: root,
    encoding: 'utf8',
    stdio: 'inherit',
  });
  process.exit(result.status ?? 1);
}

console.log('\nNext: redeploy so production picks up the new env var:');
console.log('  node scripts/vercel-deploy-now.mjs');
