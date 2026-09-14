import type { DiscoverParams } from '@/shared/api/tmdb'

export const discoverQueryKeys = {
  all: ['discover'] as const,
  lists: () => [...discoverQueryKeys.all, 'list'] as const,
  list: (params: DiscoverParams) => [...discoverQueryKeys.lists(), params] as const,
  genres: () => [...discoverQueryKeys.all, 'genres'] as const,
}

export const searchQueryKeys = {
  all: ['search'] as const,
  results: (query: string, page: number) => [...searchQueryKeys.all, query, page] as const,
}

export const trendingQueryKeys = {
  all: ['trending'] as const,
  list: (timeWindow: 'day' | 'week', page: number) =>
    [...trendingQueryKeys.all, timeWindow, page] as const,
}

export const movieQueryKeys = {
  all: ['movie'] as const,
  details: (movieId: number) => [...movieQueryKeys.all, String(movieId)] as const,
  credits: (movieId: number) => [...movieQueryKeys.details(movieId), 'credits'] as const,
  videos: (movieId: number) => [...movieQueryKeys.details(movieId), 'videos'] as const,
}