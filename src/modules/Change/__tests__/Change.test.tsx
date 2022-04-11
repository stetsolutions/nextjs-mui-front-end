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
import Change from '../Change'

test('Change :: renders component', () => {
  customRender(<Change />)
})

test('Change :: rejects form with empty fields', async () => {
  customRender(<Change />)

  fireEvent.click(screen.getByRole('button', { name: /change/i }))

  await waitFor(() => {
    expect(screen.getByText(/new password is required/i)).toBeInTheDocument()
    expect(
      screen.getByText(/password confirmation is required/i)
    ).toBeInTheDocument()
  })
})

test('Change :: rejects form with weak new password', async () => {
  customRender(<Change />)

  const newPassword = screen.getByLabelText('New Password')
  fireEvent.change(newPassword, { target: { value: 'foo' } })

  fireEvent.click(screen.getByRole('button', { name: /change/i }))

  await waitFor(() => {
    expect(screen.getByText(/password must be stronger/i)).toBeInTheDocument()
  })
})

test('Change :: rejects form with weak new password', async () => {
  customRender(<Change />)

  const newPassword = screen.getByLabelText('New Password')
  fireEvent.change(newPassword, { target: { value: 'foo' } })

  fireEvent.click(screen.getByRole('button', { name: /change/i }))

  await waitFor(() => {
    expect(screen.getByText(/password must be stronger/i)).toBeInTheDocument()
  })
})

test('Change :: submits form successfully', async () => {
  customRender(<Change />)

  const newPassword = screen.getByLabelText('New Password')
  fireEvent.change(newPassword, { target: { value: 'foobarbazqux' } })

  const confirmPassword = screen.getByLabelText('Confirm Password')
  fireEvent.change(confirmPassword, { target: { value: 'foobarbazqux' } })

  fireEvent.click(screen.getByRole('button', { name: /change/i }))

  await waitFor(() => {
    expect(screen.getByText(/password changed/i)).toBeInTheDocument()
  })

  fireEvent.click(screen.getByRole('button', { name: /dismiss/i }))

  await waitFor(() => {
    expect(screen.queryByText(/password changed/i)).not.toBeInTheDocument()
  })
})

test('Change :: shows server error if the request fails', async () => {
  server.use(
    rest.patch(`${config.apiUrl}api/v1/auth`, async (req, res, ctx) => {
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

  customRender(<Change />)

  const newPassword = screen.getByLabelText('New Password')
  fireEvent.change(newPassword, { target: { value: 'foobarbazqux' } })

  const confirmPassword = screen.getByLabelText('Confirm Password')
  fireEvent.change(confirmPassword, { target: { value: 'foobarbazqux' } })

  fireEvent.click(screen.getByRole('button', { name: /change/i }))

  await waitFor(() => {
    expect(screen.getByText(/internal server error/i)).toBeInTheDocument()
  })
})
