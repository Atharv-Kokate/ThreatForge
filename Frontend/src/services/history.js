import api from './api.js'

export async function getHistory({ skip = 0, limit = 50 } = {}) {
  const res = await api.get('/history', { params: { skip, limit } })
  return res.data
}
