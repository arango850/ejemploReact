// Login.test.jsx
// Prueba de ejemplo para la página de Login.
// - Aquí simulamos la API (mock) para que la prueba sea determinista.
// - Verificamos que al enviar credenciales se almacene el token en localStorage.
import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import Login from '../pages/Login'
import { UserProvider } from '../context/UserContext'

// Mock del módulo api para evitar llamadas reales a la red durante la prueba.
vi.mock('../api/api', () => ({
  default: {
    // `defaults.headers.common` se usa en UserContext, por eso lo incluimos en el mock
    defaults: { headers: { common: {} }, baseURL: 'https://dummyjson.com' },
    post: vi.fn(() => Promise.resolve({ data: { token: 't', id: 1, username: 'kminchelle' } })),
  },
}))

describe('Login page', () => {
  test('renders and logs in', async () => {
    render(
      <MemoryRouter>
        <UserProvider>
          <Login />
        </UserProvider>
      </MemoryRouter>,
    )

    const user = userEvent.setup()
    await user.type(screen.getByLabelText(/Usuario/i), 'kminchelle')
    await user.type(screen.getByLabelText(/Contraseña/i), '0lelplR')
    await user.click(screen.getByRole('button', { name: /Ingresar/i }))

    await waitFor(() => {
      // login should store token in localStorage via UserContext
      expect(localStorage.getItem('token')).toBe('t')
    })
  })
})
