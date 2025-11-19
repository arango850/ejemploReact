// UserContext: proporciona el estado de autenticación a toda la app.
// Expone: `user`, `token`, `refreshToken`, `login()` y `logout()`.
// Los componentes que necesiten saber si el usuario está logueado usan `useUser()`.
import React, { createContext, useContext, useEffect, useState } from 'react'
import api from '../api/api'

const UserContext = createContext(null)

export const UserProvider = ({ children }) => {
  // Intentamos inicializar el estado desde localStorage para persistencia simple
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem('user')
    return raw ? JSON.parse(raw) : null
  })
  const [token, setToken] = useState(() => localStorage.getItem('token') || null)
  const [refreshToken, setRefreshToken] = useState(() => localStorage.getItem('refreshToken') || null)

  // Cuando cambia el token, actualizamos la instancia de `api` para incluir
  // el header Authorization en todas las peticiones. Esto evita repetir el header.
  useEffect(() => {
    if (token) {
      api.defaults.headers.common = api.defaults.headers.common || {}
      api.defaults.headers.common.Authorization = `Bearer ${token}`
    } else if (api.defaults.headers && api.defaults.headers.common) {
      delete api.defaults.headers.common.Authorization
    }
  }, [token])

  // login: guarda token y usuario en estado y en localStorage.
  // Parámetros:
  // - newToken: string JWT
  // - userData: objeto con información del usuario
  // - newRefreshToken: token de refresco (opcional)
  const login = (newToken, userData, newRefreshToken = null) => {
    setToken(newToken)
    setUser(userData)
    if (newRefreshToken) {
      setRefreshToken(newRefreshToken)
      localStorage.setItem('refreshToken', newRefreshToken)
    }
    localStorage.setItem('token', newToken)
    localStorage.setItem('user', JSON.stringify(userData))
    api.defaults.headers.common = api.defaults.headers.common || {}
    api.defaults.headers.common.Authorization = `Bearer ${newToken}`
  }

  // logout: limpia estado y localStorage.
  // Se usa para desconectar al usuario y limpiar credenciales.
  const logout = () => {
    setToken(null)
    setRefreshToken(null)
    setUser(null)
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    localStorage.removeItem('refreshToken')
    if (api.defaults.headers && api.defaults.headers.common) {
      delete api.defaults.headers.common.Authorization
    }
  }

  return (
    <UserContext.Provider value={{ user, token, refreshToken, login, logout }}>
      {children}
    </UserContext.Provider>
  )
}

// Hook personalizado para consumir el contexto de usuario en cualquier componente:
export const useUser = () => {
  const ctx = useContext(UserContext)
  if (!ctx) throw new Error('useUser must be used within UserProvider')
  return ctx
}

export default UserContext
