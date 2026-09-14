export interface Genre {
  id: number
  name: string
}

export interface Movie {
  id: number
  title: string
  overview: string
  poster_path: string | null
  backdrop_path: string | null
  release_date: string | null
  vote_average: number
  vote_count: number
  genre_ids: number[]
}

export interface MovieDetails extends Movie {
  genres: Genre[]
  runtime: number | null
  tagline: string | null
  status: string
  imdb_id: string | null
}

export interface CastMember {
  id: number
  name: string
  character: string
  profile_path: string | null
  order: number
}

export interface CrewMember {
  id: number
  name: string
  job: string
  profile_path: string | null
}

export interface Video {
  id: string
  key: string
  name: string
  site: string
  type: string
  official: boolean
}

export interface MovieResult {
  page: number
  results: Movie[]
  total_pages: number
  total_results: number
}

export interface GenreList {
  genres: Genre[]
}