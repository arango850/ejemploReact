// RoleWrapper.jsx
// Componente que envuelve contenido que debe ser visto solo por ciertos roles.
// Separa la lógica de roles del resto de la aplicación para mayor claridad.
import React from 'react'
import { Navigate } from 'react-router-dom'
import { useUser } from '../context/UserContext'

const RoleWrapper = ({ allowedRoles = [], children }) => {
  const { user } = useUser()

  // Si no hay roles requeridos, simplemente renderizamos children
  if (!allowedRoles || allowedRoles.length === 0) return children

  // Normalizamos roles desde el objeto `user` para soportar distintos formatos
  const userRoles = []
  if (user) {
    if (Array.isArray(user.roles)) user.roles.forEach((r) => userRoles.push(String(r)))
    if (user.role) userRoles.push(String(user.role))
    if (user.roles && typeof user.roles === 'string') userRoles.push(user.roles)
  }

  const allowed = allowedRoles.some((r) => userRoles.includes(String(r)))

  // Si el usuario no tiene el rol necesario, redirigimos (o podríamos mostrar 403)
  if (!allowed) {
    return <Navigate to="/feed" replace />
  }

  return children
}

export default RoleWrapper
