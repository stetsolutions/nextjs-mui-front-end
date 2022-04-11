import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import ExitToAppIcon from '@mui/icons-material/ExitToApp'
import MenuIcon from '@mui/icons-material/Menu'
import VpnKeyIcon from '@mui/icons-material/VpnKey'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Drawer from '@mui/material/Drawer'
import IconButton from '@mui/material/IconButton'
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Cookies from 'js-cookie'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

import logo from '../assets/logo.svg'
import { useLayoutContext } from '../contexts/Layout'
import { useUserContext } from '../contexts/User'
import { options as routeOptions } from '../config/options'
import Access from '../modules/Access/Access'

const drawerWidth = 240

function Header () {
  const { isDisplayed } = useLayoutContext()
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const router = useRouter()
  const [signInOpen, setSignInOpen] = useState(false)
  const { isAuthenticated, user, setUser } = useUserContext()

  const container =
    typeof window !== 'undefined' ? () => window.document.body : undefined

  const handleDrawerItemClick = () => {
    setMobileOpen(false)
  }

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setMenuAnchor(event.currentTarget)
  }

  const handleMenuClose = () => {
    setMenuAnchor(null)
  }

  const handleSignInClick = () => {
    setMenuAnchor(null)
    setSignInOpen(true)
  }

  const handleSignInClose = () => {
    setSignInOpen(false)
  }

  const handleSignOutClick = () => {
    Cookies.remove('ss-id')

    localStorage.removeItem('user')

    setMenuAnchor(null)
    setUser({})

    router.push('/')
  }

  useEffect(() => {
    setMounted(true)
  }, [])

  const templateContent = (
    <div>
      <Box sx={{ px: 2, pt: 2, width: 200 }}>
        <Image src={logo} alt='Stet Solutions' />
      </Box>
      <List>
        {routeOptions
          .filter(function (item) {
            return item.location === 'drawer'
          })
          .filter(function (item) {
            if (mounted) {
              return item.roles
                ? item.roles.includes(user.role ? user.role : '')
                : true
            }
          })
          .map((item, index) => (
            <Link href={item.url} key={index} passHref>
              <ListItemButton
                key={index}
                onClick={handleDrawerItemClick}
                selected={item.url === router.pathname}
              >
                <ListItemIcon>
                  <item.icon />
                </ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </Link>
          ))}
      </List>
    </div>
  )

  return (
    <Box
      sx={{
        display: isDisplayed(router.pathname) ? 'none' : 'flex'
      }}
    >
      <AppBar
        elevation={0}
        position='fixed'
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` }
        }}
      >
        <Toolbar>
          <IconButton
            color='inherit'
            aria-label='open drawer'
            edge='start'
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography noWrap component='h2' variant='h5' sx={{ flexGrow: 1 }}>
            {routeOptions.find(el => el.url === router.pathname)?.text}
          </Typography>
          <Typography variant='h6'>{mounted ? user.username : ''}</Typography>
          <IconButton
            aria-label='open menu'
            aria-controls='menu'
            aria-haspopup='true'
            color='inherit'
            edge='end'
            onClick={handleMenuClick}
          >
            <AccountCircleIcon fontSize='large' />
          </IconButton>
          <Menu
            id='menu'
            anchorEl={menuAnchor}
            keepMounted
            open={Boolean(menuAnchor)}
            onClose={handleMenuClose}
          >
            {routeOptions
              .filter(function (item) {
                return item.location === 'toolbar'
              })
              .filter(function (item) {
                return item.roles
                  ? item.roles.includes(user.role ? user.role : '')
                  : true
              })
              .map((item, index) => (
                <Link href={item.url} key={index} passHref>
                  <MenuItem
                    key={index}
                    onClick={handleMenuClose}
                    selected={item.url === router.pathname}
                  >
                    <ListItemIcon>
                      <item.icon />
                    </ListItemIcon>
                    <ListItemText primary={item.text} />
                  </MenuItem>
                </Link>
              ))}
            <MenuItem
              onClick={handleSignInClick}
              sx={{
                display: !isAuthenticated ? 'flex' : 'none'
              }}
            >
              <ListItemIcon>
                <VpnKeyIcon />
              </ListItemIcon>
              <ListItemText>Sign In</ListItemText>
            </MenuItem>
            <MenuItem
              onClick={handleSignOutClick}
              sx={{
                display: isAuthenticated ? 'flex' : 'none'
              }}
            >
              <ListItemIcon>
                <ExitToAppIcon />
              </ListItemIcon>
              <ListItemText>Sign Out</ListItemText>
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      <Box
        component='nav'
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label='side navigation'
      >
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Drawer
          container={container}
          variant='temporary'
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth
            }
          }}
        >
          {templateContent}
        </Drawer>
        <Drawer
          variant='permanent'
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth
            }
          }}
          open
        >
          {templateContent}
        </Drawer>
      </Box>
      <Access close={handleSignInClose} isOpen={signInOpen} variant='dialog' />
    </Box>
  )
}

export default Header
