import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/auth': 'http://localhost:5000',
      '/sessions': 'http://localhost:5000',
      '/ai': 'http://localhost:5000',
    }
  }
})
