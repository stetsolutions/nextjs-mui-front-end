import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'

function Quuz () {
  return (
    <Box p={3}>
      <Card sx={{ p: 1 }}>
        <CardHeader
          title='Quuz'
          titleTypographyProps={{
            component: 'h3',
            variant: 'h5'
          }}
        />
        <CardContent>
          <Typography variant='body1'>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id est laborum.
          </Typography>
        </CardContent>
      </Card>
    </Box>
  )
}

export default Quuz
