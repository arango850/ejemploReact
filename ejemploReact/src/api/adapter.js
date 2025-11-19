// adapter.js
// Capa intermedia entre los componentes y la instancia de axios (`api`).
// Objetivo: unificar y normalizar las llamadas a la API para poder cambiar
// de proveedor con mínimo impacto en la UI.
import api from './api'

/*
  Funciones expuestas:
  - login({ username, password }) => { token, refreshToken, user }
  - getPosts({ limit, skip }) => { posts, total }
  - addPost(payload) => post
  - getPost(id) => post
  - getComments(postId, { limit, skip }) => { comments, total }
  - addComment(postId, payload) => comment
  - refresh(refreshToken) => newToken

  Nota: el adaptador intenta normalizar nombres comunes como `accessToken` vs `token`.
*/

const normalizeToken = (data) => {
  if (!data) return { token: null, refreshToken: null, user: null }
  const token = data.token || data.accessToken || data.access_token || data.jwt || null
  const refreshToken = data.refreshToken || data.refresh_token || null
  // user: extraemos los campos que no son token/refresh
  const { token: _t, accessToken: _a, access_token: _aa, refreshToken: _r, refresh_token: _rr, ...user } = data
  return { token, refreshToken, user }
}

export const login = async ({ username, password }) => {
  const res = await api.post('/auth/login', { username, password })
  const data = res.data || {}
  return normalizeToken(data)
}

export const getPosts = async ({ limit = 10, skip = 0 } = {}) => {
  const res = await api.get('/posts', { params: { limit, skip } })
  // DummyJSON devuelve { posts: [], total }
  const posts = res.data.posts || res.data.data || []
  const total = res.data.total ?? res.data.count ?? null
  return { posts, total }
}

export const addPost = async (payload) => {
  // Intentamos el endpoint común usado en DummyJSON
  const res = await api.post('/posts/add', payload)
  return res.data
}

export const getPost = async (id) => {
  const res = await api.get(`/posts/${id}`)
  return res.data
}

export const getComments = async (postId, { limit = 20, skip = 0 } = {}) => {
  const res = await api.get(`/posts/${postId}/comments`, { params: { limit, skip } })
  const comments = res.data.comments || res.data.data || []
  const total = res.data.total ?? res.data.count ?? null
  return { comments, total }
}

export const addComment = async (postId, payload) => {
  // Intentos en orden: /comments/add, /posts/{id}/comments
  try {
    const res = await api.post('/comments/add', payload)
    return res.data
  } catch (e) {
    const res2 = await api.post(`/posts/${postId}/comments`, payload)
    return res2.data
  }
}

export const refresh = async (refreshToken) => {
  const res = await api.post('/auth/refresh', { refreshToken })
  const token = res.data.token || res.data.accessToken || res.data.access_token || null
  return token
}

export default {
  login,
  getPosts,
  addPost,
  getPost,
  getComments,
  addComment,
  refresh,
}
