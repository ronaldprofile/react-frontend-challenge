import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useNavigate, useSearch } from '@tanstack/react-router'
import { Clapperboard } from 'lucide-react'
import { toast } from 'sonner'

import { loginSchema, type LoginInput } from '@/features/auth/schema/login'
import { useAuthStore } from '@/features/auth/store/authStore'
import { Button } from '@/shared/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/ui/form'
import { Input } from '@/shared/ui/input'

export function LoginForm() {
  const login = useAuthStore((state) => state.login)
  const navigate = useNavigate()
  const search = useSearch({ from: '/login' })

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  async function onSubmit(data: LoginInput) {
    login(data.email)
    toast.success('Login realizado com sucesso')
    navigate({ href: search.redirect ?? '/dashboard' })
  }

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-6 px-4">
      <div className="flex flex-col items-center gap-2">
        <Clapperboard className="size-10 text-primary" />
        <h1 className="text-2xl font-semibold tracking-tight">CineDash</h1>
        <p className="text-sm text-muted-foreground">
          Acesse o dashboard de curadoria de cinema
        </p>
      </div>

      <Form {...form}>
        <form
          noValidate
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full max-w-sm space-y-4 rounded-lg border bg-card p-6 shadow-sm"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>E-mail</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="voce@exemplo.com"
                    autoComplete="email"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Senha</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Digite sua senha"
                    autoComplete="current-password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
            Entrar
          </Button>
        </form>
      </Form>
    </div>
  )
}