import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  base: '/WEB_async/',
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        timer: resolve(__dirname, '1-timer.html'),
        snackbar: resolve(__dirname, '2-snackbar.html'),
        images: resolve(__dirname, '3-images.html'),
      },
    },
  },
});