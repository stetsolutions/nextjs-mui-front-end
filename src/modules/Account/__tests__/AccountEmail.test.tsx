import { rest } from 'msw'

import config from '../../../config'
import { server } from '../../../mocks/server'
import {
  customRender,
  fireEvent,
  screen,
  waitFor
} from '../../../utilities/testing/custom-render'
import { admin, user } from '../../../utilities/testing/users'
import AccountEmail from '../AccountEmail'

test('AccountEmail :: renders component', () => {
  customRender(<AccountEmail />)
})

test('AccountEmail :: rejects form with empty fields', async () => {
  customRender(<AccountEmail />, { user: user })

  fireEvent.click(screen.getByRole('button', { name: /update/i }))

  await waitFor(() => {
    expect(
      screen.getByText(/new email address is required/i)
    ).toBeInTheDocument()
    expect(screen.getByText(/password is required/i)).toBeInTheDocument()
  })
})

test('AccountEmail :: rejects form with invalid password fields', async () => {
  customRender(<AccountEmail />, { user: user })

  const currentEmail = screen.getByRole('textbox', {
    name: /current email/i
  }) as HTMLInputElement
  fireEvent.change(currentEmail, { target: { value: 'foo' } })

  const newEmail = screen.getByRole('textbox', {
    name: /new email/i
  }) as HTMLInputElement
  fireEvent.change(newEmail, { target: { value: 'baz' } })

  fireEvent.click(screen.getByRole('button', { name: /update/i }))

  await waitFor(() => {
    expect(
      screen.getByText(/current email address must be valid/i)
    ).toBeInTheDocument()
    expect(
      screen.getByText(/new email address must be valid/i)
    ).toBeInTheDocument()
  })
})

test('AccountEmail :: resets form', async () => {
  customRender(<AccountEmail />)

  const currentEmail = screen.getByRole('textbox', {
    name: /current email/i
  }) as HTMLInputElement
  fireEvent.change(currentEmail, { target: { value: 'foo@bar.com' } })

  const newEmail = screen.getByRole('textbox', {
    name: /new email/i
  }) as HTMLInputElement
  fireEvent.change(newEmail, { target: { value: 'baz@qux.com' } })

  const password = screen.getByLabelText('Password') as HTMLInputElement
  fireEvent.change(password, { target: { value: 'foobarbazqux' } })

  fireEvent.click(screen.getByRole('button', { name: /cancel/i }))

  expect(currentEmail).toHaveValue('')
  expect(newEmail).toHaveValue('')
  expect(password).toHaveValue('')
})

test('AccountEmail :: submits form successfully', async () => {
  customRender(<AccountEmail />, { user: user })

  const currentEmail = screen.getByRole('textbox', { name: /current email/i })
  fireEvent.change(currentEmail, { target: { value: 'foo@bar.com' } })

  const newEmail = screen.getByRole('textbox', { name: /new email/i })
  fireEvent.change(newEmail, { target: { value: 'baz@qux.com' } })

  const password = screen.getByLabelText('Password')
  fireEvent.change(password, { target: { value: 'foobarbazqux' } })

  fireEvent.click(screen.getByRole('button', { name: /update/i }))

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

test('AccountEmail :: shows server error if id parameter omitted', async () => {
  server.use(
    rest.patch(
      `${config.apiUrl}api/v1/users/*/email`,
      async (req, res, ctx) => {
        return res(
          ctx.status(400),
          ctx.json({
            error: 'Bad Request',
            message: 'params.id should be number',
            statusCode: 400
          })
        )
      }
    )
  )

  customRender(<AccountEmail />)

  const currentEmail = screen.getByRole('textbox', { name: /current email/i })
  fireEvent.change(currentEmail, { target: { value: 'foo@bar.com' } })

  const newEmail = screen.getByRole('textbox', { name: /new email/i })
  fireEvent.change(newEmail, { target: { value: 'baz@qux.com' } })

  const password = screen.getByLabelText('Password')
  fireEvent.change(password, { target: { value: 'foobarbazqux' } })

  fireEvent.click(screen.getByRole('button', { name: /update/i }))

  await waitFor(() => {
    expect(screen.getByText(/params.id should be number/i)).toBeInTheDocument()
  })
})
