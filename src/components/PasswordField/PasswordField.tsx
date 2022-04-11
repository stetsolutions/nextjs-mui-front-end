import { useState } from 'react'

import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'

import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import InputLabel from '@mui/material/InputLabel'
import OutlinedInput from '@mui/material/OutlinedInput'

interface Props {
  error?: boolean
  fullWidth?: boolean
  helperText?: string | undefined
  id?: string
  label?: string
}

function PasswordField (props: Props) {
  const {
    error = false,
    fullWidth = false,
    helperText,
    id,
    label,
    ...field
  } = props

  const [showPassword, setShowPassword] = useState(false)

  const handleIconButtonClick = () =>
    setShowPassword(showPassword => !showPassword)

  return (
    <FormControl fullWidth={fullWidth}>
      <InputLabel htmlFor={id}>{label}</InputLabel>
      <OutlinedInput
        endAdornment={
          <InputAdornment position='end'>
            <IconButton
              aria-label='toggle password visibility'
              onClick={handleIconButtonClick}
              edge='end'
            >
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        }
        error={!!error}
        id={id}
        label={label}
        type={showPassword ? 'text' : 'password'}
        role='textbox'
        {...field}
      />
      {helperText && <FormHelperText error>{helperText}</FormHelperText>}
    </FormControl>
  )
}

export default PasswordField
