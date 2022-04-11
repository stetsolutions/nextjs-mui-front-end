import { yupResolver } from '@hookform/resolvers/yup'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import FormControl from '@mui/material/FormControl'
import Grid from '@mui/material/Grid'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import TextField from '@mui/material/TextField'

import { useSnackbar } from 'notistack'
import { useEffect } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import * as yup from 'yup'

import { create, update } from '../../services/api/users'
import CustomError from '../../types/CustomError'

interface Form {
  email: string
  firstName: string
  lastName: string
  role: string
  username: string
}

interface Props {
  close: () => void
  row: Row
  fetch: () => void
  open: boolean
}

interface Row {
  email?: string
  first_name?: string
  id?: number
  last_name?: string
  role?: string
  username?: string
}

function UsersUpsert (props: Props) {
  const { close, row, fetch, open } = props

  const { enqueueSnackbar } = useSnackbar()

  const defaultValues: Form = {
    email: row.email ? row.email : '',
    firstName: row.first_name ? row.first_name : '',
    lastName: row.last_name ? row.last_name : '',
    role: row.role ? row.role : 'user',
    username: row.username ? row.username : ''
  }

  const schema = yup.object({
    email: yup
      .string()
      .required('Email address is required')
      .email('Email address must be valid'),
    role: yup.string().required('Role is required')
  })

  const {
    control,
    formState: { errors },
    handleSubmit,
    reset,
    setError,
    setValue
  } = useForm<Form>({
    defaultValues: defaultValues,
    resolver: yupResolver(schema)
  })

  useEffect(() => {
    reset(row)
    setValue('email', row.email ? row.email : '')
    setValue('firstName', row.first_name ? row.first_name : '')
    setValue('lastName', row.last_name ? row.last_name : '')
    setValue('role', row.role ? row.role : 'user')
    setValue('username', row.username ? row.username : '')
  }, [reset, row, setValue])

  const onSubmit: SubmitHandler<Form> = async data => {
    try {
      if (row.id) {
        const obj = {
          id: row.id,
          ...data
        }
        await update(obj)
      } else {
        await create(data)
      }

      close()
      fetch()

      const message = row.id ? 'edited' : 'added'

      enqueueSnackbar(`User ${message}`, {
        autoHideDuration: 3000,
        variant: 'success'
      })
    } catch (error) {
      if ((error as CustomError).statusCode === 409) {
        if ((error as CustomError).message === 'Email already exists') {
          setError('email', {
            type: 'manual',
            message: (error as CustomError).message
          })
        } else {
          setError('username', {
            type: 'manual',
            message: (error as CustomError).message
          })
        }
      } else {
        enqueueSnackbar(`${(error as CustomError).message}`, {
          autoHideDuration: 3000,
          variant: 'error'
        })
      }
    }
  }

  const dialogContent = (
    <DialogContent sx={{ p: 3 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Controller
            name='email'
            control={control}
            render={({ field }) => (
              <TextField
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
        <Grid item xs={12} sm={6}>
          <Controller
            name='firstName'
            control={control}
            render={({ field }) => (
              <TextField
                error={!!errors.firstName}
                fullWidth
                id='first-name'
                label='First name'
                variant='outlined'
                {...field}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Controller
            name='lastName'
            control={control}
            render={({ field }) => (
              <TextField
                error={!!errors.lastName}
                fullWidth
                id='last-name'
                label='Last name'
                variant='outlined'
                {...field}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Controller
            name='role'
            control={control}
            render={({ field }) => (
              <FormControl fullWidth>
                <InputLabel id='role-label'>Role</InputLabel>
                <Select
                  error={!!errors.role}
                  id='role'
                  label='Role'
                  labelId='role-label'
                  {...field}
                >
                  <MenuItem value={'admin'}>Admin</MenuItem>
                  <MenuItem value={'user'}>User</MenuItem>
                </Select>
              </FormControl>
            )}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
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
    </DialogContent>
  )

  const dialogActions = (
    <DialogActions sx={{ justifyContent: 'flex-end', pb: 3, px: 3 }}>
      <Button
        color='primary'
        type='reset'
        onClick={() => {
          close()
          reset(defaultValues)
        }}
        variant='outlined'
      >
        Cancel
      </Button>
      <Button color='primary' type='submit' variant='contained'>
        {row.id ? 'Edit' : 'Add'}
      </Button>
    </DialogActions>
  )

  return (
    <Dialog open={open} onClose={close}>
      <DialogTitle sx={{ pb: 1, pt: 3 }}>
        {row.id ? 'Edit' : 'Add'} User
      </DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        {dialogContent}
        {dialogActions}
      </form>
    </Dialog>
  )
}

export default UsersUpsert
