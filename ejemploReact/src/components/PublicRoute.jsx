// PublicRoute.jsx
// Wrapper para rutas públicas (por ejemplo la pantalla de login).
// Si el usuario ya está autenticado (hay token), lo redirige al `feed`.
import React from 'react'
import { Navigate } from 'react-router-dom'
import { useUser } from '../context/UserContext'

const PublicRoute = ({ children }) => {
  const { token } = useUser()
  // Si ya hay token, no tiene sentido mostrar la ruta pública (ej. login)
  if (token) {
    return <Navigate to="/feed" replace />
  }
  return children
}

export default PublicRoute
