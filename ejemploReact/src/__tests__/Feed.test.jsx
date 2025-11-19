// Feed.test.jsx
// Prueba de ejemplo para la pantalla Feed.
// - Mockeamos `api` para devolver un conjunto fijo de posts.
// - Verificamos que el título del post mockeado aparece en la UI.
import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Feed from '../pages/Feed'
import { UserProvider } from '../context/UserContext'

vi.mock('../api/api', () => ({
  default: {
    defaults: { headers: { common: {} }, baseURL: 'https://dummyjson.com' },
    get: vi.fn((url) => {
      if (url.startsWith('/posts')) {
        return Promise.resolve({ data: { posts: [{ id: 1, title: 'Hello', body: 'World' }], total: 1 } })
      }
      return Promise.resolve({ data: {} })
    }),
    post: vi.fn(() => Promise.resolve({ data: { id: 2, title: 'New', body: 'Post' } })),
  },
}))

describe('Feed page', () => {
  test('loads posts and shows a post card', async () => {
    render(
      <MemoryRouter>
        <UserProvider>
          <Feed />
        </UserProvider>
      </MemoryRouter>,
    )

    // ensure a post title from mocked API is displayed
    expect(await screen.findByText(/Hello/i)).toBeInTheDocument()
  })
})
