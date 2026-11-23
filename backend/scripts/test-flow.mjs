import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../../', import.meta.url));
const backend = fileURLToPath(new URL('../', import.meta.url));
const stages = [
  [root, 'typecheck'], [backend, 'typecheck'], [backend, 'test'],
  [backend, 'test:ui'], [backend, 'test:integration'],
];
for (const [cwd, script] of stages) {
  console.log(`\nChecking ${cwd === root ? 'frontend' : 'backend'}: ${script}`);
  const result = spawnSync(process.platform === 'win32' ? 'npm.cmd' : 'npm', ['run', script], {
    cwd, stdio: 'inherit', shell: process.platform === 'win32',
  });
  if (result.error) console.error(result.error.message);
  if (result.error || result.status !== 0) process.exit(result.status || 1);
}
console.log('\nAutomated flow passed. Complete browser acceptance in backend/docs/testing-flow.md.');
