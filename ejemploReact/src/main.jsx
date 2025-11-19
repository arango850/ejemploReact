// Punto de entrada de la aplicación
// Aquí montamos React en el DOM y envolvemos la app con providers
// que comparten estado o configuración global (tema, usuario, etc.).
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
// `UserProvider` contiene la información de usuario y token (contexto global)
import { UserProvider } from './context/UserContext'
// Material UI theme provider y reset de estilos
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import theme from './theme'

// createRoot es la forma moderna de montar React en la página.
// Buscamos el elemento con id 'root' en `index.html` y montamos la app.
createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* ThemeProvider: permite usar el tema personalizado creado en `src/theme.js` */}
    <ThemeProvider theme={theme}>
      {/* CssBaseline aplica un reset y estilos base de Material UI */}
      <CssBaseline />
      {/* UserProvider: todo componente dentro podrá acceder al usuario/token mediante useUser() */}
      <UserProvider>
        <App />
      </UserProvider>
    </ThemeProvider>
  </StrictMode>,
)
