import api from './api.js'

export async function register({ email, username, password, full_name }) {
  const res = await api.post('/auth/register', { email, username, password, full_name })
  return res.data
}

export async function login(username, password) {
  const form = new URLSearchParams()
  form.append('username', username)
  form.append('password', password)
  const res = await api.post('/auth/login', form, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  })
  return res.data.access_token
}
