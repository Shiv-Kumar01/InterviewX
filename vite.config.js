import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// The React dev server proxies /api to Express, so the browser only ever
// talks to one origin and the backend URL stays out of frontend code.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: { '/api': 'http://localhost:5000' },
  },
});
