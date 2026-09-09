import { persist } from 'zustand/middleware'
import { create } from 'zustand'

export const DISCOVER_STORAGE_KEY = 'cinedash.discover-filters'

export interface DiscoverState {
  query: string
  genreId: string
  year: string
  minRating: number
  page: number
  setQuery: (query: string) => void
  setGenreId: (genreId: string) => void
  setYear: (year: string) => void
  setMinRating: (minRating: number) => void
  setPage: (page: number) => void
  reset: () => void
}

const initialState = {
  query: '',
  genreId: '',
  year: '',
  minRating: 0,
  page: 1,
}

export const useDiscoverStore = create<DiscoverState>()(
  persist(
    (set) => ({
      ...initialState,
      setQuery: (query) => set({ query, page: 1 }),
      setGenreId: (genreId) => set({ genreId, page: 1 }),
      setYear: (year) => set({ year, page: 1 }),
      setMinRating: (minRating) => set({ minRating, page: 1 }),
      setPage: (page) => set({ page }),
      reset: () => set(initialState),
    }),
    {
      name: DISCOVER_STORAGE_KEY,
    },
  ),
)