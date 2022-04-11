import { yupResolver } from '@hookform/resolvers/yup'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import { zxcvbn } from '@zxcvbn-ts/core'
import { useRouter } from 'next/router'
import { useSnackbar } from 'notistack'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import * as yup from 'yup'

import logo from '../../assets/logo.svg'
import PasswordField from '../../components/PasswordField'
import { change } from '../../services/api/auth'
import CustomError from '../../types/CustomError'

interface Form {
  confirmPassword: string
  newPassword: string
}

const defaultValues = {
  newPassword: '',
  confirmPassword: ''
}

const schema = yup.object({
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

function Change () {
  const {
    control,
    formState: { errors },
    handleSubmit
  } = useForm<Form>({
    defaultValues,
    resolver: yupResolver(schema)
  })
  const router = useRouter()
  const { closeSnackbar, enqueueSnackbar } = useSnackbar()

  const onSubmit: SubmitHandler<Form> = async data => {
    const { userId, token } = router.query

    try {
      await change(userId, data, token)

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

      enqueueSnackbar('Password changed', {
        action,
        variant: 'success'
      })

      router.push('/access')
    } catch (error) {
      enqueueSnackbar(`${(error as CustomError).message}`, {
        autoHideDuration: 3000,
        variant: 'error'
      })
    }
  }

  const templateContent = (
    <Grid
      container
      direction='column'
      spacing={2}
      sx={{ alignItems: 'center', justifyContent: 'center' }}
    >
      <Grid item sx={{ width: '100%' }}>
        <Controller
          name='newPassword'
          control={control}
          render={({ field: { ref, ...rest } }) => (
            <PasswordField
              error={!!errors.newPassword}
              fullWidth
              helperText={errors.newPassword ? errors.newPassword.message : ''}
              id='new-password'
              label='New Password'
              {...rest}
            />
          )}
        />
      </Grid>
      <Grid item sx={{ width: '100%' }}>
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
              label='Confirm Password'
              {...rest}
            />
          )}
        />
      </Grid>
    </Grid>
  )

  const templateActions = (
    <Grid
      container
      alignItems='center'
      direction='column'
      justifyContent='center'
      spacing={2}
    >
      <Grid item>
        <Button color='primary' type='submit' variant='contained'>
          Change
        </Button>
      </Grid>
    </Grid>
  )

  return (
    <Box
      sx={{
        alignItems: 'center',
        display: 'flex',
        minHeight: '100vh',
        justifyContent: 'center'
      }}
    >
      <Card sx={{ minWidth: 250, pb: 4, pt: 2, px: 1 }}>
        <Box
          sx={{
            alignItems: 'center',
            display: 'flex',
            justifyContent: 'center'
          }}
        >
          <CardMedia
            component='img'
            image={logo}
            alt='STET Solutions'
            sx={{ p: 2, maxWidth: 250 }}
          />
        </Box>
        <Typography
          align='center'
          component='div'
          gutterBottom
          variant='h6'
          sx={{ my: 2 }}
        >
          Change Password
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <CardContent>{templateContent}</CardContent>
          <CardActions>{templateActions}</CardActions>
        </form>
      </Card>
    </Box>
  )
}

export default Change
