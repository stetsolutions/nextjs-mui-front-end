import config from '../../config'

interface Create {
  email: string | null
  firstName: string | null
  lastName: string | null
  role: string | null
  username: string | null
}

interface Update extends Create {
  id: number
}

interface UpdateEmail {
  currentEmail: string
  id: number
  newEmail: string
  password: string
}

interface UpdatePassword {
  currentPassword: string
  id: number
  newPassword: string
  confirmPassword: string
}

interface UpdateProfile {
  firstName: string
  id: number
  lastName: string
  username: string
}

const create = async (data: Create) => {
  const body = {
    email: data.email,
    first_name: data.firstName,
    last_name: data.lastName,
    role: data.role,
    username: data.username
  }
  const url = `${config.apiUrl}api/v1/users`

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

const read = async (limit: number, offset: number, orderBy: string) => {
  const url = `${config.apiUrl}api/v1/users?limit=${limit}&offset=${offset}&sort=${orderBy}`

  const response = await fetch(url, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    }
  })

  const json = await response.json()

  if (!response.ok) {
    throw json
  }

  return json
}

const remove = async (id: number) => {
  const url = `${config.apiUrl}api/v1/users/${id}`

  const response = await fetch(url, {
    method: 'DELETE',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    }
  })

  if (!response.ok) {
    throw await response.json()
  }
}

const update = async (data: Update) => {
  const body = {
    email: data.email,
    first_name: data.firstName,
    last_name: data.lastName,
    role: data.role,
    username: data.username
  }
  const url = `${config.apiUrl}api/v1/users/${data.id}`

  const response = await fetch(url, {
    method: 'PATCH',
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

const updateEmail = async (data: UpdateEmail) => {
  const body = {
    current_email: data.currentEmail,
    new_email: data.newEmail,
    password: data.password
  }
  const url = `${config.apiUrl}api/v1/users/${data.id}/email`

  const response = await fetch(url, {
    method: 'PATCH',
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

const updatePassword = async (data: UpdatePassword) => {
  const body = {
    current_password: data.currentPassword,
    new_password: data.newPassword,
    confirm_password: data.confirmPassword
  }
  const url = `${config.apiUrl}api/v1/users/${data.id}/password`

  const response = await fetch(url, {
    method: 'PATCH',
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

const updateProfile = async (data: UpdateProfile) => {
  const body = {
    first_name: data.firstName,
    last_name: data.lastName,
    username: data.username
  }
  const url = `${config.apiUrl}api/v1/users/${data.id}/profile`

  const response = await fetch(url, {
    method: 'PATCH',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  })

  const json = await response.json()

  if (!response.ok) {
    throw json
  }

  return json
}

export {
  create,
  read,
  remove,
  update,
  updateEmail,
  updatePassword,
  updateProfile
}
