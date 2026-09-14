# ARCHITECTURE

Decisões técnicas por trás do **CineDash** — Opção A (Filmes), challenge do repo base.

## Estrutura de pastas (Feature-Sliced Design)

O código vive em [`cinedash/`](./cinedash) e segue uma adaptação pragmática do
Feature-Sliced Design, com quatro camadas e uma pasta `test` de infraestrutura
(fora das camadas):

```
src/
├── app/          # Bootstrap: rotas TanStack Router, providers, router, queryClient
├── entities/     # Entidade de domínio reutilizável: Movie (tipos + hooks da API)
├── features/     # Funcionalidades autônomas: auth, discover, watchlist, theme
├── pages/        # Compõe features em páginas: dashboard, movie, watchlist
├── shared/       # Código reutilizável: api, ui (shadcn), hooks, lib
└── test/         # Infra de testes: test-utils, setup, fixtures
```

Regras que seguimos:

- **Camadas só importam para baixo** (`app` → `pages` → `features` → `entities`/`shared`),
  nunca o contrário — impede ciclos e acoplamento.
- **Isolamento de responsabilidade:** a camada `shared/api` conhece só HTTP e TMDB;
  `entities` expõe hooks do TanStack Query com chaves de cache; `features` contém a
  lógica (stores Zustand) separada da UI.
- **UI primitives** (shadcn/ui) ficam em `shared/ui` e são componentes puros — nenhuma
  regra de negócio entra ali.
- **Infra de teste não é camada:** `src/test/` pertence ao runner de testes; somente
  arquivos de teste importam dela.

## Autenticação sem backend (simulada)

Sem servidor, o fluxo vive inteiramente no cliente:

1. `LoginForm` valida email/senha com **React Hook Form + Zod** (`features/auth/schema/login.ts`).
2. Ao submeter, `authStore.login(email)` gera um token *falso* (payload base64 com `exp`
   de 7 dias) e persiste `{ user, token }` no `localStorage` via middleware `persist` do Zustand.
3. Rotas protegidas usam guard `beforeLoad` do TanStack Router (`routes/_protected.tsx`):
   se não há `user`, redireciona para `/login?redirect=<path>`.
4. **Purificação de responsabilidades:** a store só manipula estado (`set`); o

   *depois* (navegar) é orquestrado pelo hook `features/auth/hooks/useLogout.ts`,
   que compõe `logout()` + `navigate('/login')`. A UI consome apenas o hook.

Esse split segue o princípio de que **store = estado, orquestração = processo da feature**
— centraliza o fluxo e evita duplicar navegação se o logout for disparado de outros lugares.

## Estado

- **Client state:** Zustand com `persist` para `auth`, `watchlist`, `discover` (filtros) e `theme`.
  Tudo sobrevive a reload — dados do dashboard, favoritos, tema e sessão.
- **Server state:** TanStack Query para dados do TMDB (discover, search, trending,
  details, credits, videos, genres) com **query keys hierárquicas** (`features/discover/api/queryKeys.ts`),
  `staleTime` para genres (1h) e `keepPreviousData` nas listagens (paginação sem flick).
- **Tema sem flash (FOUC):** um `<script>` síncrono no `index.html` lê o tema do
  `localStorage` antes do React montar e aplica a classe `.dark`/`colorScheme` no `<html>`.

## Desafios com a API do TMDB

- **Busca vs Descobrir:** a API mantém endpoints separados (`/search/movie` e
  `/discover/movie`). Unificamos no dashboard: query vazia usa `discover` (populares,
  ordenação default do TMDB), query preenchida alterna para `search` — com
  **debounce de 400ms** (`shared/hooks/useDebounce.ts`) para não floodar.
- **Filtros combinados:** `discover` aceita `with_genres`, `primary_release_year` e
  `vote_average.gte` → os filtros do dashboard mapeiam 1:1 para query params.
- **Imagens:** o TMDB exige URLs montadas a partir de valores relativos
  (`/path.jpg`) — centralizado no helper `imageUrl()` em `shared/api/tmdb.ts`.
- **Trailer/elenco:** exigem chamadas extras (videos/credits) por filme — isoladas em
  hooks dedicados e carregadas em paralelo na página de detalhes.
- **Key exposta no bundle:** `VITE_TMDB_API_KEY` é um segredo *pseudo* — fica no bundle
  por design (não há backend). Documentado em `INSTRUCTIONS.md`.

## UI/UX

- **Responsivo:** grid 2→3→5 colunas no dashboard, cards no mobile para a watchlist
  (a tabela completa fica no desktop), menu hamburger (Sheet) abaixo de `md`,
  navegação de links no desktop.
- **Estados:** skeletons para loading, mensagens orientando o usuário em caso de erro,
  toasts (sonner) para ações de add/remove e empty states guiando o usuário. O único
  retry hoje é o "Tentar novamente" no ErrorBoundary do root — retry por estado de erro
  (dashboard, página do filme) é uma melhoria pendente.
- **Error Boundary** no root (`shared/ui/error-boundary.tsx`) captura erros de
  renderização com fallback amigável.
- **TanStack Table** na watchlist com ordenação por Título/Gênero/Rating.

## Testes

Vitest + React Testing Library. Pipeline de verificação: `npm test` (vitest), `npm run
lint` (oxlint) e `tsc -b` (typecheck).

### Composição da suíte (9 arquivos, 40 testes)

- **Unidade / regras de negócio:** schema de login, stores (auth, watchlist, theme) e o
  hook `useDebounce`.
- **Integração (componentes e páginas):** `LoginForm`, `DashboardPage`, `WatchlistTable`
  e `MovieCard` — interagem via `userEvent` e validam **o que o usuário vê**, sem assertar
  detalhes de implementação. Describes em inglês, no padrão do repo.

### Infraestrutura (`src/test/`)

- **`test-utils.tsx`:** `render`/`renderHook` custom que envolvem o componente num
  `QueryClientProvider` (com `retry: false`) e montam o `<Toaster />` **real** do sonner.
  Toasts são validados via DOM (`screen.findByText`), sem mock da lib.
- **`setup.ts`:** `@testing-library/jest-dom`, `cleanup()` automático após cada teste e
  polyfills do jsdom necessários ao Radix UI/shadcn (`hasPointerCapture`,
  `scrollIntoView`).
- **`fixtures/movies.ts`:** dados fake centralizados (filmes com gêneros, anos e notas
  variados; gêneros) compartilhados entre as suítes.

### Estratégia: fake API nos testes de página

No `DashboardPage.test.tsx` o mock dos hooks do TMDB **replica o contrato da API**: recebe
filtros (gênero/ano/nota), query de busca e página como a API real, e devolve a lista de
fixtures já filtrada e paginada (5 por página). Com isso os testes são comportamentais —
aplicam o filtro no Select e verificam apenas quais filmes aparecem/desaparecem — sem
depender de como o hook foi chamado.