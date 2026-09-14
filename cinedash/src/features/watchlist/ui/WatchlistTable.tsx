import {
  columnVisibilityFeature,
  createSortedRowModel,
  flexRender,
  type ColumnDef,
  rowSortingFeature,
  tableFeatures,
  useTable,
  type SortingState,
} from '@tanstack/react-table'
import { ArrowUpDown, Heart, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { Link } from '@tanstack/react-router'

import type { Movie } from '@/entities/movie/types'
import { useGenres } from '@/entities/movie'
import { useWatchlistStore } from '@/features/watchlist/store/watchlistStore'
import { imageUrl } from '@/shared/api/tmdb'
import { Button } from '@/shared/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/ui/table'

const features = tableFeatures({
  columnVisibilityFeature,
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
})

type TableFeatures = typeof features

function sortableHeader(label: string): ColumnDef<TableFeatures, Movie>['header'] {
  return ({ column }) => (
    <Button
      variant="ghost"
      size="sm"
      className="-ml-3 h-8 gap-1"
      onClick={column.getToggleSortingHandler()}
    >
      {label}
      <ArrowUpDown className="size-3.5" />
    </Button>
  )
}

export function WatchlistTable() {
  const movies = useWatchlistStore((state) => state.movies)
  const removeMovie = useWatchlistStore((state) => state.removeMovie)
  const { data: genres = [] } = useGenres()
  const [sorting, setSorting] = useState<SortingState>([])

  const genreNames = new Map(genres.map((genre) => [genre.id, genre.name]))

  function getGenreLabels(movie: Movie) {
    return movie.genre_ids.map((id) => genreNames.get(id)).filter(Boolean)
  }

  function formatDate(date: string | null) {
    if (!date) return '—'
    return new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short' }).format(new Date(date))
  }

  const columns: ColumnDef<TableFeatures, Movie>[] = [
    {
      accessorKey: 'title',
      header: sortableHeader('Título'),
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          {row.original.poster_path && (
            <img
              src={imageUrl(row.original.poster_path, 'w92') ?? ''}
              alt=""
              className="size-10 rounded object-cover"
              loading="lazy"
            />
          )}
          <Link
            to="/movie/$id"
            params={{ id: row.original.id }}
            className="font-medium hover:underline"
          >
            {row.original.title}
          </Link>
        </div>
      ),
    },
    {
      id: 'genres',
      header: sortableHeader('Gênero'),
      accessorFn: (row) => row.genre_ids.map((id) => genreNames.get(id)).join(', '),
      cell: ({ row }) => {
        const labels = row.original.genre_ids
          .map((id) => genreNames.get(id))
          .filter(Boolean)
        return <span className="line-clamp-1">{labels.join(', ') || '—'}</span>
      },
    },
    {
      accessorKey: 'release_date',
      header: 'Data de lançamento',
      enableSorting: false,
      cell: ({ row }) => (
        <span className="text-muted-foreground text-sm">{formatDate(row.original.release_date)}</span>
      ),
    },
    {
      accessorKey: 'vote_average',
      header: sortableHeader('Rating'),
      cell: ({ row }) => (
        <span className="font-medium">{row.original.vote_average.toFixed(1)}</span>
      ),
    },
    {
      id: 'actions',
      header: '',
      enableSorting: false,
      cell: ({ row }) => (
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => removeMovie(row.original.id)}
          aria-label={`Remover ${row.original.title} da lista`}
          className="text-destructive hover:bg-destructive/10 hover:text-destructive"
        >
          <Trash2 className="size-4" />
        </Button>
      ),
    },
  ]

  const table = useTable({
    features,
    data: movies,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
  })

  if (movies.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed py-16 text-center">
        <Heart className="size-10 text-muted-foreground" />
        <p className="text-lg font-medium">Sua lista está vazia</p>
        <p className="max-w-md text-sm text-muted-foreground">
          Adicione filmes no dashboard para começar a montar sua curadoria.
        </p>
      </div>
    )
  }

  return (
    <>
      {/* Desktop: table */}
      <div className="hidden rounded-lg border md:block">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-transparent">
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile: cards */}
      <div className="flex flex-col gap-3 md:hidden">
        {/* Sort controls */}
        <div className="flex flex-wrap gap-2">
          <span className="text-muted-foreground text-xs self-center">Ordenar:</span>
          {['title', 'genres', 'vote_average'].map((key) => (
            <Button
              key={key}
              variant={
                sorting.some((s) => s.id === key)
                  ? 'default'
                  : 'outline'
              }
              size="xs"
              onClick={() => {
                setSorting((prev) => {
                  const existing = prev.find((s) => s.id === key)
                  if (existing) {
                    if (existing.desc) return prev.filter((s) => s.id !== key)
                    return prev.map((s) => (s.id === key ? { ...s, desc: true } : s))
                  }
                  return [{ id: key, desc: false }]
                })
              }}
            >
              {key === 'title' ? 'Título' : key === 'genres' ? 'Gênero' : 'Rating'}
              <ArrowUpDown className="size-3" />
            </Button>
          ))}
        </div>

        {movies.map((movie) => (
          <div
            key={movie.id}
            className="flex items-center gap-3 rounded-lg border p-3"
          >
            {movie.poster_path && (
              <img
                src={imageUrl(movie.poster_path, 'w92') ?? ''}
                alt=""
                className="h-20 w-14 shrink-0 rounded object-cover"
                loading="lazy"
              />
            )}
            <div className="min-w-0 flex-1">
              <Link
                to="/movie/$id"
                params={{ id: movie.id }}
                className="line-clamp-1 font-medium hover:underline"
              >
                {movie.title}
              </Link>
              <p className="text-muted-foreground mt-0.5 text-xs">
                {getGenreLabels(movie).join(', ') || '—'}
              </p>
              <div className="mt-1 flex items-center gap-3 text-xs">
                <span className="text-muted-foreground">{formatDate(movie.release_date)}</span>
                <span className="font-medium">{movie.vote_average.toFixed(1)}</span>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => removeMovie(movie.id)}
              aria-label={`Remover ${movie.title} da lista`}
              className="shrink-0 text-destructive hover:bg-destructive/10 hover:text-destructive"
            >
              <Trash2 className="size-4" />
            </Button>
          </div>
        ))}
      </div>
    </>
  )
}
