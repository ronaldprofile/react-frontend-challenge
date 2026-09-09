import { QueryClientProvider } from '@tanstack/react-query'
import { type PropsWithChildren, useEffect } from 'react'

import { queryClient } from '@/app/queryClient'
import { initTheme } from '@/features/theme/store/themeStore'

export function AppProvider({ children }: PropsWithChildren) {
  useEffect(() => {
    initTheme()
  }, [])

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}