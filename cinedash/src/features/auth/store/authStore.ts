import { persist } from 'zustand/middleware'
import { create } from 'zustand'

export const AUTH_STORAGE_KEY = 'cinedash.auth'

export interface AuthState {
  user: { email: string } | null
  token: string | null
  login: (email: string) => void
  logout: () => void
}

function generateToken(email: string): string {
  const payload = btoa(JSON.stringify({ email, exp: Date.now() + 7 * 24 * 60 * 60 * 1000 }))
  return `cinedash.${payload}`
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      login: (email) =>
        set({ user: { email }, token: generateToken(email) }),
      logout: () => set({ user: null, token: null }),
    }),
    {
      name: AUTH_STORAGE_KEY,
    },
  ),
)