// theme.js
// Configuración central del tema de Material UI usada por ThemeProvider.
// Aquí definimos colores primarios/secundarios y defaults de componentes.
import { createTheme } from '@mui/material/styles'

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#9c27b0',
    },
  },
  components: {
    MuiButton: {
      defaultProps: {
        // disableElevation quita la sombra por defecto del botón
        disableElevation: true,
      },
    },
  },
})

export default theme
