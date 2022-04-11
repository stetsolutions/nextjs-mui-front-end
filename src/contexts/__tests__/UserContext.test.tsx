import { render } from '@testing-library/react'

import { UserContext, UserProvider, isAuthorized } from '../User'
import { user } from '../../utilities/testing/users'

test('UserContext :: [UserContext] renders component', () => {
  const user = {}

  const value = {
    user: {},
    setUser: () => {},
    isAuthenticated: Boolean(Object.keys(user).length),
    isAuthorized: (pathname: string) => true
  }

  render(<UserContext.Provider value={value}>{}</UserContext.Provider>)
})

test('UserContext :: [UserProvider] renders component', () => {
  const user = {}

  render(<UserProvider></UserProvider>)
})

test('UserContext :: [UserProvider] renders component with attributes', () => {
  const user = {}

  render(<UserProvider override={user}></UserProvider>)
})

test('UserContext :: [isAuthorized] returns false when user undefined', () => {
  const authorized = isAuthorized('/dashboard')

  expect(authorized).toBeFalsy()
})

test('UserContext :: [isAuthorized] returns true when option roles undefined', () => {
  localStorage.setItem('user', JSON.stringify(user))
  const authorized = isAuthorized('/dashboard')

  expect(authorized).toBeTruthy()
})

test('UserContext :: [isAuthorized] returns true when option roles defined', () => {
  localStorage.setItem('user', JSON.stringify(user))
  const authorized = isAuthorized('/account')

  expect(authorized).toBeTruthy()
})

test('UserContext :: [isAuthorized] returns false when role needed and no user role defined', () => {
  const user = {
    id: 2,
    created: '2021-09-07T18:30:02.290Z',
    email: 'foo@bar.com',
    last_name: 'Bar',
    first_name: 'Foo',
    role: null,
    username: 'foobar',
    verified: null
  }

  localStorage.setItem('user', JSON.stringify(user))
  const authorized = isAuthorized('/quux')

  expect(authorized).toBeFalsy()
})
