import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./setupTests.ts'],
    include: ['src/components/ui/**/*.test.{ts,tsx}'],
    exclude: ['tests', 'tests-examples', '**/*.e2e.*', '**/__e2e__/**'],
  },
});
