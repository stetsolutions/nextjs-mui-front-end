import CssBaseline from '@mui/material/CssBaseline'
import { ThemeProvider } from '@mui/material/styles'
import { render, RenderOptions } from '@testing-library/react'
import mockRouter from 'next-router-mock'
import { SnackbarProvider } from 'notistack'
import { FC, ReactElement } from 'react'

import theme from '../../config/theme'
import { LayoutProvider } from '../../contexts/Layout'
import { UserProvider } from '../../contexts/User'
import Layout from '../../layout/Layout'

interface Props {
  user: {}
}

const exclude = ['/foo', '/change', '/access', '/reset', '/verify']

const Providers: FC<Props> = ({ children, user }) => {
  return (
    <UserProvider override={user}>
      <ThemeProvider theme={theme}>
        <LayoutProvider exclude={exclude}>
          <SnackbarProvider maxSnack={3}>
            <CssBaseline />
            {children}
          </SnackbarProvider>
        </LayoutProvider>
      </ThemeProvider>
    </UserProvider>
  )
}

const customRender = (
  ui: ReactElement,
  { route = '/', user = {} } = {},
  options?: Omit<RenderOptions, 'wrapper'>
) => {
  mockRouter.push(route)

  return render(ui, {
    wrapper: props => <Providers user={user} {...props} />,
    ...options
  })
}

export * from '@testing-library/react'
export { customRender }
