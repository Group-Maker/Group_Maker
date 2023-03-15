import { defineConfig } from 'vite';
import { resolve } from 'path';
import envCompatible from 'vite-plugin-env-compatible';

export default defineConfig({
  server: {
    port: 5004,
  },
  resolve: {
    alias: {
      '@': resolve('./src'),
    }
  },
  plugins: [
    envCompatible(),
  ],
  build: {
    rollupOptions: {
      input: {
        main: 'index.html',
      },
    }
  },
})
