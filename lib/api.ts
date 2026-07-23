// API client for the LexBénin FastAPI backend.
// Base URL is configurable via NEXT_PUBLIC_API_URL (Next.js equivalent of VITE_API_URL).
export const API_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '') || 'http://localhost:8000'

export const TOKEN_KEY = 'lexbenin-token'

// ---- Types matching the API contract ----

export type Pays = {
  code: string
  label: string
  domaine: string
  domaine_label: string
  statut: string
}

export type Source = {
  numero_article: string
  titre: string
  livre: string
  source_url: string
  extrait: string
}

export type AskResponse = {
  reponse: string
  sources: Source[]
}

export type User = {
  id: string
  email: string
  type_compte: 'individu' | 'institution'
  nom: string | null
  prenom: string | null
  nom_institution: string | null
  secteur_activite: string | null
  nombre_employes: number | null
}

export type AuthResponse = {
  access_token: string
  token_type: string
  user: User
}

export class ApiError extends Error {
  status: number
  constructor(status: number, message: string) {
    super(message)
    this.status = status
    this.name = 'ApiError'
  }
}

// ---- Token helpers ----

export function getToken(): string | null {
  if (typeof window === 'undefined') return null
  return window.localStorage.getItem(TOKEN_KEY)
}

export function setToken(token: string) {
  window.localStorage.setItem(TOKEN_KEY, token)
}

export function clearToken() {
  window.localStorage.removeItem(TOKEN_KEY)
}

async function parseError(res: Response): Promise<never> {
  let message = `Erreur ${res.status}`
  try {
    const data = await res.json()
    if (typeof data?.detail === 'string') message = data.detail
    else if (Array.isArray(data?.detail) && data.detail[0]?.msg)
      message = data.detail[0].msg
  } catch {
    // ignore parse failures, keep default message
  }
  throw new ApiError(res.status, message)
}

// ---- Endpoints ----

export async function checkHealth(): Promise<boolean> {
  try {
    const res = await fetch(`${API_URL}/health`, { cache: 'no-store' })
    if (!res.ok) return false
    const data = await res.json()
    return data?.status === 'ok'
  } catch {
    return false
  }
}

export async function getPays(): Promise<Pays[]> {
  const res = await fetch(`${API_URL}/pays`, { cache: 'no-store' })
  if (!res.ok) await parseError(res)
  return res.json()
}

export async function ask(
  pays: string,
  question: string,
  topK = 5,
): Promise<AskResponse> {
  const res = await fetch(`${API_URL}/ask`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ pays, question, top_k: topK }),
  })
  if (!res.ok) await parseError(res)
  return res.json()
}

type RegisterPayload =
  | {
      email: string
      password: string
      type_compte: 'individu'
      nom: string
      prenom: string
    }
  | {
      email: string
      password: string
      type_compte: 'institution'
      nom_institution: string
      secteur_activite: string
      nombre_employes: number
    }

export async function register(payload: RegisterPayload): Promise<AuthResponse> {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!res.ok) await parseError(res)
  return res.json()
}

export async function login(
  email: string,
  password: string,
): Promise<AuthResponse> {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
  if (!res.ok) await parseError(res)
  return res.json()
}

export async function getMe(token: string): Promise<User> {
  const res = await fetch(`${API_URL}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
  })
  if (!res.ok) await parseError(res)
  return res.json()
}
