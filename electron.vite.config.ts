import { resolve } from 'path';
import { defineConfig, externalizeDepsPlugin } from 'electron-vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()],
  },
  preload: {
    plugins: [externalizeDepsPlugin()],
  },
  renderer: {
    root: resolve(__dirname, 'renderer'),
    resolve: {
      alias: {
        '@': resolve('renderer/src'),
        '@app': resolve('renderer/src/app'),
        '@data': resolve('renderer/src/data'),
        '@components': resolve('renderer/src/components'),
        '@pages': resolve('renderer/src/pages'),
      },
    },
    plugins: [react()],
    build: {
      outDir: resolve(__dirname, 'dist/renderer'),
      rollupOptions: {
        // Explicitly point to your renderer's index.html
        input: resolve(__dirname, 'renderer/index.html'),
      },
    },
  },
});
