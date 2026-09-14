import { createRootRouteWithContext, Outlet } from '@tanstack/react-router'
import type { QueryClient } from '@tanstack/react-query'

import { AppProvider } from '@/app/providers'
import { ErrorBoundary } from '@/shared/ui/error-boundary'
import { Toaster } from '@/shared/ui/sonner'

export interface RouterContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: () => (
    <ErrorBoundary>
      <AppProvider>
        <Outlet />
        <Toaster />
      </AppProvider>
    </ErrorBoundary>
  ),
})
