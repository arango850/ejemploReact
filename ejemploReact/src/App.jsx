// `App.jsx` define las rutas de la aplicación.
// Usamos `react-router-dom` para declarar páginas y wrappers de protección.
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Feed from './pages/Feed'
import PostDetail from './pages/PostDetail'
import Admin from './pages/Admin'
import ProtectedRoute from './components/ProtectedRoute'
import RoleWrapper from './components/RoleWrapper'
import PublicRoute from './components/PublicRoute'
import NotFound from './pages/NotFound'
import './App.css'

function App() {
  return (
    // BrowserRouter mantiene el historial de navegación (URLs amigables)
    <BrowserRouter>
      {/* Routes contiene todas las rutas disponibles en la app */}
      <Routes>
        {/* Ruta pública: el wrapper PublicRoute redirige si ya estás logueado */}
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />

        {/* Ruta protegida: solo accesible si hay un token/user en el contexto */}
        <Route
          path="/feed"
          element={
            <ProtectedRoute>
              <Feed />
            </ProtectedRoute>
          }
        />

        {/* Detalle de post: :id es un parámetro de ruta (ej. /posts/123) */}
        <Route
          path="/posts/:id"
          element={
            <ProtectedRoute>
              <PostDetail />
            </ProtectedRoute>
          }
        />

        {/* Ejemplo de restricción por rol: RoleWrapper verifica roles permitidos */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <RoleWrapper allowedRoles={["admin"]}>
                <Admin />
              </RoleWrapper>
            </ProtectedRoute>
          }
        />

        {/* Ruta raíz: redirige automáticamente al feed */}
        <Route path="/" element={<Navigate to="/feed" replace />} />

        {/* Catch-all: muestra página 404 si la ruta no existe */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
