// vite.config.js
// Configuración de Vite (dev server y build). Aquí registramos plugins
// que mejoran el desarrollo de React (Fast Refresh, compiladores, etc.).
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    // Plugin oficial de React para Vite. Aquí se puede configurar Babel/SWC.
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
  ],
})
