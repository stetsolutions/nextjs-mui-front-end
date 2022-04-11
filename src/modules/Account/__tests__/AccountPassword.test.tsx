import { rest } from 'msw'

import config from '../../../config'
import { server } from '../../../mocks/server'
import {
  customRender,
  fireEvent,
  history,
  screen,
  waitFor
} from '../../../utilities/testing/custom-render'
import { user } from '../../../utilities/testing/users'
import AccountPassword from '../AccountPassword'

test('AccountPassword ::  renders component', () => {
  customRender(<AccountPassword />)
})

test('AccountPassword ::  rejects form with empty fields', async () => {
  customRender(<AccountPassword />, { user: user })

  fireEvent.click(screen.getByRole('button', { name: /update/i }))

  await waitFor(() => {
    expect(
      screen.getByText(/current password is required/i)
    ).toBeInTheDocument()
    expect(screen.getByText(/new password is required/i)).toBeInTheDocument()
    expect(
      screen.getByText(/password confirmation is required/i)
    ).toBeInTheDocument()
  })
})

test('AccountPassword ::  rejects form with weak new password', async () => {
  customRender(<AccountPassword />, { user: user })

  const newPassword = screen.getByLabelText('New Password') as HTMLInputElement
  fireEvent.change(newPassword, { target: { value: 'foo' } })

  fireEvent.click(screen.getByRole('button', { name: /update/i }))

  await waitFor(() => {
    expect(screen.getByText(/password must be stronger/i)).toBeInTheDocument()
  })
})

test('AccountPassword ::  reset form', async () => {
  customRender(<AccountPassword />, { user: user })

  const currentPassword = screen.getByLabelText(
    'Current Password'
  ) as HTMLInputElement
  fireEvent.change(currentPassword, { target: { value: 'foobarbazqux' } })

  const newPassword = screen.getByLabelText('New Password') as HTMLInputElement
  fireEvent.change(newPassword, { target: { value: 'foobarbazqux' } })

  const confirmPassword = screen.getByLabelText(
    'Confirm New Password'
  ) as HTMLInputElement
  fireEvent.change(confirmPassword, { target: { value: 'foobarbazqux' } })

  fireEvent.click(screen.getByRole('button', { name: /cancel/i }))

  await waitFor(() => {
    expect(currentPassword).toHaveValue('')
    expect(newPassword).toHaveValue('')
    expect(confirmPassword).toHaveValue('')
  })
})

test('AccountPassword ::  submits form successfully', async () => {
  customRender(<AccountPassword />, { user: user })

  const currentPassword = screen.getByLabelText('Current Password')
  fireEvent.change(currentPassword, { target: { value: 'foobarbazqux' } })

  const newPassword = screen.getByLabelText('New Password')
  fireEvent.change(newPassword, { target: { value: 'foobarbazqux' } })

  const confirmPassword = screen.getByLabelText('Confirm New Password')
  fireEvent.change(confirmPassword, { target: { value: 'foobarbazqux' } })

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

test('AccountPassword ::  shows server error if current password invalid', async () => {
  server.use(
    rest.patch(
      `${config.apiUrl}api/v1/users/:userId/password`,
      (req, res, ctx) => {
        return res(
          ctx.status(403),
          ctx.json({
            error: 'Forbidden',
            message: 'Password invalid',
            statusCode: 403
          })
        )
      }
    )
  )

  customRender(<AccountPassword />, { user: user })

  const currentPassword = screen.getByLabelText('Current Password')
  fireEvent.change(currentPassword, { target: { value: 'foobarbazqux' } })

  const newPassword = screen.getByLabelText('New Password')
  fireEvent.change(newPassword, { target: { value: 'foobarbazqux' } })

  const confirmPassword = screen.getByLabelText('Confirm New Password')
  fireEvent.change(confirmPassword, { target: { value: 'foobarbazqux' } })

  fireEvent.click(screen.getByRole('button', { name: /update/i }))

  await waitFor(() => {
    expect(screen.getByText(/password is incorrect/i)).toBeInTheDocument()
  })
})

test('AccountPassword ::  shows server error if id parameter omitted', async () => {
  server.use(
    rest.patch(
      `${config.apiUrl}api/v1/users/:userId/password`,
      (req, res, ctx) => {
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

  customRender(<AccountPassword />)

  const currentPassword = screen.getByLabelText('Current Password')
  fireEvent.change(currentPassword, { target: { value: 'foobarbazqux' } })

  const newPassword = screen.getByLabelText('New Password')
  fireEvent.change(newPassword, { target: { value: 'foobarbazqux' } })

  const confirmPassword = screen.getByLabelText('Confirm New Password')
  fireEvent.change(confirmPassword, { target: { value: 'foobarbazqux' } })

  fireEvent.click(screen.getByRole('button', { name: /update/i }))

  await waitFor(() => {
    expect(screen.getByText(/params.id should be number/i)).toBeInTheDocument()
  })
})
