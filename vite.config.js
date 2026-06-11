import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    proxy: {
      // 로컬 개발 시 CORS 우회: /api/search → 네이버 API
      '/api/search': {
        target: 'https://openapi.naver.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/search/, '/v1/search/shop.json'),
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq) => {
            proxyReq.setHeader('X-Naver-Client-Id', process.env.VITE_NAVER_CLIENT_ID || '');
            proxyReq.setHeader('X-Naver-Client-Secret', process.env.VITE_NAVER_CLIENT_SECRET || '');
          });
        },
        secure: true,
      },
    },
  },
})
