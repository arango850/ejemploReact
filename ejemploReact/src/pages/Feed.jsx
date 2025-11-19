// Feed.jsx
// Pantalla principal que lista posts y permite crear uno nuevo.
// - Usa `api` para cargar posts y soporta paginación simple.
// - Al crear un post, intenta guardarlo en la API; si falla, añade un post local (optimista).
import React, { useEffect, useState } from 'react'
import api from '../api/api'
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Grid,
  CircularProgress,
  Alert,
} from '@mui/material'
import { Link } from 'react-router-dom'
import Header from '../components/Header'
import CardPost from '../components/CardPost'
import { useUser } from '../context/UserContext'

const Feed = () => {
  // Estado local para posts, formulario y controles de paginación
  const [posts, setPosts] = useState([])
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [loading, setLoading] = useState(false)
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState(null)
  const [limit] = useState(9)
  const [skip, setSkip] = useState(0)
  const [total, setTotal] = useState(null)
  const { user } = useUser()

  // fetchPosts: carga posts desde la API. Si opts.reset, reemplaza la lista.
  const fetchPosts = async (opts = { reset: false }) => {
    setError(null)
    setLoading(true)
    try {
      const res = await api.get('/posts', { params: { limit, skip: opts.reset ? 0 : skip } })
      const fetched = res.data.posts || []
      setTotal(res.data.total ?? null)
      if (opts.reset) {
        setPosts(fetched)
        setSkip(fetched.length)
      } else {
        setPosts((p) => [...p, ...fetched])
        setSkip((s) => s + fetched.length)
      }
    } catch (err) {
      setError('No se pudieron cargar los posts')
    } finally {
      setLoading(false)
    }
  }

  // Al montar, cargamos los posts (reset = true)
  useEffect(() => {
    fetchPosts({ reset: true })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // handleCreate: envía el post a la API y lo añade a la lista.
  // Si la API no permite crear, usamos un fallback local (optimista).
  const handleCreate = async (e) => {
    e.preventDefault()
    if (!title || !body) return
    setCreating(true)
    try {
      const payload = { title, body }
      // include user id if available (DummyJSON acepta userId para demostración)
      if (user && user.id) payload.userId = user.id
      const res = await api.post('/posts/add', payload)
      setPosts((p) => [res.data, ...p])
      setTitle('')
      setBody('')
    } catch (err) {
      // fallback local post si la API no persiste
      const fallback = { id: Date.now(), title, body }
      setPosts((p) => [fallback, ...p])
      setTitle('')
      setBody('')
    } finally {
      setCreating(false)
    }
  }

  const handleLoadMore = () => {
    if (total !== null && posts.length >= total) return
    fetchPosts({ reset: false })
  }

  return (
    <>
      {/* Header muestra título y usuario */}
      <Header />
      <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Feed
      </Typography>

      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle1">Conectado como: {user ? (user.firstName || user.username || user.email) : 'Invitado'}</Typography>
      </Box>

      {/* Formulario para crear un nuevo post */}
      <Box component="form" onSubmit={handleCreate} sx={{ mb: 3, display: 'grid', gap: 2 }}>
        <TextField label="Título" value={title} onChange={(e) => setTitle(e.target.value)} required />
        <TextField label="Contenido" value={body} onChange={(e) => setBody(e.target.value)} multiline rows={3} required />
        <Button type="submit" variant="contained" disabled={creating}>{creating ? <CircularProgress size={18} color="inherit" /> : 'Crear Post'}</Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {/* Lista de posts usando Grid y el componente CardPost */}
      <Grid container spacing={2}>
        {posts.map((post) => (
          <Grid item xs={12} sm={6} md={4} key={post.id}>
            <CardPost post={post} />
          </Grid>
        ))}
      </Grid>

      <Box sx={{ mt: 3, textAlign: 'center' }}>
        {loading ? (
          <CircularProgress />
        ) : (
          total === null || posts.length < total ? (
            <Button onClick={handleLoadMore}>Cargar más</Button>
          ) : (
            <Typography variant="body2">No hay más posts</Typography>
          )
        )}
      </Box>
      </Container>
    </>
  )
}

export default Feed
