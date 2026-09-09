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
      cell: ({ row }) =>
        row.original.release_date
          ? new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short' }).format(
              new Date(row.original.release_date),
            )
          : '—',
    },
    {
      accessorKey: 'vote_average',
      header: sortableHeader('Rating'),
      cell: ({ row }) => row.original.vote_average.toFixed(1),
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
    <div className="rounded-lg border">
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
  )
}