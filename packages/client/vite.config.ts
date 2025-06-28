import UnoCSS from 'unocss/vite';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [
    UnoCSS({
      configFile: './uno.config.ts',
    }),
    tsconfigPaths(),
  ],
  environments: {},
});
