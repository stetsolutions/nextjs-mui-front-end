import { useSnackbar } from 'notistack'
import { useCallback, useEffect } from 'react'
import { useRouter } from 'next/router'

import { verify } from '../../services/api/auth'
import CustomError from '../../types/CustomError'

function Verify () {
  const router = useRouter()
  const { enqueueSnackbar } = useSnackbar()

  const handleFetch = useCallback(async () => {
    try {
      const { userId, token } = router.query

      await verify(String(userId), String(token))

      const user = localStorage.getItem('user')

      if (user) {
        const parsed = JSON.parse(user)
        parsed.verified = true
        localStorage.setItem('user', JSON.stringify(parsed))
      }

      enqueueSnackbar('Request verified: please sign in', {
        autoHideDuration: 3000,
        variant: 'success'
      })
    } catch (error) {
      if ((error as CustomError).statusCode === 404) {
        enqueueSnackbar('Request expired: Please try again', {
          autoHideDuration: 3000,
          variant: 'error'
        })
      } else {
        enqueueSnackbar(`${(error as CustomError).message}`, {
          autoHideDuration: 3000,
          variant: 'error'
        })
      }
    }

    if (process.env.NODE_ENV !== 'test') {
      router.push('/access')
    }
  }, [enqueueSnackbar, router])

  useEffect(() => {
    if (!router.isReady) return

    handleFetch()
  }, [handleFetch])

  return null
}

export default Verify
