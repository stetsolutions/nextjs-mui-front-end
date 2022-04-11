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
import Notifications from '../Notifications'

test('Notifications :: renders component (with verified user)', () => {
  customRender(<Notifications />, { user: admin })
})

test('Notifications :: renders component with layout excluded', () => {
  customRender(<Notifications />, { route: '/foo' })
})

test('Notifications :: resends verification email', async () => {
  customRender(<Notifications />, { user: user })

  await waitFor(() => {
    expect(
      screen.getByText(
        /email unverified: please follow the link sent to your address/i
      )
    ).toBeInTheDocument()
  })

  await waitFor(() => {
    fireEvent.click(screen.getByRole('button', { name: /resend/i }))
  })

  await waitFor(() => {
    expect(
      screen.queryByText(
        /email unverified: please follow the link sent to your address/i
      )
    ).not.toBeInTheDocument()
  })

  await waitFor(() => {
    expect(
      screen.getByText(/a verification link has been sent/i)
    ).toBeInTheDocument()
  })

  await waitFor(() => {
    fireEvent.click(screen.getByRole('button', { name: /dismiss/i }))
  })

  await waitFor(() => {
    expect(
      screen.queryByText(/a verification link has been sent/i)
    ).not.toBeInTheDocument()
  })
})

test('Notifications :: shows server error if the request fails', async () => {
  server.use(
    rest.post(`${config.apiUrl}api/v1/auth/resend`, async (req, res, ctx) => {
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

  customRender(<Notifications />, { user: user })

  await waitFor(() => {
    fireEvent.click(screen.getByRole('button', { name: /resend/i }))
  })

  await waitFor(() => {
    expect(screen.getByText(/internal server error/i)).toBeInTheDocument()
  })
})
