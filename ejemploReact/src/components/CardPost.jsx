// CardPost.jsx
// Componente sencillo que muestra la información básica de un post.
// - Recibe `post` y muestra título y contenido.
// - El botón enlaza a la ruta de detalle (`/posts/:id`).
import React from 'react'
import { Card, CardContent, CardActions, Typography, Button } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'

const CardPost = ({ post }) => {
  return (
    <Card>
      <CardContent>
        {/* Título del post */}
        <Typography variant="h6" gutterBottom>
          {post.title}
        </Typography>
        {/* Cuerpo/texto del post (distintas APIs pueden usar distintas claves) */}
        <Typography variant="body2">{post.body || post.text}</Typography>
      </CardContent>
      <CardActions>
        {/* Link a la página de detalle usando react-router */}
        <Button component={RouterLink} to={`/posts/${post.id}`} size="small">
          Ver
        </Button>
      </CardActions>
    </Card>
  )
}

export default CardPost
