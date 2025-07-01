import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import svgr from 'vite-plugin-svgr'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    svgr(),
  ],
  build: {
    rollupOptions: {
      external: [
        '@tailwindcss/oxide-win32-x64-msvc',
        'lightningcss',
      ],
    },
  },
  server: {
    proxy: {
      // FastAPI로 프록시
      '/api/fastapi': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/fastapi/, '/api/fastapi'),
      },
      // Spring Boot로 프록시
      '/api': {
        target: 'http://localhost:8091',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/api'),
      },
    },
  },
})