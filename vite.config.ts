import react from '@vitejs/plugin-react';
import { glob } from 'glob';
import path from 'path';
import { defineConfig } from 'vite';


const entries = Object.fromEntries(
  glob.sync('src/**/index.ts').map(file => {
    const name = file
      .replace('src/', '')
      .replace('/index.ts', '');
    return [name, path.resolve(__dirname, file)];
  })
);


export default defineConfig({
    plugins: [react()],
    build: {
        lib: {
            entry: './src/index.ts',
            name: 'uibora',
            fileName: (format) => `uibora.${format}.js`,
            formats: ['es', 'cjs']
        },
        rollupOptions: {
            external: ['react', 'react-dom']
        }
    }
});