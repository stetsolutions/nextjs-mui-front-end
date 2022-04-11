import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import Box from '@mui/material/Box'
import Tab from '@mui/material/Tab'

import { useState } from 'react'

import AccountEmail from './AccountEmail'
import AccountPassword from './AccountPassword'
import AccountProfile from './AccountProfile'

function Account () {
  const [tabValue, setTabValue] = useState('1')

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setTabValue(newValue)
  }

  return (
    <Box>
      <TabContext value={tabValue}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList
            aria-label='account settings'
            indicatorColor='primary'
            onChange={handleTabChange}
            sx={{ backgroundColor: 'white' }}
          >
            <Tab label='Profile' value='1' />
            <Tab label='Password' value='2' />
            <Tab label='Email' value='3' />
          </TabList>
        </Box>
        <TabPanel value='1'>
          <AccountProfile />
        </TabPanel>
        <TabPanel value='2'>
          <AccountPassword />
        </TabPanel>
        <TabPanel value='3'>
          <AccountEmail />
        </TabPanel>
      </TabContext>
    </Box>
  )
}

export default Account
