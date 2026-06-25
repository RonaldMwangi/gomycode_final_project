const TOKEN_KEY = 'tm_token'
const USER_KEY = 'tm_user'

export function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function setSession(token: string, user: unknown) {
  localStorage.setItem(TOKEN_KEY, token)
  localStorage.setItem(USER_KEY, JSON.stringify(user))
}

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
}

export function getUser<T = any>(): T | null {
  const raw = localStorage.getItem(USER_KEY)
  if (!raw) return null
  return JSON.parse(raw) as T
}

