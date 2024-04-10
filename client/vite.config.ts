import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dns from 'node:dns'

dns.setDefaultResultOrder('verbatim')

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    cors: true,
    host: true,
    proxy: {
      "/socket.io": {
        target: "ws://192.168.1.28:4000",
        ws: true,
      },

    }
  }
})
