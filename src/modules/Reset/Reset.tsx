import { yupResolver } from '@hookform/resolvers/yup'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useSnackbar } from 'notistack'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import * as yup from 'yup'

import logo from '../../assets/logo.svg'
import { reset } from '../../services/api/auth'
import CustomError from '../../types/CustomError'

interface Form {
  email: string
}

const defaultValues = {
  email: ''
}

const schema = yup.object({
  email: yup
    .string()
    .required('Email is required')
    .email('Email must be valid')
})

function Reset () {
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
    try {
      await reset(data)

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

      enqueueSnackbar(
        'A verification link has been to sent to the address provided',
        {
          action,
          persist: true,
          variant: 'info'
        }
      )

      router.push('/access')
    } catch (error) {
      enqueueSnackbar(`${(error as CustomError).message}`, {
        autoHideDuration: 3000,
        variant: 'error'
      })
    }
  }

  const cardContent = (
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
    </Grid>
  )

  const cardActions = (
    <Grid
      container
      alignItems='center'
      direction='column'
      justifyContent='center'
      spacing={2}
    >
      <Grid item>
        <Button color='primary' type='submit' variant='contained'>
          Reset
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
            justifyContent: 'center',
            px: 2
          }}
        >
          <Image src={logo} alt='Stet Solutions' width={250} />
        </Box>
        <Typography
          align='center'
          component='div'
          gutterBottom
          variant='h6'
          sx={{ my: 2 }}
        >
          Reset Password
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <CardContent>{cardContent}</CardContent>
          <CardActions>{cardActions}</CardActions>
        </form>
      </Card>
    </Box>
  )
}

export default Reset
