const CLIENT_ID_KEY = 'happyfri-client-id'

function createClientId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  return `client-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
}

export function getOrCreateClientId(): string {
  try {
    const existing = localStorage.getItem(CLIENT_ID_KEY)
    if (existing?.trim()) return existing.trim()

    const nextId = createClientId()
    localStorage.setItem(CLIENT_ID_KEY, nextId)
    return nextId
  } catch {
    return createClientId()
  }
}
