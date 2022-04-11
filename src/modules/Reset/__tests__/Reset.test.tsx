import { rest } from 'msw'

import config from '../../../config'
import { server } from '../../../mocks/server'
import {
  customRender,
  fireEvent,
  screen,
  waitFor
} from '../../../utilities/testing/custom-render'
import Reset from '../Reset'

test('Reset :: renders component', () => {
  customRender(<Reset />)
})

test('Reset :: rejects form with empty fields', async () => {
  customRender(<Reset />)

  fireEvent.click(screen.getByRole('button', { name: /reset/i }))

  await waitFor(() => {
    expect(screen.getByText(/email is required/i)).toBeInTheDocument()
  })
})

test('Reset :: rejects form with invalid email', async () => {
  customRender(<Reset />)

  const email = screen.getByRole('textbox', { name: /email/i })
  fireEvent.change(email, { target: { value: 'foo' } })

  fireEvent.click(screen.getByRole('button', { name: /reset/i }))

  await waitFor(() => {
    expect(screen.getByText(/email must be valid/i)).toBeInTheDocument()
  })
})

test('Reset :: submits form successfully', async () => {
  customRender(<Reset />)

  const email = screen.getByRole('textbox', { name: /email/i })
  fireEvent.change(email, { target: { value: 'foo@bar.com' } })

  fireEvent.click(screen.getByRole('button', { name: /reset/i }))

  await waitFor(() => {
    expect(
      screen.getByText(/a verification link has been to sent/i)
    ).toBeInTheDocument()
  })

  fireEvent.click(screen.getByRole('button', { name: /dismiss/i }))

  await waitFor(() => {
    expect(
      screen.queryByText(/a verification link has been to sent/i)
    ).not.toBeInTheDocument()
  })
})

test('Reset :: shows server error if the request fails', async () => {
  server.use(
    rest.post(
      `${config.apiUrl}api/v1/auth/reset`,
      async (req, res, ctx) => {
        return res(
          ctx.status(500),
          ctx.json({
            error: 'Internal Server Error',
            message: 'Internal Server Error',
            statusCode: 500
          })
        )
      }
    )
  )

  customRender(<Reset />)

  const email = screen.getByLabelText(/email/i)
  fireEvent.change(email, { target: { value: 'foo@bar.com' } })

  fireEvent.click(screen.getByRole('button', { name: /reset/i }))

  await waitFor(() => {
    expect(screen.getByText(/internal server error/i)).toBeInTheDocument()
  })
})
