import { beforeEach, describe, expect, it } from 'vitest'

import { useAuthStore } from './authStore'

describe('authStore', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('starts logged out', () => {
    expect(useAuthStore.getState().user).toBeNull()
    expect(useAuthStore.getState().token).toBeNull()
  })

  it('login generates a fake user and token', () => {
    useAuthStore.getState().login('curador@cine.com')

    const state = useAuthStore.getState()
    expect(state.user).toEqual({ email: 'curador@cine.com' })
    expect(state.token).toMatch(/^cinedash\./)
  })

  it('logout clears user and token', () => {
    useAuthStore.getState().login('curador@cine.com')
    useAuthStore.getState().logout()

    const state = useAuthStore.getState()
    expect(state.user).toBeNull()
    expect(state.token).toBeNull()
  })

  it('persists the session on localStorage', () => {
    useAuthStore.getState().login('curador@cine.com')

    const stored = JSON.parse(localStorage.getItem('cinedash.auth') ?? '{}')
    expect(stored.state.token).toMatch(/^cinedash\./)
    expect(stored.state.user).toEqual({ email: 'curador@cine.com' })
  })
})