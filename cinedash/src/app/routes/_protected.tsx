import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'

import { useAuthStore } from '@/features/auth/store/authStore'
import { AppHeader } from '@/shared/ui/app-header'

export const Route = createFileRoute('/_protected')({
  beforeLoad: ({ location }) => {
    const { user } = useAuthStore.getState()
    if (!user) {
      throw redirect({
        to: '/login',
        search: { redirect: location.pathname },
      })
    }
  },
  component: ProtectedLayout,
})

function ProtectedLayout() {
  return (
    <div className="min-h-dvh flex flex-col">
      <AppHeader />
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 md:px-6">
        <Outlet />
      </main>
    </div>
  )
}