import { rest } from 'msw'

import config from '../../../config'
import { server } from '../../../mocks/server'
import {
  customRender,
  fireEvent,
  screen,
  waitFor
} from '../../../utilities/testing/custom-render'
import { user } from '../../../utilities/testing/users'
import AccountProfile from '../AccountProfile'

test('AccountProfile :: renders component', () => {
  customRender(<AccountProfile />)
})

test('AccountProfile :: rejects form with empty fields', async () => {
  customRender(<AccountProfile />, { user: user })

  const firstName = screen.getByRole('textbox', {
    name: /first name/i
  }) as HTMLInputElement
  fireEvent.change(firstName, { target: { value: '' } })

  const lastName = screen.getByRole('textbox', {
    name: /last name/i
  }) as HTMLInputElement
  fireEvent.change(lastName, { target: { value: '' } })

  const username = screen.getByRole('textbox', {
    name: /username/i
  }) as HTMLInputElement
  fireEvent.change(username, { target: { value: '' } })

  fireEvent.click(screen.getByRole('button', { name: /update/i }))

  await waitFor(() => {
    expect(screen.getByText(/first name is required/i)).toBeInTheDocument()
    expect(screen.getByText(/last name is required/i)).toBeInTheDocument()
    expect(screen.getByText(/username is required/i)).toBeInTheDocument()
  })
})

test('AccountProfile :: resets form', async () => {
  customRender(<AccountProfile />, { user: user })

  const firstName = screen.getByRole('textbox', {
    name: /first name/i
  }) as HTMLInputElement
  fireEvent.change(firstName, { target: { value: 'Foo' } })

  const lastName = screen.getByRole('textbox', {
    name: /last name/i
  }) as HTMLInputElement
  fireEvent.change(lastName, { target: { value: 'Bar' } })

  const username = screen.getByRole('textbox', {
    name: /username/i
  }) as HTMLInputElement
  fireEvent.change(username, { target: { value: 'foobar' } })

  fireEvent.click(screen.getByRole('button', { name: /cancel/i }))

  await waitFor(() => {
    expect(firstName).toHaveValue('')
    expect(lastName).toHaveValue('')
    expect(username).toHaveValue('')
  })
})

test('AccountProfile :: submits form successfully', async () => {
  customRender(<AccountProfile />, { user: user })

  const firstName = screen.getByRole('textbox', {
    name: /first name/i
  })
  fireEvent.change(firstName, { target: { value: 'Foo' } })

  const lastName = screen.getByRole('textbox', {
    name: /last name/i
  })
  fireEvent.change(lastName, { target: { value: 'Bar' } })

  const username = screen.getByRole('textbox', {
    name: /username/i
  })
  fireEvent.change(username, { target: { value: 'foobar' } })

  fireEvent.click(screen.getByRole('button', { name: /update/i }))

  await waitFor(() => {
    expect(screen.getByText(/profile updated/i)).toBeInTheDocument()
  })
})

test('AccountProfile :: shows server error if id username unavailable', async () => {
  server.use(
    rest.patch(
      `${config.apiUrl}api/v1/users/*/profile`,
      async (req, res, ctx) => {
        return res(
          ctx.status(409),
          ctx.json({
            error: 'Forbidden',
            message: 'Username unavailable',
            statusCode: 409
          })
        )
      }
    )
  )

  customRender(<AccountProfile />, { user: user })

  const firstName = screen.getByRole('textbox', {
    name: /first name/i
  })
  fireEvent.change(firstName, { target: { value: 'Foo' } })

  const lastName = screen.getByRole('textbox', {
    name: /last name/i
  })
  fireEvent.change(lastName, { target: { value: 'Bar' } })

  const username = screen.getByRole('textbox', {
    name: /username/i
  })
  fireEvent.change(username, { target: { value: 'foobar' } })

  fireEvent.click(screen.getByRole('button', { name: /update/i }))

  await waitFor(() => {
    expect(screen.getByText(/username unavailable/i)).toBeInTheDocument()
  })
})

test('AccountProfile :: shows server error if id parameter omitted', async () => {
  server.use(
    rest.patch(
      `${config.apiUrl}api/v1/users/*/profile`,
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

  customRender(<AccountProfile />)

  const firstName = screen.getByRole('textbox', {
    name: /first name/i
  })
  fireEvent.change(firstName, { target: { value: 'Foo' } })

  const lastName = screen.getByRole('textbox', {
    name: /last name/i
  })
  fireEvent.change(lastName, { target: { value: 'Bar' } })

  const username = screen.getByRole('textbox', {
    name: /username/i
  })
  fireEvent.change(username, { target: { value: 'foobar' } })

  fireEvent.click(screen.getByRole('button', { name: /update/i }))

  await waitFor(() => {
    expect(screen.getByText(/params.id should be number/i)).toBeInTheDocument()
  })
})
