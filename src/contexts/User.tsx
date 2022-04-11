import { FC, createContext, useContext, useState } from 'react'
import options from '../config/options'

interface CreateContext {
  user: User
  setUser: (user: User) => void
  isAuthenticated: boolean
  isAuthorized: (pathname: string) => boolean | undefined
}

interface Props {
  override?: {}
}

interface User {
  created?: string
  email?: string
  first_name?: string
  id?: number
  last_name?: string
  role?: string
  username?: string
  verified?: boolean | null
}

const isAuthorized = (pathname: string) => {
  const user = JSON.parse(localStorage.getItem('user') || '{}')

  if (Object.keys(user).length) {
    const route = options.filter(function (el) {
      return el.url === pathname
    })

    if (!route[0].roles) {
      return true
    }

    if (!user.role) {
      return false
    }

    return route[0].roles.includes(user.role)
  }
}

const UserContext = createContext<CreateContext>({} as CreateContext)

const UserProvider: FC<Props> = ({ children, override }) => {
  let state = {}

  if (override) {
    state = override
  } else if (typeof window !== 'undefined') {
    state = JSON.parse(localStorage.getItem('user') || '{}')
  }

  const [user, setUser] = useState(state)

  const value = {
    user,
    setUser,
    isAuthenticated: Boolean(Object.keys(user).length),
    isAuthorized: isAuthorized
  }

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}

const useUserContext = () => useContext(UserContext)

export { UserContext, UserProvider, isAuthorized, useUserContext }
