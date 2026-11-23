import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';
export default defineConfig({
  resolve: { alias: {
    '@': fileURLToPath(new URL('../', import.meta.url)),
    react: fileURLToPath(new URL('../node_modules/react', import.meta.url)),
    'react-dom': fileURLToPath(new URL('../node_modules/react-dom', import.meta.url)),
  } },
  test: { environment: 'node', include: ['tests/dashboard-loading.test.ts', 'tests/tab-session.test.ts', 'tests/website-session.test.ts'] },
});
