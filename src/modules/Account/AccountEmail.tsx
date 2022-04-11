import { yupResolver } from '@hookform/resolvers/yup'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'
import Cookies from 'js-cookie'
import { useRouter } from 'next/router'
import { useSnackbar } from 'notistack'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import * as yup from 'yup'

import PasswordField from '../../components/PasswordField'
import { useUserContext } from '../../contexts/User'
import { updateEmail } from '../../services/api/users'
import CustomError from '../../types/CustomError'

interface Form {
  currentEmail: string
  id: number
  newEmail: string
  password: string
}

function AccountEmail () {
  const router = useRouter()
  const { closeSnackbar, enqueueSnackbar } = useSnackbar()
  const { user, setUser } = useUserContext()

  const defaultValues = {
    currentEmail: user.email ? user.email : '',
    newEmail: '',
    password: ''
  }

  const schema = yup.object({
    currentEmail: yup
      .string()
      .required('Current email address is required')
      .email('Current email address must be valid'),
    newEmail: yup
      .string()
      .required('New email address is required')
      .email('New email address must be valid')
      .notOneOf(
        [yup.ref('currentEmail')],
        'New email must not match current email'
      ),
    password: yup.string().required('Password is required')
  })

  const {
    control,
    formState: { errors },
    handleSubmit,
    reset
  } = useForm<Form>({
    defaultValues,
    resolver: yupResolver(schema)
  })

  const onSubmit: SubmitHandler<Form> = async data => {
    try {
      if (user.id) data.id = user.id

      await updateEmail(data)

      reset(defaultValues)

      localStorage.removeItem('user')
      Cookies.remove('ss-id')
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
      enqueueSnackbar(`${(error as CustomError).message}`, {
        autoHideDuration: 3000,
        variant: 'error'
      })
    }
  }

  const cardContent = (
    <CardContent>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6} lg={3}>
          <Controller
            name='currentEmail'
            control={control}
            rules={{
              required: true,
              pattern: {
                value: /\S+@\S+\.\S+/,
                message: 'Entered value does not match email format'
              }
            }}
            render={({ field }) => (
              <TextField
                error={!!errors.currentEmail}
                fullWidth
                helperText={
                  errors.currentEmail ? errors.currentEmail.message : ''
                }
                id='current-email'
                label='Current Email'
                type='email'
                variant='outlined'
                {...field}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} md={6} lg={3}>
          <Controller
            name='newEmail'
            control={control}
            rules={{
              required: true,
              pattern: {
                value: /\S+@\S+\.\S+/,
                message: 'Entered value does not match email format'
              }
            }}
            render={({ field }) => (
              <TextField
                error={!!errors.newEmail}
                fullWidth
                helperText={errors.newEmail ? errors.newEmail.message : ''}
                id='new-email'
                label='New Email'
                type='email'
                variant='outlined'
                {...field}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} md={6} lg={3}>
          <Controller
            name='password'
            control={control}
            rules={{ required: true }}
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

export default AccountEmail
