import { readFileSync } from 'node:fs';
import { parseEnv } from 'node:util';
import { defineConfig } from 'vitest/config';
// Explicit opt-in database. This file must point at a disposable carer_auth_test database.
const testEnv = parseEnv(readFileSync('.env.test.local', 'utf8'));
if (!new URL(testEnv.DATABASE_URL ?? '').pathname.endsWith('/carer_auth_test'))
  throw new Error('Integration tests require database carer_auth_test');
export default defineConfig({
  test: {
    environment: 'node',
    include: ['tests/auth.integration.test.ts', 'tests/platform.integration.test.ts', 'tests/public-profile.integration.test.ts'],
    testTimeout: 30000,
    hookTimeout: 30000,
    fileParallelism: false,
    env: { ...testEnv, NODE_ENV: 'test', LOG_LEVEL: 'silent', TRUST_PROXY: '1' },
  },
});
