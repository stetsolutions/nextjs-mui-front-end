import AccountBoxOutlinedIcon from '@mui/icons-material/AccountBoxOutlined'
import CircleOutlinedIcon from '@mui/icons-material/CircleOutlined'
import DashboardIcon from '@mui/icons-material/Dashboard'
import GroupIcon from '@mui/icons-material/Group'
import StarIcon from '@mui/icons-material/Star'
import VpnKeyIcon from '@mui/icons-material/VpnKey'

const options = [
  // Drawer
  {
    exact: true,
    icon: DashboardIcon,
    order: 1,
    location: 'drawer',
    text: 'Dashboard',
    url: '/dashboard'
  },
  {
    icon: CircleOutlinedIcon,
    order: 2,
    location: 'drawer',
    roles: ['user', 'admin'],
    text: 'Quux',
    url: '/quux'
  },
  {
    icon: GroupIcon,
    order: 3,
    location: 'drawer',
    roles: ['admin'],
    text: 'Users',
    url: '/users'
  },
  // Toolbar
  {
    icon: AccountBoxOutlinedIcon,
    order: 1,
    location: 'toolbar',
    roles: ['user', 'admin'],
    text: 'Account',
    url: '/account'
  },
  {
    icon: CircleOutlinedIcon,
    order: 2,
    location: 'toolbar',
    text: 'Quuz',
    url: '/quuz'
  },
  // Hidden
  {
    icon: StarIcon,
    location: 'hidden',
    roles: ['user', 'admin'],
    text: 'Account',
    url: '/account'
  },
  {
    icon: StarIcon,
    location: 'hidden',
    text: 'Change',
    url: '/change'
  },
  {
    icon: VpnKeyIcon,
    location: 'hidden',
    text: 'Access',
    url: '/access'
  },
  {
    icon: StarIcon,
    location: 'hidden',
    text: 'Reset',
    url: '/reset'
  },
  {
    icon: StarIcon,
    location: 'hidden',
    text: 'Verify',
    url: '/verify'
  }
]

export default options
export { options }
