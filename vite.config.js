import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://studymate-backend-4u7f.onrender.com',
        changeOrigin: true,
      },
    },
  },
})