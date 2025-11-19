// Admin.jsx
// Página de ejemplo para mostrar cómo proteger rutas por rol.
// En este proyecto la ruta /admin está envuelta en RoleWrapper que exige 'admin'.
import React from 'react'
import Header from '../components/Header'
import { Container, Typography } from '@mui/material'

const Admin = () => {
  return (
    <>
      <Header />
      <Container sx={{ mt: 4 }}>
        <Typography variant="h4">Panel de administración</Typography>
        <Typography sx={{ mt: 2 }}>Esta página está protegida por roles (admin).</Typography>
      </Container>
    </>
  )
}

export default Admin
