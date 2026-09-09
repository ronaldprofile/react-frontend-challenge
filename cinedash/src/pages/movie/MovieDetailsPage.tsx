import { Link, useParams } from '@tanstack/react-router'
import { ArrowLeft, Heart, Star } from 'lucide-react'
import { toast } from 'sonner'

import {
  selectTrailer,
  useMovieCredits,
  useMovieDetails,
  useMovieVideos,
} from '@/entities/movie'
import { useWatchlistStore } from '@/features/watchlist/store/watchlistStore'
import { imageUrl } from '@/shared/api/tmdb'
import { Button } from '@/shared/ui/button'
import { Skeleton } from '@/shared/ui/skeleton'
import { Badge } from '@/shared/ui/badge'

export function MovieDetailsPage() {
  const { id } = useParams({ from: '/_protected/movie/$id' })
  const movieId = Number(id)

  const { data: movie, isLoading, isError } = useMovieDetails(movieId)
  const { data: credits } = useMovieCredits(movieId)
  const { data: videos } = useMovieVideos(movieId)

  const addMovie = useWatchlistStore((state) => state.addMovie)
  const removeMovie = useWatchlistStore((state) => state.removeMovie)
  const isInWatchlist = useWatchlistStore((state) => state.movies.some((m) => m.id === movieId))

  if (isLoading) {
    return <MovieDetailsSkeleton />
  }

  if (isError || !movie) {
    return (
      <div className="flex flex-col items-center gap-3 py-16 text-center">
        <p className="text-lg font-medium">Não foi possível carregar o filme</p>
        <Button variant="outline" asChild>
          <Link to="/dashboard">
            <ArrowLeft className="size-4" />
            Voltar ao dashboard
          </Link>
        </Button>
      </div>
    )
  }

  const details = movie

  const trailer = selectTrailer(videos)
  const cast = credits?.cast ?? []
  const year = details.release_date?.slice(0, 4)
  const backdrop = imageUrl(details.backdrop_path, 'original')
  const poster = imageUrl(details.poster_path, 'w342')

  function toggleWatchlist() {
    if (isInWatchlist) {
      removeMovie(details.id)
      toast.info(`${details.title} removido da sua lista`)
    } else {
      addMovie({
        id: details.id,
        title: details.title,
        overview: details.overview,
        poster_path: details.poster_path,
        backdrop_path: details.backdrop_path,
        release_date: details.release_date,
        vote_average: details.vote_average,
        vote_count: details.vote_count,
        genre_ids: details.genres.map((genre) => genre.id),
      })
      toast.success(`${details.title} adicionado à sua lista`)
    }
  }

  return (
    <div className="space-y-8">
      <Button variant="ghost" size="sm" asChild className="-ml-3">
        <Link to="/dashboard">
          <ArrowLeft className="size-4" />
          Voltar
        </Link>
      </Button>

      <div className="relative overflow-hidden rounded-xl border">
        {backdrop && (
          <div
            className="absolute inset-0 bg-cover bg-center opacity-30"
            style={{ backgroundImage: `url(${backdrop})` }}
            aria-hidden
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
        <div className="relative flex flex-col gap-6 p-6 md:flex-row md:p-10">
          {poster && (
            <img
              src={poster}
              alt={details.title}
              className="mx-auto w-48 shrink-0 rounded-lg shadow-lg md:mx-0 md:w-64"
            />
          )}
          <div className="flex flex-1 flex-col gap-3">
            <h1 className="text-3xl font-semibold tracking-tight">
              {details.title}
              {year && <span className="text-muted-foreground"> ({year})</span>}
            </h1>
            {details.tagline && (
              <p className="italic text-muted-foreground">{details.tagline}</p>
            )}
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary" className="gap-1">
                <Star className="size-3.5 fill-amber-400 text-amber-400" />
                {details.vote_average.toFixed(1)}
              </Badge>
              {details.genres.map((genre) => (
                <Badge key={genre.id} variant="outline">
                  {genre.name}
                </Badge>
              ))}
              {details.runtime && (
                <span className="text-sm text-muted-foreground">
                  {details.runtime} min
                </span>
              )}
            </div>
            <p className="max-w-prose text-sm leading-relaxed text-muted-foreground md:text-base">
              {details.overview || 'Sem sinopse disponível.'}
            </p>
            <div className="mt-2">
              <Button onClick={toggleWatchlist} variant={isInWatchlist ? 'secondary' : 'default'}>
                <Heart className={isInWatchlist ? 'fill-current' : ''} />
                {isInWatchlist ? 'Remover da minha lista' : 'Adicionar à minha lista'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {trailer && (
        <section className="space-y-3">
          <h2 className="text-xl font-semibold tracking-tight">Trailer</h2>
          <div className="relative aspect-video w-full max-w-3xl overflow-hidden rounded-lg border">
            <iframe
              src={`https://www.youtube.com/embed/${trailer.key}`}
              title={trailer.name}
              className="absolute inset-0 h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </section>
      )}

      {cast.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-xl font-semibold tracking-tight">Elenco</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {cast.slice(0, 12).map((member) => (
              <div
                key={member.id}
                className="flex flex-col items-center gap-2 rounded-lg border p-3 text-center"
              >
                {member.profile_path ? (
                  <img
                    src={imageUrl(member.profile_path, 'w185') ?? ''}
                    alt={member.name}
                    loading="lazy"
                    className="aspect-[2/3] w-full rounded-md object-cover"
                  />
                ) : (
                  <div className="flex aspect-[2/3] w-full items-center justify-center rounded-md bg-muted text-2xl text-muted-foreground">
                    ?
                  </div>
                )}
                <div>
                  <p className="line-clamp-1 text-sm font-medium">{member.name}</p>
                  <p className="line-clamp-1 text-xs text-muted-foreground">
                    {member.character}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

function MovieDetailsSkeleton() {
  return (
    <div className="space-y-8">
      <Skeleton className="h-8 w-24" />
      <div className="flex flex-col gap-6 md:flex-row">
        <Skeleton className="mx-auto aspect-[2/3] w-48 rounded-lg md:mx-0 md:w-64" />
        <div className="flex flex-1 flex-col gap-3">
          <Skeleton className="h-9 w-2/3" />
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="mt-4 h-9 w-48" />
        </div>
      </div>
    </div>
  )
}