// Archivo: src/api/api.js
// Propósito: crear una instancia central de axios para toda la app.
// Tener una instancia central facilita añadir headers comunes, baseURL,
// manejadores de errores y lógica de reintentos (refresh token).
import axios from 'axios'

const api = axios.create({
  // baseURL apunta a la API pública usada en el taller (DummyJSON)
  baseURL: 'https://dummyjson.com',
  headers: { 'Content-Type': 'application/json' },
})

// Interceptor de petición: antes de cada request, añadimos el token si existe.
// localStorage se usa aquí para simplicidad. En aplicaciones reales quizá quieras
// manejar esto con cookies seguras o un mecanismo más robusto.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers = config.headers || {}
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Interceptor de respuesta: detecta 401 (token expirado) e intenta un refresh.
// Este ejemplo implementa una cola para evitar múltiples refresh simultáneos.
let isRefreshing = false
let failedQueue = []

const processQueue = (error, token = null) => {
  // Cuando el refresh termina (exitoso o no), resolvemos o rechazamos las promesas
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token)
    }
  })
  failedQueue = []
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    if (!originalRequest) return Promise.reject(error)

    const status = error.response?.status
    // Si recibimos 401, intentamos usar refreshToken (si está disponible)
    if (status === 401 && !originalRequest._retry) {
      const refreshToken = localStorage.getItem('refreshToken')
      if (!refreshToken) {
        // Si no hay refresh token no podemos refrescar: limpiar y forzar login
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        localStorage.removeItem('refreshToken')
        window.location.href = '/login'
        return Promise.reject(error)
      }

      // Si ya hay un refresh en curso, devolvemos una promesa que se resolverá
      // cuando el refresh termine (evita llamadas duplicadas al endpoint).
      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject })
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`
            return api(originalRequest)
          })
          .catch((err) => Promise.reject(err))
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        // Intentamos refrescar el token. IMPORTANTE: DummyJSON no ofrece este
        // endpoint, así que en este taller esta llamada normalmente fallará.
        // La lógica se mantiene para que puedas reemplazar la URL si usas tu backend.
        const resp = await axios.post(`${api.defaults.baseURL}/auth/refresh`, { refreshToken })
        // Algunas APIs devuelven `accessToken` en lugar de `token`.
        const newToken = resp.data.token || resp.data.accessToken || resp.data.access_token || null
        localStorage.setItem('token', newToken)
        api.defaults.headers.common.Authorization = `Bearer ${newToken}`
        processQueue(null, newToken)
        return api(originalRequest)
      } catch (errRefresh) {
        // Si el refresh falla, limpiamos el estado y forzamos login
        processQueue(errRefresh, null)
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        localStorage.removeItem('refreshToken')
        window.location.href = '/login'
        return Promise.reject(errRefresh)
      } finally {
        isRefreshing = false
      }
    }
    return Promise.reject(error)
  },
)

export default api
