#!/usr/bin/env node
/** Verify production cron auth without printing the secret. */
import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const localFile = join(root, '.cron-secret.local');

if (!existsSync(localFile)) {
  console.error('Missing .cron-secret.local — run vercel-set-cron-secret.mjs first');
  process.exit(1);
}

const secret = readFileSync(localFile, 'utf8')
  .split('\n')
  .find((l) => l.startsWith('CRON_SECRET='))
  ?.slice('CRON_SECRET='.length)
  .trim();

if (!secret) {
  console.error('Could not parse CRON_SECRET from local file');
  process.exit(1);
}

const url = 'https://snapprohead.com/api/cron/reconcile-stale-models';

const noAuth = await fetch(url);
console.log('Without Authorization:', noAuth.status, noAuth.status === 401 ? '(expected 401)' : '');

const withAuth = await fetch(url, {
  headers: { Authorization: `Bearer ${secret}` },
});
const body = await withAuth.text();
console.log('With CRON_SECRET:', withAuth.status, body.slice(0, 120));

process.exit(withAuth.ok ? 0 : 1);
