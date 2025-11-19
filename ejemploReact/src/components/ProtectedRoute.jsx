// ProtectedRoute.jsx
// Wrapper para rutas que requieren que el usuario esté autenticado.
// - Si no hay token, redirige a `/login`.
// - Si se pasan `allowedRoles`, también valida que el usuario tenga alguno.
import React from 'react'
import { Navigate } from 'react-router-dom'
import { useUser } from '../context/UserContext'

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { token, user } = useUser()
  // Si no hay token, el usuario no está autenticado: ir a login
  if (!token) return <Navigate to="/login" replace />

  // Si se requieren roles específicos, comprobamos si el usuario los tiene
  if (allowedRoles && allowedRoles.length > 0) {
    const userRoles = []
    if (user) {
      // Algunas APIs devuelven roles como array o como campo `role`.
      if (Array.isArray(user.roles)) user.roles.forEach((r) => userRoles.push(String(r)))
      if (user.role) userRoles.push(String(user.role))
      if (user.roles && typeof user.roles === 'string') userRoles.push(user.roles)
    }
    const allowed = allowedRoles.some((r) => userRoles.includes(String(r)))
    // Si no tiene rol permitido, redirigimos al feed (o podríamos mostrar 403)
    if (!allowed) return <Navigate to="/feed" replace />
  }

  // Si pasa todas las comprobaciones, renderizamos los children (la página)
  return children
}

export default ProtectedRoute
