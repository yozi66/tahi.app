import { resolve } from 'path';
import { defineConfig, externalizeDepsPlugin } from 'electron-vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()],
    build: {
      rollupOptions: {
        input: resolve(__dirname, 'electron/main/index.ts'),
      },
    },
  },
  preload: {
    plugins: [externalizeDepsPlugin()],
    build: {
      rollupOptions: {
        input: resolve(__dirname, 'electron/preload/index.ts'),
      },
    },
  },
  renderer: {
    root: resolve(__dirname, 'renderer'),
    resolve: {
      alias: {
        '@': resolve(__dirname, 'renderer/src'),
      },
    },
    plugins: [react()],
    build: {
      outDir: resolve(__dirname, 'out/renderer'),
      rollupOptions: {
        // Explicitly point to your renderer's index.html
        input: resolve(__dirname, 'renderer/index.html'),
      },
    },
  },
});
