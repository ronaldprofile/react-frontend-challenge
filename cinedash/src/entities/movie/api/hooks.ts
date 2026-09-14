import { useQuery, keepPreviousData } from '@tanstack/react-query'

import type { CastMember, MovieDetails, Video } from '@/entities/movie/types'
import { tmdbApi, type DiscoverParams } from '@/shared/api/tmdb'
import {
  discoverQueryKeys,
  movieQueryKeys,
  searchQueryKeys,
  trendingQueryKeys,
} from '@/features/discover/api/queryKeys'

export function useGenres() {
  return useQuery({
    queryKey: discoverQueryKeys.genres(),
    queryFn: async () => (await tmdbApi.genres()).genres,
    staleTime: 60 * 60 * 1000,
  })
}

export function useDiscoverMovies(filters: DiscoverParams) {
  return useQuery({
    queryKey: discoverQueryKeys.list(filters),
    queryFn: () => tmdbApi.discover(filters),
    placeholderData: keepPreviousData,
  })
}

export function useTrendingMovies(timeWindow: 'day' | 'week', page: number) {
  return useQuery({
    queryKey: trendingQueryKeys.list(timeWindow, page),
    queryFn: () => tmdbApi.trending(timeWindow, page),
    placeholderData: keepPreviousData,
  })
}

export function useSearchMovies(query: string, page: number) {
  return useQuery({
    queryKey: searchQueryKeys.results(query, page),
    queryFn: () => tmdbApi.search(query, page),
    enabled: query.trim().length > 0,
    placeholderData: keepPreviousData,
  })
}

export function useMovieDetails(movieId: number) {
  return useQuery<MovieDetails>({
    queryKey: movieQueryKeys.details(movieId),
    queryFn: () => tmdbApi.movieDetails(movieId),
  })
}

export function useMovieCredits(movieId: number) {
  return useQuery<{ cast: CastMember[] }>({
    queryKey: movieQueryKeys.credits(movieId),
    queryFn: () => tmdbApi.movieCredits(movieId),
  })
}

export function useMovieVideos(movieId: number) {
  return useQuery<{ results: Video[] }>({
    queryKey: movieQueryKeys.videos(movieId),
    queryFn: () => tmdbApi.movieVideos(movieId),
  })
}

export function selectTrailer(videos?: { results: Video[] }): Video | undefined {
  return videos?.results.find(
    (video) => video.site === 'YouTube' && video.type === 'Trailer' && video.official,
  )
}