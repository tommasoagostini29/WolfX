import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate', // Aggiorna l'app appena c'è una nuova versione
      devOptions: {
        enabled: true // Abilita la PWA anche mentre sviluppi (localhost)
      },
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      manifest: {
        name: 'WolfX Trading',
        short_name: 'WolfX',
        description: 'Simulatore di Trading Crypto',
        theme_color: '#1a1a1a',
        background_color: '#1a1a1a',
        display: 'standalone', // Nasconde la barra degli indirizzi del browser
        icons: [
          {
            src: 'pwa-192x192.png', // Assicurati di mettere un'immagine con questo nome in public/
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],
})