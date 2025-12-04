import axios from 'axios'

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

export const api = axios.create({ baseURL })

api.interceptors.request.use((config) => {
  const t = localStorage.getItem('token')
  if (t) config.headers['Authorization'] = `Bearer ${t}`
  return config
})

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const msg = err?.response?.data?.detail || err.message
    alert(`Error: ${msg}`)
    throw err
  }
)

export default api
