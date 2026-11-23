const { spawn } = require('node:child_process');
const { readFileSync } = require('node:fs');
const { parseEnv } = require('node:util');
const path = require('node:path');
const root = process.cwd();
const testEnv = parseEnv(readFileSync('backend/.env.test.local', 'utf8'));
if (!new URL(testEnv.DATABASE_URL).pathname.endsWith('/carer_auth_test')) throw Error('Test database required');
const children = [];
function start(args, cwd, env) {
  const child = spawn(process.execPath, args, { cwd, env: { ...process.env, ...env }, stdio: 'ignore', windowsHide: true });
  children.push(child);
  return child;
}
async function ready(url) {
  for (let i = 0; i < 60; i++) {
    try { const r = await fetch(url); if (r.ok) return; } catch {}
    await new Promise(r => setTimeout(r, 500));
  }
  throw Error('Server did not become ready: ' + url);
}
(async () => {
  try {
    start(['--import', 'tsx', 'src/server.ts'], path.join(root, 'backend'), { ...testEnv, PORT: '4100', NODE_ENV: 'test', LOG_LEVEL: 'silent', CORS_ORIGIN: 'http://localhost:3100', TRUST_PROXY: '1' });
    await ready('http://localhost:4100/api/v1/health/ready');
    start(['node_modules/next/dist/bin/next', 'start', '-p', '3100'], root, { BACKEND_URL: 'http://127.0.0.1:4100' });
    await ready('http://localhost:3100/signin');
    const tests = spawn(process.execPath, ['node_modules/vitest/vitest.mjs', 'run', '--config', 'vitest.frontend.config.ts'], { cwd: path.join(root, 'backend'), env: process.env, stdio: 'inherit', windowsHide: true });
    process.exitCode = await new Promise((resolve, reject) => { tests.on('exit', code => resolve(code ?? 1)); tests.on('error', reject); });
  } finally { for (const child of children) child.kill(); }
})().catch(e => { console.error(e.message); process.exitCode = 1; });
