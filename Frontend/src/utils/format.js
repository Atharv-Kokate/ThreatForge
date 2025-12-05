const bulletRegex = /^[\-\*\u2022]\s*/ // -, *, •

export function cleanText(text = '') {
  if (!text) return ''
  let t = text
  t = t.replace(/\r/g, '')
  t = t.replace(/\*\*/g, '') // remove bold markers
  t = t.replace(/\*/g, '')
  t = t.replace(/\n{3,}/g, '\n\n')
  t = t.trim()
  return t
}

export function toBulletList(text = '') {
  if (!text) return []
  return cleanText(text)
    .split('\n')
    .map(line => line.trim())
    .filter(Boolean)
    .map(line => line.replace(bulletRegex, ''))
}

export function formatConfidence(value) {
  if (value === undefined || value === null || Number.isNaN(value)) return '—'
  const num = Number(value)
  if (num <= 1) return `${Math.round(num * 100)}%`
  return `${Math.round(num)}%`
}


