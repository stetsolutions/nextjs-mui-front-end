import { yupResolver } from '@hookform/resolvers/yup'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'
import { useSnackbar } from 'notistack'
import { useEffect, useState } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import * as yup from 'yup'

import { useUserContext } from '../../contexts/User'
import { updateProfile } from '../../services/api/users'
import CustomError from '../../types/CustomError'

interface Form {
  firstName: string
  id: number
  lastName: string
  username: string
}

function AccountProfile () {
  const { enqueueSnackbar } = useSnackbar()
  const { user, setUser } = useUserContext()

  const defaultValues = {
    firstName: '',
    lastName: '',
    username: ''
  }

  const schema = yup.object({
    firstName: yup.string().required('First name is required'),
    lastName: yup.string().required('Last name is required'),
    username: yup.string().required('Username is required')
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

  useEffect(() => {
    const values = {
      firstName: user.first_name ? user.first_name : '',
      lastName: user.last_name ? user.last_name : '',
      username: user.username ? user.username : ''
    }

    reset(values)
  }, [])

  const onSubmit: SubmitHandler<Form> = async data => {
    try {
      if (user.id) data.id = user.id

      const result = await updateProfile(data)

      localStorage.setItem('user', JSON.stringify(result))

      setUser(result)

      enqueueSnackbar('Profile updated', {
        autoHideDuration: 3000,
        variant: 'success'
      })
    } catch (error) {
      if ((error as CustomError).statusCode === 409) {
        setError('username', {
          type: 'manual',
          message: 'Username unavailable'
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
      <Grid container spacing={2}>
        <Grid item xs={12} md={6} lg={3}>
          <Controller
            name='firstName'
            control={control}
            render={({ field }) => (
              <TextField
                error={!!errors.firstName}
                fullWidth
                helperText={errors.firstName ? errors.firstName.message : ''}
                id='first-name'
                label='First name'
                variant='outlined'
                {...field}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} md={6} lg={3}>
          <Controller
            name='lastName'
            control={control}
            render={({ field }) => (
              <TextField
                error={!!errors.lastName}
                fullWidth
                helperText={errors.lastName ? errors.lastName.message : ''}
                id='last-name'
                label='Last name'
                variant='outlined'
                {...field}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} md={6} lg={3}>
          <Controller
            name='username'
            control={control}
            render={({ field }) => (
              <TextField
                error={!!errors.username}
                fullWidth
                helperText={errors.username ? errors.username.message : ''}
                id='username'
                label='Username'
                variant='outlined'
                {...field}
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

export default AccountProfile
