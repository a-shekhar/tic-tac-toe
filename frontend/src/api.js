const API = '/api'

async function http(method, url, body) {
  const res = await fetch(API + url, {
    method,
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined
  })
  const json = await res.json().catch(() => ({}))
  if (!res.ok || json.success === false) {
    const msg = json?.message || `HTTP ${res.status}`
    throw new Error(msg)
  }
  return json
}

export async function createGame() {
  return http('POST', '/games')
}

export async function getGame(id) {
  return http('GET', `/games/${id}`)
}

export async function postMove(id, row, col) {
  return http('POST', `/games/${id}/move`, { row, col })
}

export async function cpuMove(id) {
  return http('POST', `/games/${id}/cpu-move`)
}

export async function resetGame(id) {
  return http('POST', `/games/${id}/reset`)
}
