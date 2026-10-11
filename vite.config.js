import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath, URL } from 'node:url'
import { mockApi } from './scripts/dev-mock-api.js'

// Gehostet auf Spacefast unter "/". Für einen anderen Pfad VITE_BASE setzen.
// Lokale Entwicklung gegen ein Spacefast-Backend:
//   SF_PROXY_TARGET=https://<space>.space.fast SF_PROXY_COOKIE='__Host-spacefast_session=…' npm run dev
// (die Functions laufen nicht im Vite-Dev-Server, /api wird deshalb weitergeleitet)
// Ohne echten Space: MOCK_API=1 npm run dev  → Test-Attrappe im Speicher (scripts/dev-mock-api.js)
const proxyTarget = process.env.SF_PROXY_TARGET
const proxyCookie = process.env.SF_PROXY_COOKIE

// https://vite.dev/config/
export default defineConfig({
  base: process.env.VITE_BASE || '/',
  plugins: [react(), tailwindcss(), ...(process.env.MOCK_API === '1' ? [mockApi()] : [])],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  server: proxyTarget
    ? {
        proxy: {
          '/api': {
            target: proxyTarget,
            changeOrigin: true,
            headers: { origin: proxyTarget, ...(proxyCookie ? { cookie: proxyCookie } : {}) },
          },
        },
      }
    : undefined,
})
