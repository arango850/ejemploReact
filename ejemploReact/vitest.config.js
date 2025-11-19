// vitest.config.js
// Configuración de Vitest (runner de tests). Define el entorno de test y
// archivos de setup que se ejecutan antes de las pruebas.
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    // Usamos jsdom para poder renderizar componentes React en tests
    environment: 'jsdom',
    // setupFiles: archivo que se ejecuta antes de las pruebas (setupTests.jsx)
    setupFiles: './src/setupTests.jsx',
    // Habilitar globals (describe/test/expect) para las pruebas
    globals: true,
  },
})
