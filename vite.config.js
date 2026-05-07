import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],

  build: {
    // Avertit si un chunk dépasse 500 kB
    chunkSizeWarningLimit: 500,

    rollupOptions: {
      output: {
        // Sépare les vendors en chunks cachables indépendamment du code app
        manualChunks: {
          'vendor-react':  ['react', 'react-dom', 'react-router-dom'],
          'vendor-motion': ['framer-motion'],
          'vendor-email':  ['@emailjs/browser'],
        },
      },
    },
  },

  // Résolution des imports
  resolve: {
    alias: { '@': '/src' },
  },
})
