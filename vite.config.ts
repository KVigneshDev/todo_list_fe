import { fileURLToPath, URL } from 'node:url';

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  resolve: {
    // `@/...` -> `src/...` keeps imports short and refactor-safe.
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    port: 5173,
    // In dev, proxy API calls to the FastAPI backend so the browser talks to a
    // single origin (no CORS preflight) and the app can use relative `/api`
    // URLs that also work behind a reverse proxy in production.
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
    },
  },
});
