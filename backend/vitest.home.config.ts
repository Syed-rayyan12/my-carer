import { defineConfig } from 'vitest/config';
import ui from './vitest.ui.config.js';
export default defineConfig({ ...ui, test: { environment: 'node', include: ['tests/home-content.spec.ts'] } });
