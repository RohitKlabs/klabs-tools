import { defineConfig } from 'vite';

export default defineConfig({
  // The custom domain serves the app from the site root.
  base: '/',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
});
