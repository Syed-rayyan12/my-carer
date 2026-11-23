import { readFileSync } from 'node:fs';
import { parseEnv } from 'node:util';
import { defineConfig } from 'vitest/config';
const testEnv = parseEnv(readFileSync('.env.test.local', 'utf8'));
if (!new URL(testEnv.DATABASE_URL ?? '').pathname.endsWith('/carer_auth_test'))
  throw new Error('Frontend integration requires the disposable test database');
export default defineConfig({
  test: {
    environment: 'node',
    include: ['tests/frontend.integration.test.ts'],
    testTimeout: 30000,
    hookTimeout: 30000,
    env: {
      ...testEnv,
      NODE_ENV: 'test',
      LOG_LEVEL: 'silent',
      FRONTEND_TEST_URL: 'http://localhost:3100',
    },
  },
});
