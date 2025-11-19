// NotFound.jsx
// Componente simple para mostrar cuando la ruta no existe (404).
import React from 'react'
import { Container, Typography, Button } from '@mui/material'
import { Link } from 'react-router-dom'

const NotFound = () => (
  <Container sx={{ mt: 8, textAlign: 'center' }}>
    <Typography variant="h3">404</Typography>
    <Typography variant="h6" sx={{ mb: 3 }}>Página no encontrada</Typography>
    <Button component={Link} to="/feed" variant="contained">Ir al Feed</Button>
  </Container>
)

export default NotFound
