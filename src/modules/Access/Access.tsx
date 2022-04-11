import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardMedia from '@mui/material/CardMedia'
import Dialog from '@mui/material/Dialog'
import Tab from '@mui/material/Tab'
import Image from 'next/image'
import { useState } from 'react'

import logo from '../../assets/logo.svg'
import Register from './AccessRegister'
import SignIn from './AccessSignIn'

interface Props {
  close: () => void
  isOpen: boolean
  variant?: string
}

function Access ({ close, isOpen = false, variant = 'page' }: Props) {
  const [tabValue, setTabValue] = useState('1')

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setTabValue(newValue)
  }

  const templateContent = (
    <TabContext value={tabValue}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <TabList
          onChange={handleTabChange}
          aria-label='access'
          indicatorColor='primary'
          variant='fullWidth'
        >
          <Tab label='Sign In' value='1' />
          <Tab label='Register' value='2' />
        </TabList>
      </Box>
      <TabPanel sx={{ px: 0 }} value='1'>
        <SignIn close={close} isOpen={isOpen} variant={variant} />
      </TabPanel>
      <TabPanel sx={{ px: 0 }} value='2'>
        <Register close={close} setTabValue={setTabValue} variant={variant} />
      </TabPanel>
    </TabContext>
  )

  if (variant === 'dialog') {
    return (
      <Dialog open={isOpen} onClose={() => close()}>
        {templateContent}
      </Dialog>
    )
  } else {
    return (
      <Box
        sx={{
          alignItems: 'center',
          display: 'flex',
          minHeight: '100vh',
          justifyContent: 'center'
        }}
      >
        <Card sx={{ minWidth: 250, pt: 1 }}>
          <Box
            sx={{
              alignItems: 'center',
              display: 'flex',
              justifyContent: 'center'
            }}
          >
            <Image src={logo} alt='Stet Solutions' width={250} />
          </Box>
          {templateContent}
        </Card>
      </Box>
    )
  }
}

export default Access
