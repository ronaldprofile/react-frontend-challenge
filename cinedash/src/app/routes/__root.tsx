import { createRootRouteWithContext, Outlet } from '@tanstack/react-router'
import type { QueryClient } from '@tanstack/react-query'

import { AppProvider } from '@/app/providers'
import { Toaster } from '@/shared/ui/sonner'

export interface RouterContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: () => (
    <AppProvider>
      <Outlet />
      <Toaster />
    </AppProvider>
  ),
})