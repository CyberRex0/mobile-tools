import { fileURLToPath, URL } from 'node:url'
import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    vue(), tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate', includeAssets: ['icon.svg'],
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        maximumFileSizeToCacheInBytes: 3 * 1024 * 1024,
      },
      manifest: {
        name: 'Mobile Network Tools', short_name: 'Mobile Tools',
        description: 'LTE / 5G NR の Cell Identity・ARFCN 計算ツール',
        theme_color: '#f4f7f4', background_color: '#f4f7f4', display: 'standalone', start_url: '/', lang: 'ja',
        icons: [{ src: '/icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any maskable' }],
      },
    }),
  ],
  resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
})
