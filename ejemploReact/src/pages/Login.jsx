// Login.jsx
// Pantalla de inicio de sesión. Muestra un formulario que envía credenciales
// a la API. En caso de éxito llama a `login()` del contexto para guardar el token.
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login as apiLogin } from '../api/adapter'
import { useUser } from '../context/UserContext'
import { Container, Box, TextField, Button, Typography, Alert, CircularProgress } from '@mui/material'

const Login = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  // login viene del UserContext y actualiza token/usuario
  const { login } = useUser()
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      // Usamos el adaptador para aislar la lógica de la API
      const { token, refreshToken, user } = await apiLogin({ username, password })
      // Guardamos token/usuario a través del contexto
      login(token, user, refreshToken)
      navigate('/feed')
    } catch (err) {
      // Mostramos error de manera amigable
      const msg = err?.response?.data?.message || err?.response?.data || err?.message || 'Error de autenticación'
      setError(msg)
      setLoading(false)
    }
  }

  return (
    <Container maxWidth="xs" sx={{ mt: 8 }}>
      {/* Formulario de login */}
      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'grid', gap: 2 }}>
        <Typography variant="h5" component="h1" align="center">
          Iniciar sesión
        </Typography>
        {error && <Alert severity="error">{error}</Alert>}
        <TextField label="Usuario" value={username} onChange={(e) => setUsername(e.target.value)} required placeholder="kminchelle" />
        <TextField label="Contraseña" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="0lelplR" />
        <Typography variant="caption">Prueba: usuario <code>kminchelle</code> / contraseña <code>0lelplR</code></Typography>
        <Button type="submit" variant="contained" disabled={loading}>
          {loading ? <CircularProgress size={20} color="inherit" /> : 'Ingresar'}
        </Button>
      </Box>
    </Container>
  )
}

export default Login
