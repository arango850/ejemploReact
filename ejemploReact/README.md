
# Taller: React + Vite (Proyecto ejemplo)

Resumen rápido
- Proyecto de aprendizaje que demuestra una app React + Vite con autenticación (JWT), consumo de una API pública (DummyJSON), enrutado protegido por roles, y uso de Material UI para la interfaz.

Qué incluye
- Login (almacena token en `localStorage` y en el `UserContext`).
- Feed de posts: listar, paginar y crear nuevos posts (optimista).
- Página de detalle de post con comentarios y formulario para añadir comentarios (optimista/caída a fallback si la API no persiste).
- `axios` centralizado con interceptores para añadir `Authorization` y lógica genérica de refresh-token.
- Rutas: `/login`, `/feed`, `/posts/:id`, `/admin` (ejemplo de restricción por rol) y 404.
- Husky + lint-staged para hooks (pre-commit lint) y configuración básica de ESLint.
- Tests básicos con Vitest + Testing Library (ej.: `Login` y `Feed`).

Requisitos
- Node.js (se recomienda una versión LTS moderna). Si ves warnings de `engine`, son informativos para este taller.
- npm (o alternativa compatible).

Instalación y ejecución
Abre un terminal en la carpeta del proyecto (`ejemploReact`) y ejecuta:

```bash
npm install
npm run dev
```

Esto levanta la app en modo desarrollo (Vite). Abre `http://localhost:5173` (o la URL que muestre Vite).

Scripts útiles
- `npm run dev`: arranca el servidor de desarrollo.
- `npm run build`: construye para producción.
- `npm run preview`: sirve la build localmente.
- `npm run lint`: ejecuta ESLint.
- `npm run test`: ejecuta los tests con Vitest.

Credenciales de ejemplo
- DummyJSON tiene usuarios de ejemplo. En la UI de login hemos dejado una nota con credenciales de prueba (ej.: `kminchelle` / `0lelplR`) utilizadas en las pruebas.

Notas técnicas y limitaciones
- DummyJSON es una API pública sin soporte real de refresh-token ni persistencia completa en POSTs para comentarios; la app implementa un flujo de refresh genérico en `src/api/api.js` pero requiere un backend con `/auth/refresh` para funcionar por completo.
- Si quieres persistencia completa (crear posts/comentarios y refresh JWT), crea un mock local con `json-server` + `json-server-auth` o una pequeña API Express con endpoints de auth.
- Husky: durante la instalación inicial pudo aparecer un error en el `prepare` script si `husky` no estaba instalado aún. Si ocurre, ejecutar `npm install` de nuevo o instalar `husky` y ejecutar `npx husky install`.

Tests
- Tests básicos están en `src/__tests__`. Ejecuta `npm run test`.
- Recomendación: añadir cobertura para `PostDetail`, `ProtectedRoute` y `RoleWrapper` para completar el taller.

Archivos clave
- `src/context/UserContext.jsx`: manejo de usuario y token.
- `src/api/api.js`: instancia `axios` con interceptores.
- `src/pages/Login.jsx`, `Feed.jsx`, `PostDetail.jsx`: pantallas principales.
- `src/components/ProtectedRoute.jsx`, `RoleWrapper.jsx`, `Header.jsx`: lógica de protección y UI.

Siguientes pasos recomendados
- (Opcional) Configurar un backend mock local (`json-server` + `json-server-auth`) para demostrar refresh-token y persistencia.
- Añadir pruebas unitarias/integ. para el flujo de refresh y para la UI protegida por roles.
- Mejorar accesibilidad y validación de formularios.

Contacto / créditos
Este proyecto fue creado como taller guiado para aprender conceptos de React, Vite, routing protegido, y consumo de APIs con `axios`.

Si quieres que cierre el repositorio (añadiendo más tests, CI o creando el mock local), dime qué prefieres y lo implemento.
