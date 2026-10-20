/// <reference types="vitest" />
import { defineConfig, UserConfig } from 'vite';
import type { InlineConfig } from 'vitest/node';
import react from '@vitejs/plugin-react';

interface VitestConfigExport extends UserConfig {
  test?: InlineConfig;
}

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
  }
} as VitestConfigExport);
