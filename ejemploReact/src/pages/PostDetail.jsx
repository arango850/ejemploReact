// PostDetail.jsx
// Página de detalle de un post que también muestra y permite añadir comentarios.
// - Carga el post y comentarios al montar.
// - Soporta añadir comentarios con intentos a varios endpoints y fallback optimista.
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getPost as apiGetPost, getComments as apiGetComments, addComment as apiAddComment } from '../api/adapter'
import { Container, Typography, Box, TextField, Button, List, CircularProgress, Alert } from '@mui/material'
import Header from '../components/Header'
import CommentItem from '../components/CommentItem'
import { useUser } from '../context/UserContext'
const PostDetail = () => {
  const { id } = useParams()
  const [post, setPost] = useState(null)
  const [comments, setComments] = useState([])
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  const [adding, setAdding] = useState(false)
  const [error, setError] = useState(null)
  const [limit] = useState(20)
  const [skip, setSkip] = useState(0)
  const [total, setTotal] = useState(null)
  const { user } = useUser()

  useEffect(() => {
    const load = async () => {
      setError(null)
      setLoading(true)
      try {
        // Cargamos el post y los comentarios usando el adaptador
        const p = await apiGetPost(id)
        setPost(p)
        const { comments: fetched, total: newTotal } = await apiGetComments(id, { limit, skip: 0 })
        setComments(fetched || [])
        setTotal(newTotal ?? null)
        setSkip((fetched || []).length)
      } catch (err) {
        setError('No se pudo cargar el post o los comentarios')
      } finally {
        setLoading(false)
      }
    }

    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  const handleAdd = async (e) => {
    e.preventDefault()
    if (!text) return
    setAdding(true)
    try {
      const payload = { body: text, postId: Number(id) }
      if (user && user.id) payload.userId = user.id
      let newComment
      try {
        newComment = await apiAddComment(id, payload)
      } catch (_e) {
        // Fallback: comentario local (optimista)
        newComment = { id: Date.now(), body: text, userId: user?.id }
      }

      setComments((c) => [newComment, ...c])
      setText('')
    } catch (err) {
      console.error(err)
      setError('No se pudo agregar el comentario')
    } finally {
      setAdding(false)
    }
  }

  // Paginación para comentarios
  const loadMoreComments = async () => {
    if (total !== null && comments.length >= total) return
    setLoading(true)
    try {
      const { comments: fetched, total: newTotal } = await apiGetComments(id, { limit, skip })
      setComments((c) => [...c, ...fetched])
      setSkip((s) => s + fetched.length)
      setTotal(newTotal ?? total)
    } catch (err) {
      setError('No se pudieron cargar más comentarios')
    } finally {
      setLoading(false)
    }
  }

  if (!post) return <Container sx={{ mt: 4 }}> <CircularProgress /> </Container>

  return (
    <>
      <Header />
      <Container sx={{ mt: 4 }}>
        <Typography variant="h4">{post.title}</Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>{post.body || post.text}</Typography>

        {/* Formulario para añadir comentario */}
        <Box component="form" onSubmit={handleAdd} sx={{ mb: 3, display: 'grid', gap: 2 }}>
          <TextField label="Nuevo comentario" value={text} onChange={(e) => setText(e.target.value)} required multiline rows={3} />
          <Button type="submit" variant="contained" disabled={adding}>{adding ? <CircularProgress size={18} color="inherit" /> : 'Agregar comentario'}</Button>
        </Box>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <Typography variant="h6">Comentarios</Typography>
        <List>
          {comments.map((c) => (
            <React.Fragment key={c.id}>
              <CommentItem comment={c} />
            </React.Fragment>
          ))}
        </List>

        <Box sx={{ mt: 2, textAlign: 'center' }}>
          {loading ? (
            <CircularProgress />
          ) : (
            total === null || comments.length < total ? (
              <Button onClick={loadMoreComments}>Cargar más comentarios</Button>
            ) : (
              <Typography variant="body2">No hay más comentarios</Typography>
            )
          )}
        </Box>
      </Container>
    </>
  )
}

export default PostDetail
