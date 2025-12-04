import api from './api.js'

export async function listModels() {
  const res = await api.get('/analysis/models')
  return res.data.providers || []
}

export async function analyzeRag(payload) {
  const res = await api.post('/analysis/analyze_rag', payload)
  return res.data
}

export async function getStatus(requestId) {
  const res = await api.get(`/analysis/status/${requestId}`)
  return res.data
}
