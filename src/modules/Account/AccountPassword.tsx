import { yupResolver } from '@hookform/resolvers/yup'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'
import { zxcvbn } from '@zxcvbn-ts/core'
import Cookies from 'js-cookie'
import { useRouter } from 'next/router'
import { useSnackbar } from 'notistack'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import * as yup from 'yup'

import PasswordField from '../../components/PasswordField'
import { useUserContext } from '../../contexts/User'
import { updatePassword } from '../../services/api/users'
import CustomError from '../../types/CustomError'

interface Form {
  confirmPassword: string
  currentPassword: string
  id: number
  newPassword: string
}

function AccountPassword () {
  const router = useRouter()
  const { closeSnackbar, enqueueSnackbar } = useSnackbar()
  const { user, setUser } = useUserContext()

  const defaultValues = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  }

  const schema = yup.object({
    currentPassword: yup.string().required('Current password is required'),
    newPassword: yup
      .string()
      .required('New password is required')
      .test(
        'password-strength',
        'Password must be stronger',
        async (value?: string) => {
          if (value) {
            const passwordStrength = await zxcvbn(value)
            return passwordStrength.score >= 2
          }
          return true
        }
      ),
    confirmPassword: yup
      .string()
      .required('Password confirmation is required')
      .oneOf([yup.ref('newPassword')], 'Password must match new password')
  })

  const {
    control,
    formState: { errors },
    handleSubmit,
    reset,
    setError
  } = useForm<Form>({
    defaultValues,
    resolver: yupResolver(schema)
  })

  const onSubmit: SubmitHandler<Form> = async data => {
    try {
      if (user.id) data.id = user.id

      await updatePassword(data)

      reset(defaultValues)

      Cookies.remove('ss-id')
      localStorage.removeItem('user')
      setUser({})

      router.push('/access')

      const action = (key: string | number) => (
        <Button
          sx={{ color: 'white' }}
          onClick={() => {
            closeSnackbar(key)
          }}
        >
          Dismiss
        </Button>
      )

      enqueueSnackbar('A verification link has been to sent', {
        action,
        persist: true,
        variant: 'info'
      })
    } catch (error) {
      if ((error as CustomError).statusCode === 403) {
        setError('currentPassword', {
          type: 'manual',
          message: 'Password is incorrect'
        })
      } else {
        enqueueSnackbar(`${(error as CustomError).message}`, {
          autoHideDuration: 3000,
          variant: 'error'
        })
      }
    }
  }

  const cardContent = (
    <CardContent>
      <Grid container>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6} lg={3}>
            <Controller
              name='currentPassword'
              control={control}
              render={({ field: { ref, ...rest } }) => (
                <PasswordField
                  error={!!errors.currentPassword}
                  fullWidth
                  helperText={
                    errors.currentPassword ? errors.currentPassword.message : ''
                  }
                  id='current-password'
                  label='Current Password'
                  {...rest}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <Controller
              name='newPassword'
              control={control}
              render={({ field: { ref, ...rest } }) => (
                <PasswordField
                  error={!!errors.newPassword}
                  fullWidth
                  helperText={
                    errors.newPassword ? errors.newPassword.message : ''
                  }
                  id='new-password'
                  label='New Password'
                  {...rest}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <Controller
              name='confirmPassword'
              control={control}
              render={({ field: { ref, ...rest } }) => (
                <PasswordField
                  error={!!errors.confirmPassword}
                  fullWidth
                  helperText={
                    errors.confirmPassword ? errors.confirmPassword.message : ''
                  }
                  id='confirm-password'
                  label='Confirm New Password'
                  {...rest}
                />
              )}
            />
          </Grid>
        </Grid>
      </Grid>
    </CardContent>
  )

  const cardActions = (
    <CardActions sx={{ justifyContent: 'flex-end', p: 2 }}>
      <Button
        color='primary'
        type='reset'
        onClick={() => reset(defaultValues)}
        variant='outlined'
      >
        Cancel
      </Button>

      <Button color='primary' type='submit' variant='contained'>
        Update
      </Button>
    </CardActions>
  )

  return (
    <Card sx={{ p: 1 }}>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        {cardContent}
        {cardActions}
      </form>
    </Card>
  )
}

export default AccountPassword
