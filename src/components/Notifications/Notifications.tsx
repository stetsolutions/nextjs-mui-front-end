import Box from '@mui/material/Box'
import Button from '@mui/material/Button'

import Cookies from 'js-cookie'
import { useRouter } from 'next/router'
import { useSnackbar } from 'notistack'
import { useCallback, useEffect } from 'react'

import { useLayoutContext } from '../../contexts/Layout'
import { useUserContext } from '../../contexts/User'
import { resend } from '../../services/api/auth'
import CustomError from '../../types/CustomError'

function Notifications () {
  const { isDisplayed } = useLayoutContext()
  const router = useRouter()
  const { closeSnackbar, enqueueSnackbar } = useSnackbar()
  const { user, setUser } = useUserContext()

  const verifyUser = useCallback(async () => {
    if (!Object.keys(user).length || isDisplayed(router.pathname)) return

    const handleResend = async (key: string | number) => {
      const action = (key: string | number) => (
        <Box>
          <Button
            sx={{ color: 'white' }}
            onClick={() => {
              closeSnackbar(key)
            }}
          >
            Dismiss
          </Button>
        </Box>
      )

      try {
        await resend(user.email!)

        localStorage.removeItem('user')
        Cookies.remove('ss-id')
        setUser({})

        router.push('/access')

        closeSnackbar(key)

        enqueueSnackbar('A verification link has been sent', {
          action,
          persist: true,
          variant: 'info'
        })
      } catch (error) {
        enqueueSnackbar(`${(error as CustomError).message}`, {
          autoHideDuration: 3000,
          variant: 'error'
        })
      }
    }

    if (!user.verified) {
      const action = (key: string | number) => (
        <Box>
          <Button
            sx={{ color: 'white' }}
            onClick={async () => {
              handleResend(key)
            }}
          >
            Resend
          </Button>
        </Box>
      )

      enqueueSnackbar(
        'Email unverified: please follow the link sent to your address',
        {
          action,
          persist: true,
          preventDuplicate: true,
          variant: 'warning'
        }
      )
    }
  }, [
    closeSnackbar,
    enqueueSnackbar,
    isDisplayed,
    router.pathname,
    setUser,
    user
  ])

  useEffect(() => {
    verifyUser()
  }, [verifyUser])

  return null
}

export default Notifications
