import { persist } from 'zustand/middleware'
import { create } from 'zustand'

import type { Movie } from '@/entities/movie/types'

export const WATCHLIST_STORAGE_KEY = 'cinedash.watchlist'

export interface WatchlistState {
  movies: Movie[]
  addMovie: (movie: Movie) => void
  removeMovie: (movieId: number) => void
  isInWatchlist: (movieId: number) => boolean
}

export const useWatchlistStore = create<WatchlistState>()(
  persist(
    (set, get) => ({
      movies: [],
      addMovie: (movie) =>
        set((state) => {
          if (state.movies.some((m) => m.id === movie.id)) return state
          return { movies: [movie, ...state.movies] }
        }),
      removeMovie: (movieId) =>
        set((state) => ({
          movies: state.movies.filter((m) => m.id !== movieId),
        })),
      isInWatchlist: (movieId) =>
        get().movies.some((movie) => movie.id === movieId),
    }),
    {
      name: WATCHLIST_STORAGE_KEY,
    },
  ),
)