import config from '../../config'

interface Change {
  newPassword: string
  confirmPassword: string
}

interface Access {
  email: string
  password: string
}

interface Reset {
  email: string
}

const change = async (userId: string | string[] | undefined, data: Change, token: string | string[] | undefined) => {
  const body = {
    confirm_password: data.confirmPassword,
    new_password: data.newPassword
  }
  const url = `${config.apiUrl}api/v1/auth?userId=${userId}&token=${token}`

  const response = await fetch(url, {
    method: 'PATCH',
    credentials: 'include',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  })

  if (!response.ok) {
    throw await response.json()
  }
}

const register = async (data: Access) => {
  const body = {
    email: data.email,
    password: data.password
  }
  const url = `${config.apiUrl}api/v1/auth`

  const response = await fetch(url, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  })

  if (!response.ok) {
    throw await response.json()
  }
}

const resend = async (email: string) => {
  const body = {
    email: email
  }
  const url = `${config.apiUrl}api/v1/auth/resend`

  const response = await fetch(url, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  })

  if (!response.ok) {
    throw await response.json()
  }
}

const reset = async (data: Reset) => {
  const body = {
    email: data.email
  }
  const url = `${config.apiUrl}api/v1/auth/reset`

  const response = await fetch(url, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  })

  if (!response.ok) {
    throw await response.json()
  }
}

const signIn = async (data: Access) => {
  const body = {
    username: data.email,
    password: data.password
  }
  const url = `${config.apiUrl}api/v1/auth/sign-in`

  const response = await fetch(url, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  })

  if (!response.ok) {
    throw Error
  }

  return response.json()
}

const verify = async (userId: string, token: string) => {
  const url = `${config.apiUrl}api/v1/auth?userId=${userId}&token=${token}`

  const response = await fetch(url, {
    method: 'DELETE',
    credentials: 'include'
  })

  if (!response.ok) {
    throw await response.json()
  }
}

export { change, register, resend, reset, signIn, verify }
