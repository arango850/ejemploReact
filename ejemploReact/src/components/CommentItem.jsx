// CommentItem.jsx
// Representa un comentario en la lista de comentarios.
// - Acepta distintos shapes de `comment` y normaliza campos comunes.
import React from 'react'
import { ListItem, ListItemAvatar, Avatar, ListItemText, Typography } from '@mui/material'

const CommentItem = ({ comment }) => {
  // Algunas APIs devuelven el texto del comentario con distintas claves
  const content = comment.body || comment.message || comment.content
  const userLabel = comment.userId ? `Usuario: ${comment.userId}` : null
  return (
    <ListItem alignItems="flex-start">
      <ListItemAvatar>
        {/* Avatar simple con la primera letra del userId si existe */}
        <Avatar>{String(comment.userId || '').charAt(0) || '?'}</Avatar>
      </ListItemAvatar>
      <ListItemText
        primary={content}
        secondary={userLabel && <Typography component="span" variant="caption">{userLabel}</Typography>}
      />
    </ListItem>
  )
}

export default CommentItem
