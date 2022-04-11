import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'

import { useRouter } from 'next/router'

import { useLayoutContext } from '../contexts/Layout'

function Footer () {
  const { isDisplayed } = useLayoutContext()
  const router = useRouter()

  return (
    <footer>
      <Box
        sx={{
          bgcolor: 'primary.main',
          color: '#fff',
          display: isDisplayed(router.pathname) ? 'none' : 'flex',
          p: 2
        }}
      >
        <Container>
          <Grid container>
            <Grid item xs={12}>
              <Typography align='center' variant='body2'>
                &copy; Copyright 2021, STET Solutions Inc. All Rights Reserved
              </Typography>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </footer>
  )
}

export default Footer
