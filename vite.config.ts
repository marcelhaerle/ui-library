/// <reference types="vitest/config" />
import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [
    react(),
    dts({
      insertTypesEntry: true,
      include: ['src'],
      exclude: ['**/*.stories.tsx', '**/*.test.tsx', '**/*.spec.tsx'],
    }),
  ],
  test: {
    environment: 'jsdom',
    globals: true,
  },
  build: {
    lib: {
      entry: resolve(import.meta.dirname, 'src/index.ts'),
      name: 'UILibrary',
      formats: ['es', 'cjs'],
      fileName: (format) => (format === 'es' ? 'index.js' : 'index.cjs'),
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'react/jsx-runtime', 'react/jsx-dev-runtime', 'tailwindcss'],
      output: {
        banner: '"use client";',
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          'react/jsx-runtime': 'jsxRuntime',
          tailwindcss: 'tailwindcss',
        },
      },
    },
    sourcemap: true,
    emptyOutDir: true,
  },
});
