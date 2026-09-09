import { useDiscoverStore } from '@/features/discover/store/discoverStore'
import { DiscoverFilters } from '@/features/discover/ui/DiscoverFilters'
import { DiscoverSearch } from '@/features/discover/ui/DiscoverSearch'
import { MovieGrid } from '@/features/discover/ui/MovieGrid'
import { Pagination } from '@/features/discover/ui/Pagination'
import { useDiscoverMovies, useSearchMovies } from '@/entities/movie'

export function DashboardPage() {
  const query = useDiscoverStore((state) => state.query)
  const genreId = useDiscoverStore((state) => state.genreId)
  const year = useDiscoverStore((state) => state.year)
  const minRating = useDiscoverStore((state) => state.minRating)
  const page = useDiscoverStore((state) => state.page)
  const setPage = useDiscoverStore((state) => state.setPage)

  const isSearching = query.trim().length > 0

  const searchQuery = useSearchMovies(query, page)
  const discoverQuery = useDiscoverMovies({
    page,
    with_genres: genreId || undefined,
    primary_release_year: year ? Number(year) : undefined,
    'vote_average.gte': minRating || undefined,
  })

  const { data, isLoading, isError } = isSearching ? searchQuery : discoverQuery

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            {isSearching ? 'Resultados da busca' : 'Descobrir filmes'}
          </h1>
          <p className="text-sm text-muted-foreground">
            {isSearching && query ? `Resultados para "${query}"` : 'Filmes em destaque do catálogo'}
          </p>
        </div>
        <DiscoverSearch />
      </div>

      <DiscoverFilters />

      <MovieGrid
        movies={data?.results}
        isLoading={isLoading}
        isError={isError}
      />

      <Pagination
        page={page}
        totalPages={data?.total_pages ?? 0}
        onPageChange={setPage}
      />
    </div>
  )
}