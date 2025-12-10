import react from '@vitejs/plugin-react';
import { globSync } from 'glob';
import path from 'path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import { libInjectCss } from 'vite-plugin-lib-inject-css';

function buildLibEntries() {
  const matches = globSync('src/*/index.ts', {
    nodir: true,
    absolute: false,
  });

  const entries: Record<string, string> = {};
  for (const file of matches) {
    const dir = path.basename(path.dirname(file));
    entries[dir] = file;
  }

  return entries;
}

const autoEntries = buildLibEntries();

export default defineConfig({
  plugins: [react(),
  libInjectCss(),
  dts({
    insertTypesEntry: true,
    outDir: 'dist/types',
    exclude: ['**/*.stories.*', '**/*.test.*']
  })
  ],
  build: {
    lib: {
      entry: autoEntries,
      fileName: (format) => `uib.${'[name]'}.${format}`,
      formats: ['es', 'cjs']
    },
    cssCodeSplit: true,
    rollupOptions: {
      external: ['react', 'react-dom'],
      output: {
        assetFileNames: 'uib.asset.[name][extname]',
      },

    }
  }
});