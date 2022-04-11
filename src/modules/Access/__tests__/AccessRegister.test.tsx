import { rest } from 'msw'
import mockRouter from 'next-router-mock'

import config from '../../../config'
import Header from '../../../layout/Header'
import { server } from '../../../mocks/server'
import {
  customRender,
  fireEvent,
  screen,
  waitFor,
  waitForElementToBeRemoved
} from '../../../utilities/testing/custom-render'
import AccessRegister from '../AccessRegister'

test('Register :: renders component', () => {
  customRender(<AccessRegister variant='page' />)
})

test('Register :: renders component (dialog)', () => {
  customRender(<AccessRegister variant='dialog' />)
})

test('Register :: rejects form with empty email field', async () => {
  customRender(<AccessRegister />)

  const email = screen.getByRole('textbox', { name: /email/i })
  fireEvent.change(email, { target: { value: '' } })

  const password = screen.getByLabelText('Password')
  fireEvent.change(password, { target: { value: 'foobarbazqux' } })

  fireEvent.click(screen.getByRole('button', { name: /register/i }))

  await waitFor(() => {
    expect(screen.getByText(/email is required/i)).toBeInTheDocument()
  })
})

test('Register :: rejects form with empty password field', async () => {
  customRender(<AccessRegister />)

  const email = screen.getByRole('textbox', { name: /email/i })
  fireEvent.change(email, { target: { value: 'foo@bar.com' } })

  const password = screen.getByLabelText('Password')
  fireEvent.change(password, { target: { value: '' } })

  fireEvent.click(screen.getByRole('button', { name: /register/i }))

  await waitFor(() => {
    expect(screen.getByText(/password is required/i)).toBeInTheDocument()
  })
})

test('Register :: rejects form with invalid email', async () => {
  customRender(<AccessRegister />)

  const email = screen.getByRole('textbox', { name: /email/i })
  fireEvent.change(email, { target: { value: 'foo' } })

  const password = screen.getByLabelText('Password')
  fireEvent.change(password, { target: { value: 'foobarbazqux' } })

  fireEvent.click(screen.getByRole('button', { name: /register/i }))

  await waitFor(() => {
    expect(screen.getByText(/email must be valid/i)).toBeInTheDocument()
  })
})

test('Register :: submits form succesfully', async () => {
  customRender(<AccessRegister />, { route: '/access' })

  const email = screen.getByRole('textbox', { name: /email/i })
  fireEvent.change(email, { target: { value: 'foo@bar.com' } })

  const password = screen.getByLabelText('Password')
  fireEvent.change(password, { target: { value: 'foobarbazqux' } })

  await waitFor(() => {
    fireEvent.click(screen.getByRole('button', { name: /register/i }))
  })

  await waitFor(() => {
    expect(
      screen.getByText(/a verification link has been sent/i)
    ).toBeInTheDocument()
  })

  fireEvent.click(screen.getByRole('button', { name: /dismiss/i }))

  await waitFor(() => {
    expect(
      screen.queryByText(/a verification link has been sent/i)
    ).not.toBeInTheDocument()
  })
})

test('Register :: submits form succesfully (dialog)', async () => {
  customRender(<Header />)

  fireEvent.click(screen.getByRole('button', { name: /open menu/i }))
  fireEvent.click(screen.getByRole('menuitem', { name: /sign in/i }))

  fireEvent.click(screen.getByRole('tab', { name: /register/i }))

  await waitFor(() => {
    expect(
      screen.getByRole('button', { name: /register/i })
    ).toBeInTheDocument()
  })

  const email = screen.getByRole('textbox', { name: /email/i })
  fireEvent.change(email, { target: { value: 'foo@bar.com' } })

  const password = screen.getByLabelText('Password')
  fireEvent.change(password, { target: { value: 'foobarbazqux' } })

  await waitFor(() => {
    fireEvent.click(screen.getByRole('button', { name: /register/i }))
  })

  await waitForElementToBeRemoved(
    screen.queryByRole('button', { name: /register/i })
  )
})

test('Register :: shows server error if the request fails', async () => {
  server.use(
    rest.post(`${config.apiUrl}api/v1/auth`, async (req, res, ctx) => {
      return res(
        ctx.status(500),
        ctx.json({
          error: 'Internal Server Error',
          message: 'Internal Server Error',
          statusCode: 500
        })
      )
    })
  )

  customRender(<AccessRegister />, { route: '/access' })

  const email = screen.getByLabelText(/email/i)
  fireEvent.change(email, { target: { value: 'foo@bar.com' } })

  const password = screen.getByLabelText('Password')
  fireEvent.change(password, { target: { value: 'foobarbazqux' } })

  fireEvent.click(screen.getByRole('button', { name: /register/i }))

  await waitFor(() => {
    expect(screen.getByText(/internal server error/i)).toBeInTheDocument()
  })

  await waitFor(() => expect(mockRouter.pathname).not.toBe('/'))
})
