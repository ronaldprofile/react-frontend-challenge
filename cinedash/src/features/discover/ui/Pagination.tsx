import { ChevronLeft, ChevronRight } from 'lucide-react'

import { Button } from '@/shared/ui/button'

interface PaginationProps {
  page: number
  totalPages: number
  onPageChange: (page: number) => void
}

export function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null

  const pages = getVisiblePages(page, totalPages)

  return (
    <nav className="flex items-center justify-center gap-1" aria-label="Paginação">
      <Button
        variant="ghost"
        size="icon"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
        aria-label="Página anterior"
      >
        <ChevronLeft className="size-4" />
      </Button>

      {pages.map((p, index) => {
        if (p === 'ellipsis') {
          return (
            <span key={`ellipsis-${index}`} className="px-1 text-sm text-muted-foreground">
              …
            </span>
          )
        }
        return (
          <Button
            key={p}
            variant={p === page ? 'default' : 'ghost'}
            size="icon-sm"
            onClick={() => onPageChange(p)}
            aria-label={`Página ${p}`}
            aria-current={p === page ? 'page' : undefined}
          >
            {p}
          </Button>
        )
      })}

      <Button
        variant="ghost"
        size="icon"
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
        aria-label="Próxima página"
      >
        <ChevronRight className="size-4" />
      </Button>
    </nav>
  )
}

function getVisiblePages(current: number, total: number): (number | 'ellipsis')[] {
  const sibling = 1
  const range: (number | 'ellipsis')[] = [1]

  if (current - sibling > 2) range.push('ellipsis')

  for (let i = Math.max(2, current - sibling); i <= Math.min(total - 1, current + sibling); i++) {
    range.push(i)
  }

  if (current + sibling < total - 1) range.push('ellipsis')
  if (total > 1) range.push(total)

  return range
}