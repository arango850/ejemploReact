// Feed.jsx
// Pantalla principal que lista posts y permite crear uno nuevo.
// - Usa el `adapter` para cargar posts y soporta paginación simple.
// - Al crear un post, intenta guardarlo en la API; si falla, añade un post local (optimista).
import React, { useEffect, useState } from 'react'
import { Container, Box, TextField, Button, Typography, Grid, CircularProgress, Alert } from '@mui/material'
import Header from '../components/Header'
import CardPost from '../components/CardPost'
import { useUser } from '../context/UserContext'
import { getPosts as apiGetPosts, addPost as apiAddPost } from '../api/adapter'

const Feed = () => {
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

  const fetchPosts = async (opts = { reset: false }) => {
    setError(null)
    setLoading(true)
    try {
      const { posts: fetched, total: newTotal } = await apiGetPosts({ limit, skip: opts.reset ? 0 : skip })
      setTotal(newTotal)
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

  useEffect(() => {
    fetchPosts({ reset: true })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleCreate = async (e) => {
    e.preventDefault()
    if (!title || !body) return
    setCreating(true)
    try {
      const payload = { title, body }
      if (user && user.id) payload.userId = user.id
      const newPost = await apiAddPost(payload)
      setPosts((p) => [newPost, ...p])
      setTitle('')
      setBody('')
    } catch (err) {
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
      <Header />
      <Container sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Feed
        </Typography>

        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle1">Conectado como: {user ? (user.firstName || user.username || user.email) : 'Invitado'}</Typography>
        </Box>

        <Box component="form" onSubmit={handleCreate} sx={{ mb: 3, display: 'grid', gap: 2 }}>
          <TextField label="Título" value={title} onChange={(e) => setTitle(e.target.value)} required />
          <TextField label="Contenido" value={body} onChange={(e) => setBody(e.target.value)} multiline rows={3} required />
          <Button type="submit" variant="contained" disabled={creating}>{creating ? <CircularProgress size={18} color="inherit" /> : 'Crear Post'}</Button>
        </Box>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <Grid container spacing={2}>
          {posts.map((post) => (
            <Grid item key={post.id} xs={12} sm={6} md={4}>
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
