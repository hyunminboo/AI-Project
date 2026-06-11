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
      // 네이버 쇼핑 검색 API CORS 우회
      // 브라우저 → /api/naver/... → openapi.naver.com/...
      '/api/naver': {
        target: 'https://openapi.naver.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/naver/, ''),
        secure: true,
      },
    },
  },
})
