import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { useWatchlistStore } from './watchlistStore'
import type { Movie } from '@/entities/movie/types'

const movie: Movie = {
  id: 1,
  title: 'Interestelar',
  overview: '',
  poster_path: '/x.jpg',
  backdrop_path: null,
  release_date: '2014-11-06',
  vote_average: 8.5,
  vote_count: 20000,
  genre_ids: [878],
}

const otherMovie: Movie = { ...movie, id: 2, title: 'A Origem' }

describe('watchlistStore', () => {
  beforeEach(() => {
    localStorage.clear()
    useWatchlistStore.setState({ movies: [] })
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('adds movie to the list', () => {
    useWatchlistStore.getState().addMovie(movie)
    expect(useWatchlistStore.getState().movies).toHaveLength(1)
    expect(useWatchlistStore.getState().isInWatchlist(1)).toBe(true)
  })

  it('does not duplicate movies', () => {
    useWatchlistStore.getState().addMovie(movie)
    useWatchlistStore.getState().addMovie(movie)
    expect(useWatchlistStore.getState().movies).toHaveLength(1)
  })

  it('removes movie from the list', () => {
    const { addMovie, removeMovie } = useWatchlistStore.getState()
    addMovie(movie)
    addMovie(otherMovie)
    removeMovie(1)

    const state = useWatchlistStore.getState()
    expect(state.movies).toHaveLength(1)
    expect(state.isInWatchlist(1)).toBe(false)
    expect(state.isInWatchlist(2)).toBe(true)
  })

  it('persists the list on localStorage', () => {
    useWatchlistStore.getState().addMovie(movie)

    const stored = JSON.parse(localStorage.getItem('cinedash.watchlist') ?? '{}')
    expect(stored.state.movies).toHaveLength(1)
    expect(stored.state.movies[0].title).toBe('Interestelar')
  })
})