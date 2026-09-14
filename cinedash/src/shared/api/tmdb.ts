import axios, { AxiosError } from 'axios'

import { CONFIG } from '@/shared/config/env'
import type {
  CastMember,
  GenreList,
  MovieDetails,
  MovieResult,
  Video,
} from '@/entities/movie/types'

export interface DiscoverParams {
  page?: number
  query?: string
  with_genres?: string
  primary_release_year?: number
  'vote_average.gte'?: number
  sort_by?: string
}

function buildParams(filters: DiscoverParams): Record<string, string | number> {
  return Object.fromEntries(
    Object.entries(filters).filter(([, value]) => {
      if (value === undefined || value === null) return false
      if (typeof value === 'string' && value.trim() === '') return false
      return true
    }),
  )
}

export const tmdbClient = axios.create({
  baseURL: CONFIG.api.baseUrl,
  params: {
    api_key: CONFIG.api.apiKey,
    language: 'pt-BR',
  },
  timeout: 15000,
})

tmdbClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    return Promise.reject(error)
  },
)

export const tmdbApi = {
  async discover(filters: DiscoverParams = {}): Promise<MovieResult> {
    const { data } = await tmdbClient.get<MovieResult>('/discover/movie', {
      params: buildParams(filters),
    })
    return data
  },

  async search(query: string, page = 1): Promise<MovieResult> {
    const { data } = await tmdbClient.get<MovieResult>('/search/movie', {
      params: {
        query,
        page,
        include_adult: false,
      },
    })
    return data
  },

  async trending(timeWindow: 'day' | 'week' = 'day', page = 1): Promise<MovieResult> {
    const { data } = await tmdbClient.get<MovieResult>(
      `/trending/movie/${timeWindow}`,
      { params: { page } },
    )
    return data
  },

  async popular(page = 1): Promise<MovieResult> {
    const { data } = await tmdbClient.get<MovieResult>('/movie/popular', {
      params: { page },
    })
    return data
  },

  async movieDetails(movieId: number): Promise<MovieDetails> {
    const { data } = await tmdbClient.get<MovieDetails>(`/movie/${movieId}`)
    return data
  },

  async movieCredits(
    movieId: number,
  ): Promise<{ cast: CastMember[] }> {
    const { data } = await tmdbClient.get<{ cast: CastMember[] }>(
      `/movie/${movieId}/credits`,
    )
    return data
  },

  async movieVideos(movieId: number): Promise<{ results: Video[] }> {
    const { data } = await tmdbClient.get<{ results: Video[] }>(
      `/movie/${movieId}/videos`,
    )
    return data
  },

  async genres(): Promise<GenreList> {
    const { data } = await tmdbClient.get<GenreList>('/genre/movie/list')
    return data
  },
}

export function imageUrl(
  path: string | null,
  size: 'w92' | 'w154' | 'w185' | 'w342' | 'w500' | 'w780' | 'original' = 'w500',
): string | null {
  if (!path) return null
  return `${CONFIG.api.imageBaseUrl}/${size}${path}`
}