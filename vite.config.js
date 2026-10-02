import { defineConfig } from 'vite';

// Relative base so the build works on GitHub Pages, Netlify, or file hosting alike.
export default defineConfig({
  base: './',
  build: { target: 'es2020', assetsDir: 'bundle', assetsInlineLimit: 0 },
});
