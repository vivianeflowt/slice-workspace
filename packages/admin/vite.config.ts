import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import browserSync from 'vite-plugin-browser-sync';
import content from '@originjs/vite-plugin-content';

export default defineConfig({
  plugins: [react(), tailwindcss(), browserSync({}), content()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:11111',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
});
