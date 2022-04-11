import { rest } from 'msw'

import config from '../../../config'
import { server } from '../../../mocks/server'
import {
  customRender,
  screen,
  waitFor
} from '../../../utilities/testing/custom-render'
import { user } from '../../../utilities/testing/users'
import Verify from '../Verify'
import mockRouter from 'next-router-mock'

test('Verify :: fetches succesfully without user set', async () => {
  customRender(<Verify />, { user: user })

  await waitFor(() => {
    expect(
      screen.getByText(/request verified: please sign in/i)
    ).toBeInTheDocument()
  })
})

test('Verify :: fetches succesfully with user set', async () => {
  localStorage.setItem('user', JSON.stringify(user))

  customRender(<Verify />, { user: user })

  await waitFor(() => {
    expect(
      screen.getByText(/request verified: please sign in/i)
    ).toBeInTheDocument()
  })
})

test('Verify :: shows server error if query not found', async () => {
  server.use(
    rest.delete(`${config.apiUrl}api/v1/auth`, async (req, res, ctx) => {
      return res(
        ctx.status(400),
        ctx.json({
          error: 'Not Found',
          message: 'Not Found',
          statusCode: 404
        })
      )
    })
  )

  customRender(<Verify />, { route: '/access', user: user })

  await waitFor(() => {
    expect(
      screen.getByText(/request expired: please try again/i)
    ).toBeInTheDocument()
  })
})

test('Verify :: shows server error if the request fails', async () => {
  server.use(
    rest.delete(`${config.apiUrl}api/v1/auth`, async (req, res, ctx) => {
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

  customRender(<Verify />, { user: user })

  await waitFor(() => {
    expect(screen.getByText(/internal server error/i)).toBeInTheDocument()
  })

  expect(mockRouter.pathname).toBe('/')
})
