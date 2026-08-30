import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// La app entera tiene que funcionar SIN internet: es la condición para que
// papá pueda dejársela a José sin miedo (nada que se cargue de afuera, nada
// que pueda cambiar sin que nosotros lo veamos). Por eso todo —imágenes,
// audio, datos— se cachea en la instalación y no hay ni una llamada de red.
export default defineConfig({
  base: './',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'English with Captain José',
        short_name: 'English',
        description: 'Inglés para José: frases, cuentos y oraciones. Sin internet.',
        theme_color: '#1b6b4a',
        background_color: '#fdf6e8',
        display: 'fullscreen',
        // Sin `orientation`: José la va a usar en el celular de papá y en la
        // tablet, de pie y de lado. El diseño se adapta (ver global.css).
        start_url: './',
        icons: [
          { src: './icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: './icons/icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: './icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,jpg,webp,json,mp3,woff2}'],
        maximumFileSizeToCacheInBytes: 12 * 1024 * 1024,
      },
    }),
  ],
})
