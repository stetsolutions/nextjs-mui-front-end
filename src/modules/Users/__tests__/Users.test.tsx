import { rest } from 'msw'

import config from '../../../config'
import { server } from '../../../mocks/server'
import {
  customRender,
  fireEvent,
  screen,
  waitFor,
  waitForElementToBeRemoved
} from '../../../utilities/testing/custom-render'
import { user } from '../../../utilities/testing/users'
import Users from '../Users'

jest.setTimeout(10000)

test('Users :: renders component with data grid virtualization off', async () => {
  customRender(<Users />)

  await waitFor(() => {
    expect(screen.getByRole('heading', { name: /users/i })).toBeInTheDocument()
  })
})

test('Users :: submits form successfully', async () => {
  customRender(<Users />)

  fireEvent.click(screen.getByRole('button', { name: /add/i }))

  await waitFor(() => {
    expect(
      screen.getByRole('heading', { name: /add user/i })
    ).toBeInTheDocument()
  })

  const email = screen.getByRole('textbox', {
    name: /email/i
  }) as HTMLInputElement
  fireEvent.change(email, { target: { value: 'foo@bar.com' } })

  const firstName = screen.getByRole('textbox', {
    name: /first name/i
  }) as HTMLInputElement
  fireEvent.change(firstName, { target: { value: 'Foo' } })

  const lastName = screen.getByRole('textbox', {
    name: /last name/i
  }) as HTMLInputElement
  fireEvent.change(lastName, { target: { value: 'Bar' } })

  fireEvent.mouseDown(screen.getByRole('button', { name: /role/i }))
  await waitFor(() => {
    fireEvent.click(screen.getAllByRole(/option/i)[0])
  })

  const username = screen.getByRole('textbox', {
    name: /username/i
  }) as HTMLInputElement
  fireEvent.change(username, { target: { value: 'foobar' } })

  await waitFor(async () => {
    fireEvent.click(screen.getByRole('button', { name: /add/i }))
  })

  await waitFor(() => {
    expect(screen.queryByText(/user added/i)).toBeInTheDocument()
  })
})

test('Users :: cancels upsert dialog', async () => {
  customRender(<Users />)

  fireEvent.click(screen.getByRole('button', { name: /add/i }))

  await waitFor(() => {
    expect(
      screen.getByRole('heading', { name: /add user/i })
    ).toBeInTheDocument()
  })

  const email = screen.getByRole('textbox', {
    name: /email/i
  }) as HTMLInputElement
  fireEvent.change(email, { target: { value: 'foo@bar.com' } })

  await waitFor(async () => {
    fireEvent.click(screen.getByRole('button', { name: /cancel/i }))
  })

  await waitFor(() => {
    expect(screen.queryByText(/add user/i)).not.toBeInTheDocument()
  })
})

test('Users :: deletes successfully', async () => {
  customRender(<Users />)

  await waitForElementToBeRemoved(screen.queryByRole(/progressbar/i))

  await waitFor(() => {
    fireEvent.click(screen.getAllByRole('button', { name: /delete/i })[1])
  })

  await waitFor(() => {
    expect(screen.getByText(/delete user/i)).toBeInTheDocument()
  })

  fireEvent.click(screen.getByRole('button', { name: /ok/i }))

  await waitFor(() => {
    expect(screen.queryByText(/user deleted/i)).toBeInTheDocument()
  })
})

test('Users :: cancels delete dialog', async () => {
  customRender(<Users />)

  await waitForElementToBeRemoved(screen.queryByRole(/progressbar/i))

  await waitFor(() => {
    fireEvent.click(screen.getAllByRole('button', { name: /delete/i })[1])
  })

  await waitFor(() => {
    expect(screen.getByText(/delete user/i)).toBeInTheDocument()
  })

  fireEvent.click(screen.getByRole('button', { name: /cancel/i }))

  await waitFor(() => {
    expect(screen.queryByText(/delete user/i)).not.toBeInTheDocument()
  })
})

test('Users :: closes delete dialog', async () => {
  customRender(<Users />)

  await waitForElementToBeRemoved(screen.queryByRole(/progressbar/i))

  await waitFor(() => {
    fireEvent.click(screen.getAllByRole('button', { name: /delete/i })[1])
  })

  await waitFor(() => {
    expect(screen.getByText(/delete user/i)).toBeInTheDocument()
  })

  await waitFor(() => {
    const presentation = screen.getAllByRole(/presentation/i)
    if (presentation[0].firstElementChild) {
      fireEvent.click(presentation[0].firstElementChild)
    }
  })

  await waitFor(() => {
    expect(screen.queryByText(/delete user/i)).not.toBeInTheDocument()
  })
})

test('Users :: rejects self deletion', async () => {
  customRender(<Users />, { user: user })

  await waitForElementToBeRemoved(screen.queryByRole(/progressbar/i))

  server.use(
    rest.delete(`${config.apiUrl}api/v1/users/2`, async (req, res, ctx) => {
      return res(ctx.status(204))
    })
  )

  await waitFor(() => {
    fireEvent.click(screen.getAllByRole('button', { name: /delete/i })[1])
  })

  await waitFor(() => {
    expect(
      screen.getByText(/not allowed: user prohibited from deleting self/i)
    ).toBeInTheDocument()
  })
})

test('Users :: edits form sucessfully', async () => {
  customRender(<Users />)

  await waitForElementToBeRemoved(screen.queryByRole(/progressbar/i))

  await waitFor(() => {
    fireEvent.click(screen.getAllByRole('button', { name: /edit/i })[1])
  })

  await waitFor(() => {
    expect(
      screen.getByRole('heading', { name: /edit user/i })
    ).toBeInTheDocument()
  })

  const email = screen.getByRole('textbox', {
    name: /email/i
  }) as HTMLInputElement
  fireEvent.change(email, { target: { value: 'baz@qux.com' } })

  await waitFor(async () => {
    fireEvent.click(screen.getByRole('button', { name: /edit/i }))
  })

  await waitFor(() => {
    expect(screen.queryByText(/user edited/i)).toBeInTheDocument()
  })
})

test('Users :: resets user successfully', async () => {
  customRender(<Users />)

  await waitForElementToBeRemoved(screen.queryByRole(/progressbar/i))

  await waitFor(() => {
    const btn = screen.getAllByRole('button', {
      name: /more/i
    })[1]
    fireEvent.mouseUp(btn)
    fireEvent.click(btn)
  })

  await waitFor(async () => {
    const link = screen.getByRole('menuitem', { name: /reset password/i })
    fireEvent.mouseUp(link)
    fireEvent.click(link)
  })

  await waitFor(() => {
    expect(screen.queryByText(/request sent/i)).toBeInTheDocument()
  })
})

test('Users :: sorts rows', async () => {
  customRender(<Users />)

  await waitForElementToBeRemoved(screen.queryByRole(/progressbar/i))

  await waitFor(() => {
    fireEvent.click(screen.getAllByTitle(/sort/i)[0])
  })

  await waitFor(() => {
    expect(screen.getByTestId(/arrowdownwardicon/i)).toBeInTheDocument()
  })
})

test('Users :: paginates', async () => {
  customRender(<Users />)

  await waitForElementToBeRemoved(screen.queryByRole(/progressbar/i))

  fireEvent.mouseDown(screen.getByRole('button', { name: /rows per page/i }))

  await waitFor(() => {
    fireEvent.click(screen.getAllByRole(/option/i)[0])
  })

  expect(screen.getByText(/1–1 of 2/i)).toBeInTheDocument()

  fireEvent.click(screen.getByRole('button', { name: /go to next page/i }))

  await waitForElementToBeRemoved(screen.queryByRole(/progressbar/i))

  await waitFor(() => {
    expect(screen.getByText(/2–2 of 2/i)).toBeInTheDocument()
  })
})

test('Users :: rejects form with duplicate email', async () => {
  server.use(
    rest.post(`${config.apiUrl}api/v1/users`, async (req, res, ctx) => {
      return res(
        ctx.status(409),
        ctx.json({
          error: 'Conflict',
          message: 'Email already exists',
          statusCode: 409
        })
      )
    })
  )

  customRender(<Users />)

  fireEvent.click(screen.getByRole('button', { name: /add/i }))

  await waitFor(() => {
    expect(
      screen.getByRole('heading', { name: /add user/i })
    ).toBeInTheDocument()
  })

  const email = screen.getByRole('textbox', {
    name: /email/i
  }) as HTMLInputElement

  await waitFor(async () => {
    fireEvent.change(email, { target: { value: 'foo@bar.com' } })
  })

  await waitFor(async () => {
    fireEvent.click(screen.getByRole('button', { name: /add/i }))
  })

  await waitFor(() => {
    expect(screen.queryByText(/Email already exists/i)).toBeInTheDocument()
  })
})

test('Users :: rejects form with duplicate username', async () => {
  server.use(
    rest.post(`${config.apiUrl}api/v1/users`, async (req, res, ctx) => {
      return res(
        ctx.status(409),
        ctx.json({
          error: 'Conflict',
          message: 'Username already exists',
          statusCode: 409
        })
      )
    })
  )

  customRender(<Users />)

  fireEvent.click(screen.getByRole('button', { name: /add/i }))

  await waitFor(() => {
    expect(
      screen.getByRole('heading', { name: /add user/i })
    ).toBeInTheDocument()
  })

  const email = screen.getByRole('textbox', {
    name: /email/i
  }) as HTMLInputElement
  fireEvent.change(email, { target: { value: 'foo@bar.com' } })

  const username = screen.getByRole('textbox', {
    name: /username/i
  }) as HTMLInputElement
  fireEvent.change(username, { target: { value: 'bazqux' } })

  await waitFor(async () => {
    fireEvent.click(screen.getByRole('button', { name: /add/i }))
  })

  await waitFor(() => {
    expect(screen.queryByText(/Username already exists/i)).toBeInTheDocument()
  })
})

test('Users :: shows server error if create fails', async () => {
  server.use(
    rest.post(`${config.apiUrl}api/v1/users`, async (req, res, ctx) => {
      return res(
        ctx.status(500),
        ctx.json({
          message: 'Failed to fetch'
        })
      )
    })
  )

  customRender(<Users />)

  fireEvent.click(screen.getByRole('button', { name: /add/i }))

  await waitFor(() => {
    expect(
      screen.getByRole('heading', { name: /add user/i })
    ).toBeInTheDocument()
  })

  const email = screen.getByRole('textbox', {
    name: /email/i
  }) as HTMLInputElement
  fireEvent.change(email, { target: { value: 'foo@bar.com' } })

  await waitFor(async () => {
    fireEvent.click(screen.getByRole('button', { name: /add/i }))
  })

  await waitFor(() => {
    expect(screen.getByText(/failed to fetch/i)).toBeInTheDocument()
  })
})

test('Users :: shows server error if delete fails', async () => {
  server.use(
    rest.delete(
      `${config.apiUrl}api/v1/users/2`,
      async (req, res, ctx) => {
        return res(
          ctx.status(500),
          ctx.json({
            message: 'Failed to fetch'
          })
        )
      }
    )
  )

  customRender(<Users />)

  await waitForElementToBeRemoved(screen.queryByRole(/progressbar/i))

  await waitFor(() => {
    fireEvent.click(screen.getAllByRole('button', { name: /delete/i })[1])
  })

  await waitFor(() => {
    expect(screen.getByText(/delete user/i)).toBeInTheDocument()
  })

  fireEvent.click(screen.getByRole('button', { name: /ok/i }))

  await waitFor(() => {
    expect(screen.getByText(/failed to fetch/i)).toBeInTheDocument()
  })
})

test('Users :: shows server error if read fails', async () => {
  server.use(
    rest.get(`${config.apiUrl}api/v1/users`, async (req, res, ctx) => {
      return res(
        ctx.status(500),
        ctx.json({
          message: 'Failed to fetch'
        })
      )
    })
  )

  customRender(<Users />)

  await waitFor(() => {
    expect(screen.getByText(/failed to fetch/i)).toBeInTheDocument()
  })
})

test('Users :: shows server error if update fails', async () => {
  server.use(
    rest.patch(
      `${config.apiUrl}api/v1/users/:userId`,
      async (req, res, ctx) => {
        return res(
          ctx.status(500),
          ctx.json({
            message: 'Failed to fetch'
          })
        )
      }
    )
  )

  customRender(<Users />)

  await waitForElementToBeRemoved(screen.queryByRole(/progressbar/i))

  await waitFor(() => {
    fireEvent.click(screen.getAllByRole('button', { name: /edit/i })[1])
  })

  await waitFor(() => {
    expect(
      screen.getByRole('heading', { name: /edit user/i })
    ).toBeInTheDocument()
  })

  const email = screen.getByRole('textbox', {
    name: /email/i
  }) as HTMLInputElement
  fireEvent.change(email, { target: { value: 'baz@qux.com' } })

  await waitFor(async () => {
    fireEvent.click(screen.getByRole('button', { name: /edit/i }))
  })

  await waitFor(() => {
    expect(screen.getByText(/failed to fetch/i)).toBeInTheDocument()
  })
})