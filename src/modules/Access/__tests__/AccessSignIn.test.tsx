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
import AccessSignIn from '../AccessSignIn'

test('SignIn :: renders component', () => {
  customRender(<AccessSignIn variant='page' />)
})

test('SignIn :: renders component (dialog)', () => {
  customRender(<AccessSignIn variant='dialog' />)
})

test('SignIn :: rejects form with empty email field', async () => {
  customRender(<AccessSignIn />)

  const email = screen.getByRole('textbox', { name: /email/i })
  fireEvent.change(email, { target: { value: '' } })

  const password = screen.getByLabelText('Password')
  fireEvent.change(password, { target: { value: 'foobarbazqux' } })

  fireEvent.click(screen.getByRole('button', { name: /sign in/i }))

  await waitFor(() => {
    expect(screen.getByText(/email is required/i)).toBeInTheDocument()
  })
})

test('SignIn :: rejects form with empty password field', async () => {
  customRender(<AccessSignIn />)

  const email = screen.getByRole('textbox', { name: /email/i })
  fireEvent.change(email, { target: { value: 'foo@bar.com' } })

  const password = screen.getByLabelText('Password')
  fireEvent.change(password, { target: { value: '' } })

  fireEvent.click(screen.getByRole('button', { name: /sign in/i }))

  await waitFor(() => {
    expect(screen.getByText(/password is required/i)).toBeInTheDocument()
  })
})

test('SignIn :: rejects form with invalid email', async () => {
  customRender(<AccessSignIn />)

  const email = screen.getByRole('textbox', { name: /email/i })
  fireEvent.change(email, { target: { value: 'foo' } })

  const password = screen.getByLabelText('Password')
  fireEvent.change(password, { target: { value: 'foobarbazqux' } })

  fireEvent.click(screen.getByRole('button', { name: /sign in/i }))

  await waitFor(() => {
    expect(screen.getByText(/email must be valid/i)).toBeInTheDocument()
  })
})

test('SignIn :: navigates when "Forgot Password" clicked', () => {
  customRender(<AccessSignIn />)

  fireEvent.click(screen.getByRole('link', { name: /forgot password/i }))

  expect(mockRouter.pathname).toBe('/reset')
})

test('SignIn :: submits form succesfully', async () => {
  customRender(<AccessSignIn variant='page' />, { route: '/access' })

  const email = screen.getByRole('textbox', { name: /email/i })
  fireEvent.change(email, { target: { value: 'foo@bar.com' } })

  const password = screen.getByLabelText('Password')
  fireEvent.change(password, { target: { value: 'foobarbazqux' } })

  fireEvent.click(screen.getByRole('button', { name: /sign in/i }))

  await waitFor(() => expect(mockRouter.pathname).toBe('/'))
})

test('SignIn :: submits form succesfully (dialog)', async () => {
  customRender(<Header />)

  fireEvent.click(screen.getByRole('button', { name: /open menu/i }))
  fireEvent.click(screen.getByRole('menuitem', { name: /sign in/i }))

  await waitFor(() => {
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument()
  })

  const email = screen.getByRole('textbox', { name: /email/i })
  fireEvent.change(email, { target: { value: 'foo@bar.com' } })

  const password = screen.getByLabelText('Password')
  fireEvent.change(password, { target: { value: 'foobarbazqux' } })

  await waitFor(() => {
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }))
  })

  await waitForElementToBeRemoved(
    screen.queryByRole('link', { name: /forgot password/i })
  )
})

test('SignIn :: shows server error if the request fails', async () => {
  server.use(
    rest.post(
      `${config.apiUrl}api/v1/auth/sign-in`,
      async (req, res, ctx) => {
        return res(ctx.status(401), ctx.json({ message: 'Unauthorized' }))
      }
    )
  )

  customRender(<AccessSignIn />, { route: '/access' })

  const email = screen.getByLabelText(/email/i)
  fireEvent.change(email, { target: { value: 'foo@bar.com' } })

  const password = screen.getByLabelText('Password')
  fireEvent.change(password, { target: { value: 'foobarbazqux' } })

  fireEvent.click(screen.getByRole('button', { name: /sign in/i }))

  await waitFor(() => {
    expect(
      screen.getByText(/login failed: invalid user id or password/i)
    ).toBeInTheDocument()
  })

  await waitFor(() => expect(mockRouter.pathname).not.toBe('/'))
})
