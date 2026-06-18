#!/usr/bin/env node
/**
 * One-click deploy: auto-installs vercel@54.9.1 if missing/outdated, then deploys.
 */
import { spawnSync } from 'node:child_process';
import { readFileSync, existsSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const tokenFile = join(root, '.vercel-token.local');
const logFile = join(root, 'deploy-result.txt');
const REQUIRED_MAJOR = 47;
const INSTALL_VERSION = '54.9.1';

const lines = [];
const log = (msg) => {
  const line = `[${new Date().toISOString()}] ${msg}`;
  console.log(line);
  lines.push(line);
};

function getToken() {
  if (process.env.VERCEL_TOKEN) return process.env.VERCEL_TOKEN.trim();
  if (existsSync(tokenFile)) return readFileSync(tokenFile, 'utf8').trim();
  log('ERROR: Missing .vercel-token.local');
  process.exit(1);
}

function getInstalledVersion() {
  const pkgPath = join(root, 'node_modules', 'vercel', 'package.json');
  if (!existsSync(pkgPath)) return null;
  try {
    return JSON.parse(readFileSync(pkgPath, 'utf8')).version;
  } catch {
    return null;
  }
}

function needsInstall(version) {
  if (!version) return true;
  const major = parseInt(version.split('.')[0], 10);
  return Number.isNaN(major) || major < REQUIRED_MAJOR;
}

function run(cmd, args, timeout = 600000) {
  return spawnSync(cmd, args, {
    cwd: root,
    encoding: 'utf8',
    shell: true,
    timeout,
    stdio: 'pipe',
  });
}

function vercelBin() {
  const win = join(root, 'node_modules', '.bin', 'vercel.cmd');
  const unix = join(root, 'node_modules', '.bin', 'vercel');
  return existsSync(win) ? win : unix;
}

log('SnapProHead deploy starting...');

let version = getInstalledVersion();
if (needsInstall(version)) {
  log(`Installing vercel@${INSTALL_VERSION} (current: ${version ?? 'none'})...`);
  const install = run('npm', [
    'install',
    `vercel@${INSTALL_VERSION}`,
    '--save-dev',
    '--no-fund',
    '--no-audit',
    '--registry',
    'https://registry.npmjs.org',
  ]);
  if (install.stdout) log(install.stdout.trim());
  if (install.stderr) log(install.stderr.trim());
  if (install.status !== 0) {
    log(`ERROR: npm install failed exit=${install.status}`);
    writeFileSync(logFile, lines.join('\n'), 'utf8');
    process.exit(1);
  }
  version = getInstalledVersion();
}

log(`Vercel CLI version: ${version}`);
const bin = vercelBin();
if (!existsSync(bin)) {
  log('ERROR: vercel binary not found after install');
  process.exit(1);
}

const token = getToken();

const whoami = run(bin, ['whoami', '--token', token], 120000);
log(`whoami exit=${whoami.status} stdout=${whoami.stdout?.trim()}`);
if (whoami.status !== 0) {
  log(`ERROR: ${whoami.stderr?.trim()}`);
  writeFileSync(logFile, lines.join('\n'), 'utf8');
  process.exit(1);
}

// snapprohead.com is aliased to the headshots-starter project (not snapprohead).
const PRODUCTION_PROJECT = 'headshots-starter';

log(`Deploying to production (project: ${PRODUCTION_PROJECT})...`);
const deploy = run(
  bin,
  ['deploy', '--prod', '--yes', '--project', PRODUCTION_PROJECT, '--token', token],
  600000
);
log(`deploy exit=${deploy.status}`);
if (deploy.stdout) log(`stdout:\n${deploy.stdout}`);
if (deploy.stderr) log(`stderr:\n${deploy.stderr}`);

writeFileSync(logFile, lines.join('\n'), 'utf8');
log(`Log saved: deploy-result.txt`);
process.exit(deploy.status ?? 1);
