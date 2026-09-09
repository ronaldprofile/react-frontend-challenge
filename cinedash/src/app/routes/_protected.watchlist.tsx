import { createFileRoute } from '@tanstack/react-router'

import { WatchlistPage } from '@/pages/watchlist/WatchlistPage'

export const Route = createFileRoute('/_protected/watchlist')({
  component: WatchlistPage,
})