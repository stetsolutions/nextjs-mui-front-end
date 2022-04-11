import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import PasswordField from '..'

test('PasswordField :: renders component', () => {
  render(<PasswordField></PasswordField>)
})

test('PasswordField :: shows password when visibility toggled', async () => {
  render(<PasswordField id='password' label='Password'></PasswordField>)

  const password = screen.getByLabelText('Password') as HTMLInputElement
  fireEvent.change(password, { target: { value: 'foobarbazqux' } })

  expect(password.type).toBe('password')

  fireEvent.click(
    screen.getByRole('button', { name: /toggle password visibility/i })
  )

  expect(password.type).toBe('text')
})
