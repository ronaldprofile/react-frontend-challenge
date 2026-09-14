import { createFileRoute, redirect } from '@tanstack/react-router'
import { z } from 'zod'

import { useAuthStore } from '@/features/auth/store/authStore'
import { LoginForm } from '@/features/auth/ui/LoginForm'

const loginSearchSchema = z.object({
  redirect: z.string().optional(),
})

export const Route = createFileRoute('/login')({
  validateSearch: loginSearchSchema,
  beforeLoad: () => {
    const { user } = useAuthStore.getState()
    if (user) {
      throw redirect({ to: '/dashboard' })
    }
  },
  component: LoginPage,
})

function LoginPage() {
  return <LoginForm />
}