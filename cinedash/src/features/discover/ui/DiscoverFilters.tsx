import { useMemo, useState } from 'react'

import { useDiscoverStore } from '@/features/discover/store/discoverStore'
import { useGenres } from '@/entities/movie'
import { Button } from '@/shared/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/select'

const RATING_OPTIONS = [0, 5, 6, 7, 8, 9]

export function DiscoverFilters() {
  const genreId = useDiscoverStore((state) => state.genreId)
  const year = useDiscoverStore((state) => state.year)
  const minRating = useDiscoverStore((state) => state.minRating)
  const setGenreId = useDiscoverStore((state) => state.setGenreId)
  const setYear = useDiscoverStore((state) => state.setYear)
  const setMinRating = useDiscoverStore((state) => state.setMinRating)
  const reset = useDiscoverStore((state) => state.reset)

  const { data: genres = [] } = useGenres()
  const [currentYear] = useState(() => new Date().getFullYear())

  const years = useMemo(() => {
    const list: string[] = []
    for (let y = currentYear; y >= 1980; y--) list.push(String(y))
    return list
  }, [currentYear])

  const hasActiveFilters = genreId !== '' || year !== '' || minRating !== 0

  return (
    <div className="flex flex-wrap items-center gap-3">
      <Select value={genreId} onValueChange={setGenreId}>
        <SelectTrigger className="w-44" aria-label="Filtrar por gênero">
          <SelectValue placeholder="Gênero" />
        </SelectTrigger>
        <SelectContent>
          {genres.map((genre) => (
            <SelectItem key={genre.id} value={String(genre.id)}>
              {genre.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={year} onValueChange={setYear}>
        <SelectTrigger className="w-36" aria-label="Filtrar por ano">
          <SelectValue placeholder="Ano de lançamento" />
        </SelectTrigger>
        <SelectContent>
          {years.map((y) => (
            <SelectItem key={y} value={y}>
              {y}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={minRating ? String(minRating) : ''}
        onValueChange={(value) => setMinRating(Number(value))}
      >
        <SelectTrigger className="w-40" aria-label="Filtrar por nota mínima">
          <SelectValue placeholder="Nota mínima" />
        </SelectTrigger>
        <SelectContent>
          {RATING_OPTIONS.map((rating) => (
            <SelectItem key={rating} value={String(rating)}>
              {rating === 0 ? 'Qualquer nota' : `${rating}+`}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {hasActiveFilters && (
        <Button variant="ghost" size="sm" onClick={reset}>
          Limpar filtros
        </Button>
      )}
    </div>
  )
}