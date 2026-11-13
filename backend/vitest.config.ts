import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['tests/**/*.test.ts'],
    setupFiles: ['./tests/setup.ts'],
    env: {
      NODE_ENV: 'test',
      PORT: '4000',
      DATABASE_URL: 'postgresql://carer:local_development_only@localhost:5432/carer?schema=public',
      CORS_ORIGIN: 'http://localhost:3000',
      LOG_LEVEL: 'silent',
      RATE_LIMIT_WINDOW_MS: '900000',
      RATE_LIMIT_MAX: '100',
      TRUST_PROXY: '0',
    },
  },
});
