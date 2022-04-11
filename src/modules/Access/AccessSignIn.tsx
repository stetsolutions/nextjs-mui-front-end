import { yupResolver } from '@hookform/resolvers/yup'
import Button from '@mui/material/Button'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'
import Cookies from 'js-cookie'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import { useSnackbar } from 'notistack'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import * as yup from 'yup'

import PasswordField from '../../components/PasswordField'
import { useUserContext } from '../../contexts/User'
import { signIn } from '../../services/api/auth'

interface Form {
  email: string
  password: string
}

interface Props {
  close?: () => void
  isOpen?: boolean
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
  password: yup.string().required('Password is required')
})

function AccessSignIn ({
  close = () => {},
  isOpen = false,
  variant = 'page'
}: Props) {
  const {
    control,
    formState: { errors },
    handleSubmit,
    setError
  } = useForm<Form>({
    defaultValues,
    resolver: yupResolver(schema)
  })
  
  const { setUser } = useUserContext()
  const router = useRouter()
  const { enqueueSnackbar } = useSnackbar()

  const handleForgotClick = () => {
    close()
  }

  const onSubmit: SubmitHandler<Form> = async data => {
    try {
      const result = await signIn(data)

      localStorage.setItem('user', JSON.stringify(result))
      setUser(result)

      close()

      if (variant === 'page') router.push('/')
    } catch (error) {
      setError('email', {
        type: 'manual'
      })

      setError('password', {
        type: 'manual'
      })

      enqueueSnackbar('Login failed: Invalid user ID or password', {
        autoHideDuration: 3000,
        variant: 'error'
      })

      localStorage.removeItem('user')
      Cookies.remove('ss-id')
      setUser({})
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
          Sign In
        </Button>
      </Grid>
      <Grid item>
        <NextLink href={'/reset'} passHref>
          <Button
            color='primary'
            onClick={handleForgotClick}
            style={{ textTransform: 'none' }}
          >
            Forgot password?
          </Button>
        </NextLink>
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
        <CardContent sx={{ px: 3 }}>{templateContent}</CardContent>
        <CardActions>{templateActions}</CardActions>
      </form>
    )
  }
}

export default AccessSignIn
