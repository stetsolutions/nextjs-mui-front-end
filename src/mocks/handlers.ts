import { rest } from 'msw'

import config from '../config'
import { admin, user } from '../utilities/testing/users'

const users = {
  count: 2,
  rows: [admin, user]
}

export const handlers = [
  /**
   * auth
   */
  rest.delete(`${config.apiUrl}api/v1/auth`, (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(user))
  }),
  rest.patch(`${config.apiUrl}api/v1/auth`, async (req, res, ctx) => {
    return res(ctx.status(204))
  }),
  rest.post(`${config.apiUrl}api/v1/auth`, async (req, res, ctx) => {
    return res(ctx.status(204), ctx.json(user))
  }),
  rest.post(
    `${config.apiUrl}api/v1/auth/resend`,
    async (req, res, ctx) => {
      return res(ctx.status(204), ctx.json(user))
    }
  ),
  rest.post(
    `${config.apiUrl}api/v1/auth/reset`,
    async (req, res, ctx) => {
      return res(ctx.status(204))
    }
  ),
  rest.post(
    `${config.apiUrl}api/v1/auth/sign-in`,
    async (req, res, ctx) => {
      return res(ctx.status(200), ctx.json(user))
    }
  ),

  /**
   * users
   */
  rest.delete(
    `${config.apiUrl}api/v1/users/:userId`,
    async (req, res, ctx) => {
      return res(ctx.status(204))
    }
  ),
  rest.get(`${config.apiUrl}api/v1/users`, async (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(users))
  }),
  rest.patch(
    `${config.apiUrl}api/v1/users/:userId`,
    async (req, res, ctx) => {
      return res(ctx.status(204))
    }
  ),
  rest.post(`${config.apiUrl}api/v1/users`, async (req, res, ctx) => {
    return res(ctx.status(204))
  }),
  rest.patch(
    `${config.apiUrl}api/v1/users/:userId/email`,
    async (req, res, ctx) => {
      return res(ctx.status(204))
    }
  ),
  rest.patch(
    `${config.apiUrl}api/v1/users/:userId/password`,
    async (req, res, ctx) => {
      return res(ctx.status(204))
    }
  ),
  rest.patch(
    `${config.apiUrl}api/v1/users/:userId/profile`,
    async (req, res, ctx) => {
      return res(ctx.status(200), ctx.json(user))
    }
  )
]
