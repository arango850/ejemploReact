// Header.jsx
// Barra superior que muestra el título y la información del usuario.
// - Usa Material UI `AppBar` para la apariencia.
// - `useUser()` viene de `UserContext` y permite cerrar sesión.
import React from 'react'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import { useNavigate } from 'react-router-dom'
import { useUser } from '../context/UserContext'

const Header = () => {
  // useNavigate permite cambiar de ruta programáticamente
  const navigate = useNavigate()
  // useUser expone `user` (info) y `logout()`
  const { user, logout } = useUser()

  // Construimos un nombre legible a partir del objeto `user`.
  const name = user
    ? (user.firstName || user.name || user.username || user.email) + (user.lastName ? ' ' + user.lastName : '')
    : 'Usuario'

  const handleLogout = () => {
    // Llamamos a logout del contexto y redirigimos a /login
    logout()
    navigate('/login')
  }

  return (
    <AppBar position="static">
      <Toolbar>
        {/* Título o logo de la app */}
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Taller React - Feed
        </Typography>

        {/* Área con avatar, nombre y botón de cerrar sesión */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {/* Avatar usa la primera letra del nombre */}
          <Avatar sx={{ bgcolor: 'secondary.main', width: 32, height: 32 }}>{name ? name.charAt(0).toUpperCase() : 'U'}</Avatar>
          <Typography variant="body1">{name}</Typography>
          <Button color="inherit" onClick={handleLogout}>Cerrar sesión</Button>
        </Box>
      </Toolbar>
    </AppBar>
  )
}

export default Header
