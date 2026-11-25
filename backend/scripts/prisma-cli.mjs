import { createRequire } from 'node:module';
import { spawnSync } from 'node:child_process';

const require = createRequire(import.meta.url);
const cli = require.resolve('prisma/build/index.js');
const result = spawnSync(process.execPath, [cli, ...process.argv.slice(2)], {
  stdio: 'inherit',
  env: { ...process.env, PRISMA_HIDE_UPDATE_MESSAGE: 'true' },
});

if (result.error) {
  console.error('Unable to start Prisma:', result.error.message);
  process.exit(1);
}
process.exit(result.status ?? 1);
