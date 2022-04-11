import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import { useRouter } from 'next/router'
import { FC } from 'react'

import Notifications from '../components/Notifications'
import { useLayoutContext } from '../contexts/Layout'
import Footer from './Footer'
import Header from './Header'

const Layout: FC = ({ children }) => {
  const { isDisplayed } = useLayoutContext()
  const router = useRouter()

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Notifications />
      <Header />
      <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
        <Toolbar
          sx={{
            display: isDisplayed(router.pathname) ? 'none' : 'flex'
          }}
        />
        <Box sx={{ flexGrow: 1 }}>
          <main>{children}</main>
        </Box>
        <Footer />
      </Box>
    </Box>
  )
}

export default Layout
