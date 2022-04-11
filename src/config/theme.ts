import { createTheme } from '@mui/material/styles'
import { red } from '@mui/material/colors'

// Create a theme instance.
const theme = createTheme({
  palette: {
    background: {
      default: '#f5f5f5'
    },
    primary: {
      light: '#4f83cc',
      main: '#01579b',
      dark: '#002f6c'
    }
  }
})

export default theme
