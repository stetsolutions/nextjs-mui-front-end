import { yupResolver } from '@hookform/resolvers/yup'
import Button from '@mui/material/Button'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'
import { zxcvbn } from '@zxcvbn-ts/core'
import Cookies from 'js-cookie'
import { useRouter } from 'next/router'
import { useSnackbar } from 'notistack'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import * as yup from 'yup'

import PasswordField from '../../components/PasswordField'
import { useLayoutContext } from '../../contexts/Layout'
import { useUserContext } from '../../contexts/User'
import { register } from '../../services/api/auth'
import CustomError from '../../types/CustomError'

interface Form {
  email: string
  password: string
}

interface Props {
  close?: () => void
  isOpen?: boolean
  setTabValue?: React.Dispatch<React.SetStateAction<string>>
  variant?: string
}

const defaultValues = {
  email: '',
  password: ''
}

const schema = yup.object({
  email: yup
    .string()
    .email('Email must be valid')
    .required('Email is required'),
  password: yup
    .string()
    .required('Password is required')
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
    )
})

function AccessRegister ({
  close = () => {},
  setTabValue,
  variant = 'page'
}: Props) {
  const {
    control,
    formState: { errors },
    handleSubmit
  } = useForm<Form>({
    defaultValues,
    resolver: yupResolver(schema)
  })
  const { setUser } = useUserContext()
  const { isDisplayed } = useLayoutContext()
  const router = useRouter()
  const { closeSnackbar, enqueueSnackbar } = useSnackbar()

  const onSubmit: SubmitHandler<Form> = async data => {
    localStorage.removeItem('user')
    Cookies.remove('ss-id')
    setUser({})

    try {
      await register(data)

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

      enqueueSnackbar('A verification link has been sent', {
        action,
        persist: true,
        variant: 'info'
      })

      if (setTabValue) {
        setTabValue('1')
      }

      close()

      if (!isDisplayed(router.pathname)) router.push('/access')
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
          name='email'
          control={control}
          render={({ field }) => (
            <TextField
              autoFocus
              error={!!errors.email}
              fullWidth
              helperText={errors.email ? errors.email.message : ''}
              id='email'
              label='Email'
              type='email'
              variant='outlined'
              {...field}
            />
          )}
        />
      </Grid>
      <Grid item sx={{ width: '100%' }}>
        <Controller
          name='password'
          control={control}
          render={({ field: { ref, ...rest } }) => (
            <PasswordField
              error={!!errors.password}
              fullWidth
              helperText={errors.password ? errors.password.message : ''}
              id='password'
              label='Password'
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
          Register
        </Button>
      </Grid>
    </Grid>
  )

  if (variant === 'dialog') {
    return (
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <DialogContent>{templateContent}</DialogContent>
        <DialogActions>{templateActions}</DialogActions>
      </form>
    )
  } else {
    return (
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <CardContent>{templateContent}</CardContent>
        <CardActions>{templateActions}</CardActions>
      </form>
    )
  }
}

export default AccessRegister
