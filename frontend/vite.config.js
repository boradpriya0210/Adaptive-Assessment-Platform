import { defineConfig } from 'vite';

const apiTarget = 'http://127.0.0.1:8080';

export default defineConfig({
  root: './',
  base: '/',
  server: {
    port: 3000,
    open: '/pages/login.html',
    proxy: {
      '/api': {
        target: apiTarget,
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    outDir: '../dist',
    emptyOutDir: true
  }
});
