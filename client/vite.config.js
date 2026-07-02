import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  base: '/',
  plugins: [react()],
  server: {
    port: 3005,
    proxy: {
      '/api': {
        target: '${import.meta.env.VITE_API_BASE_URL}',
        changeOrigin: true
      },
      '/images/uploads': {
        target: '${import.meta.env.VITE_API_BASE_URL}',
        changeOrigin: true
      }
    }
  }
})

