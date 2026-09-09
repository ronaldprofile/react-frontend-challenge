import { describe, expect, it } from 'vitest'

import { loginSchema } from './login'

describe('loginSchema', () => {
  it('aceita credenciais válidas', () => {
    const result = loginSchema.safeParse({
      email: 'curador@cine.com',
      password: 'secret123',
    })
    expect(result.success).toBe(true)
  })

  it('rejeita e-mail inválido', () => {
    const result = loginSchema.safeParse({
      email: 'nao-e-um-email',
      password: 'secret123',
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toContain('válido')
    }
  })

  it('rejeita e-mail vazio', () => {
    const result = loginSchema.safeParse({
      email: '',
      password: 'secret123',
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toContain('obrigatório')
    }
  })

  it('rejeita senha menor ou igual a 6 caracteres', () => {
    const short = loginSchema.safeParse({
      email: 'curador@cine.com',
      password: '12345',
    })
    const boundary = loginSchema.safeParse({
      email: 'curador@cine.com',
      password: '123456',
    })

    expect(short.success).toBe(false)
    expect(boundary.success).toBe(false)
  })

  it('rejeita senha vazia', () => {
    const result = loginSchema.safeParse({
      email: 'curador@cine.com',
      password: '',
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toContain('obrigatória')
    }
  })
})