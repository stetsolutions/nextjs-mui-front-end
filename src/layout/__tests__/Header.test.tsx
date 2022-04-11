import {
  customRender,
  fireEvent,
  screen,
  waitFor
} from '../../utilities/testing/custom-render'
import { admin, user } from '../../utilities/testing/users'
import Header from '../Header'
import mockRouter from 'next-router-mock';

test('Header :: renders component', () => {
  customRender(<Header />)
})

test('Header :: renders but does not display', () => {
  customRender(<Header />, { route: '/verify' })

  expect(
    screen.queryByRole('heading', { name: /dashboard/i })
  ).not.toBeInTheDocument()
})

test('Header :: displays user name when authenticated', () => {
  customRender(<Header />, { user: admin })

  expect(screen.getByRole('heading', { name: /bazqux/i })).toBeInTheDocument()
})

test('Header :: opens drawer navigation via hamburger', async () => {
  customRender(<Header />)

  fireEvent.click(screen.getByRole('button', { name: /open drawer/i }))

  const presentation = screen.getAllByRole(/presentation/i)

  expect(presentation[0].childNodes[0]).toBeVisible()
})

test('Header :: navigates on drawer link click', async () => {
  customRender(<Header />, { user: admin })

  const users = screen.getAllByText(/users/i)
  fireEvent.click(users[0])

  expect(screen.getByRole('heading', { name: /users/i })).toBeInTheDocument()
})

test('Header :: opens menu on button click', async () => {
  customRender(<Header />)

  fireEvent.click(screen.getByRole('button', { name: /open menu/i }))

  expect(screen.getByRole('menuitem', { name: /sign in/i })).toBeInTheDocument()
})

test('Header :: navigates on menu item click', async () => {
  customRender(<Header />, { user: admin })

  fireEvent.click(screen.getByRole('button', { name: /open menu/i }))
  fireEvent.click(screen.getByRole('menuitem', { name: /account/i }))

  expect(screen.getByRole('heading', { name: /account/i })).toBeInTheDocument()
})

test('Header :: closes menu on modal appearance', async () => {
  customRender(<Header />)

  fireEvent.click(screen.getByRole('button', { name: /open menu/i }))

  expect(
    screen.queryByRole('menuitem', { name: /sign in/i })
  ).toBeInTheDocument()

  fireEvent.click(screen.getByRole('menuitem', { name: /sign in/i }))

  expect(
    screen.queryByRole('menuitem', { name: /sign in/i })
  ).not.toBeInTheDocument()
})

test('Header :: closes menu when clicked outside of', async () => {
  customRender(<Header />)

  fireEvent.click(screen.getByRole('button', { name: /open menu/i }))

  await waitFor(() => {
    const presentation = screen.getAllByRole(/presentation/i)
    if (presentation[0].firstElementChild) {
      fireEvent.click(presentation[0].firstElementChild)
    }
  })

  await waitFor(() => {
    expect(
      screen.queryByRole('menuitem', { name: /sign in/i })
    ).not.toBeInTheDocument()
  })
})

test('Header :: closes modal when clicked outside of', async () => {
  customRender(<Header />)

  fireEvent.click(screen.getByRole('button', { name: /open menu/i }))
  fireEvent.click(screen.getByRole('menuitem', { name: /sign in/i }))

  expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument()

  await waitFor(() => {
    const presentation = screen.getAllByRole(/presentation/i)
    if (presentation[0].firstElementChild) {
      fireEvent.click(presentation[0].firstElementChild)
    }
  })

  await waitFor(() => {
    expect(
      screen.queryByRole('button', { name: /sign in/i })
    ).not.toBeInTheDocument()
  })
})

test('Header :: signs out signed in user', async () => {
  customRender(<Header />, { route: '/users', user: admin })

  expect(mockRouter.pathname).toBe('/users')

  fireEvent.click(screen.getByRole('button', { name: /open menu/i }))
  fireEvent.click(screen.getByRole('menuitem', { name: /sign out/i }))
  fireEvent.click(screen.getByRole('button', { name: /open menu/i }))

  expect(screen.getByRole('menuitem', { name: /sign in/i })).toBeInTheDocument()
  expect(
    screen.queryByRole('menuitem', { name: /sign out/i })
  ).not.toBeInTheDocument()

  expect(mockRouter.pathname).toBe('/')
})
