import { useWatchlistStore } from '@/features/watchlist/store/watchlistStore'
import { WatchlistTable } from '@/features/watchlist/ui/WatchlistTable'

export function WatchlistPage() {
  const count = useWatchlistStore((state) => state.movies.length)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Minha Lista</h1>
        <p className="text-sm text-muted-foreground">
          {count > 0
            ? `${count} ${count === 1 ? 'filme' : 'filmes'} na sua curadoria`
            : 'Gerencie os filmes selecionados para o catálogo'}
        </p>
      </div>

      <WatchlistTable />
    </div>
  )
}