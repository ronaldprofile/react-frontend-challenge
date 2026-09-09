import { Search, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

import { useDiscoverStore } from '@/features/discover/store/discoverStore'
import { useDebounce } from '@/shared/hooks/useDebounce'
import { Input } from '@/shared/ui/input'

export function DiscoverSearch() {
  const query = useDiscoverStore((state) => state.query)
  const setQuery = useDiscoverStore((state) => state.setQuery)
  const [draft, setDraft] = useState(query)
  const debounced = useDebounce(draft, 400)
  const isFirstRender = useRef(true)

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    setQuery(debounced)
  }, [debounced, setQuery])

  return (
    <div className="relative w-full max-w-md">
      <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="search"
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        placeholder="Buscar filmes..."
        className="pl-9 pr-9"
        aria-label="Buscar filmes"
      />
      {draft && (
        <button
          type="button"
          onClick={() => setDraft('')}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          aria-label="Limpar busca"
        >
          <X className="size-4" />
        </button>
      )}
    </div>
  )
}