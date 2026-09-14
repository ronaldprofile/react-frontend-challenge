import { Clapperboard } from 'lucide-react'

import type { Movie } from '@/entities/movie/types'
import { MovieCard } from '@/features/discover/ui/MovieCard'
import { Skeleton } from '@/shared/ui/skeleton'

interface MovieGridProps {
  movies: Movie[] | undefined
  isLoading: boolean
  isError: boolean
}

export function MovieGrid({ movies, isLoading, isError }: MovieGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {Array.from({ length: 10 }).map((_, index) => (
          <div key={index} className="space-y-2">
            <Skeleton className="aspect-[2/3] w-full rounded-lg" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        ))}
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed py-16 text-center">
        <Clapperboard className="size-10 text-muted-foreground" />
        <p className="text-lg font-medium">Não foi possível carregar os filmes</p>
        <p className="max-w-md text-sm text-muted-foreground">
          Verifique se a chave da API TMDB está configurada (VITE_TMDB_API_KEY) e tente novamente.
        </p>
      </div>
    )
  }

  if (!movies || movies.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed py-16 text-center">
        <Clapperboard className="size-10 text-muted-foreground" />
        <p className="text-lg font-medium">Nenhum filme encontrado</p>
        <p className="max-w-md text-sm text-muted-foreground">
          Ajuste a busca ou os filtros para encontrar filmes.
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      {movies.map((movie) => (
        <MovieCard key={movie.id} movie={movie} />
      ))}
    </div>
  )
}