# CineDash - Frontend Challenge

Bem-vindo ao desafio tecnico para a vaga de **Desenvolvedor React Pleno**.

O objetivo deste desafio e avaliar suas habilidades em arquitetura frontend, consumo de APIs complexas, gerenciamento de estado e boas praticas de UX/UI. Nao buscamos apenas "codigo que funciona", mas sim **codigo que escala**.

## O Desafio

Voce deve construir o **CineDash**, um dashboard de curadoria e descoberta de filmes utilizando a [API do TMDB](https://developer.themoviedb.org/docs/getting-started).
Imagine que este e um produto interno usado por curadores de cinema para selecionar quais filmes entrarao no catalogo de um streaming.

## Telas e Navegacao

| Rota | Tela | Autenticacao |
|---|---|---|
| `/login` | Login | Nao (redireciona se logado) |
| `/dashboard` | Dashboard de Descoberta | Sim |
| `/watchlist` | Minha Lista (Watchlist) | Sim |
| `/movie/:id` | Detalhes do Filme | Sim |
| `/` | Redireciona para `/dashboard` | Nao |

### Navegacao Responsiva

- **Desktop (>= 768px):** Links de navegacao visiveis no header (Descobrir, Minha Lista).
- **Mobile (< 768px):** Menu hamburger com Drawer/Sheet que expoe os mesmos links de navegacao.
- O header deve conter: logo, navegacao, toggle de tema e menu do usuario.

## Funcionalidades Obrigatorias (Core)

### 1. Autenticacao (Simulada)

Como nao temos backend, a autenticacao deve ser tratada no front-end:

- Tela de Login com validacao via **Zod** (Email valido e senha > 6 caracteres).
- Ao "logar", gerar um token ficticio e persistir no `localStorage` ou `cookie`.
- Apenas usuarios autenticados podem acessar a busca e a estante.
- **Diferencial:** Persistir a sessao do usuario ao recarregar a pagina.

### 2. Dashboard de Descoberta

- Listagem de filmes (Trending/Popular) com paginacao ou infinite scroll.
- **Requisito Tecnico:** Implementar **Debounce** no input para nao floodar a API.
- **Paginacao:** Implementar paginacao (botoes ou infinite scroll).
- **Filtros Avancados:** Filtrar por Genero, Ano de Lancamento e Nota Minima (Rating).

### 3. Minha Lista (Watchlist)

- Adicionar/Remover filmes de uma lista de favoritos.
- Esta lista deve persistir mesmo apos o reload da pagina.
- Colunas: Titulo, Genero, Data de Lancamento, Rating e **Acoes**.
- **Ordenacao:** Permitir ordenar a tabela por Titulo, Genero ou Rating.
- **Persistencia:** Os dados do dashboard devem sobreviver ao _refresh_ da pagina (uso de `persist` middleware do Zustand).

### 4. Detalhes do Filme

- Rota dinamica (`/movie/:id`) exibindo sinopse, elenco, nota e trailer (se houver).
- Botao para adicionar/remover da watchlist.

## Telas Obrigatorias - Checklist

- [ ] **Login:** Formulario com email + senha, validacao Zod, feedback de erro.
- [ ] **Dashboard:** Grid responsivo de filmes, busca com debounce, filtros (genero/ano/rating), paginacao.
- [ ] **Detalhes do Filme:** Backdrop, poster, titulo, sinopse, elenco, trailer embed, botao watchlist.
- [ ] **Watchlist:** Tabela ordenavel com colunas (titulo, genero, data, rating, acoes).
- [ ] **Header:** Logo, navegacao, toggle tema, avatar do usuario com dropdown de logout.

## Layout Responsivo

Obrigatorio em todas as telas:

- **Breakpoints:** `sm` (640px), `md` (768px), `lg` (1024px).
- **Dashboard Grid:** 2 colunas (mobile) -> 3 colunas (tablet) -> 5 colunas (desktop).
- **Detalhes do Filme:** Poster centralizado (mobile) -> lado a lado com info (desktop).
- **Cast Grid:** 2 colunas (mobile) -> 4 colunas (tablet) -> 6 colunas (desktop).
- **Watchlist Table:** Tabela completa (desktop) -> Layout em cards (mobile).
- **Header:** Links visiveis (desktop) -> Menu hamburger (mobile).
- **Nao deve haver overflow horizontal** em nenhuma tela.

## UX Obrigatoria

- **Loading States:** Skeletons para todas as listas e paginas de detalhe.
- **Error States:** Mensagens amigaveis com opcao de retry.
- **Empty States:** Mensagens orientando o usuario quando nao ha dados.
- **Toasts:** Feedback visual para acoes (adicionar/remover da watchlist, erros de API).
- **Tema Dark/Light:** Persistido via Zustand, sem flash de tema (FOUC prevention).
- **Error Boundary:** Componente que captura erros de renderizacao e exibe fallback amigavel.

## Tech Stack Obrigatoria

- **Core:** React 18+, TypeScript (Strict), Vite.
- **Server State & Cache:** TanStack Query.
- **Client State:** Zustand.
- **Routing:** TanStack Router (Preferencial) ou React Router v6 (com Data Loaders).
- **UI Components:** Shadcn/ui + TailwindCSS.
- **Formularios:** React Hook Form ou TanStack Form + Zod (validacao).
- **Testes:** Vitest + React Testing Library.

> **Diferencial:** Implementacao de `TanStack Table` para listagens complexas.

## Arquitetura

Esperamos ver uma estrutura de projeto que suporte crescimento.

- **Feature-Sliced Design (FSD)** ou **Clean Architecture** adaptada ao Frontend.
- Isolamento de regras de negocio (hooks customizados vs componentes de UI).
- **Git Flow:** Utilize commits semanticos e organize seu trabalho em branches/PRs.

## UI/UX

- Layout responsivo e fluido.
- Feedback visual para o usuario (Loadings, Skeletons, Toasts de erro/sucesso).
- Tema Dark/Light (persistido via Zustand).

## Criterios de Avaliacao

Avaliaremos seu teste com base nos seguintes pilares:

1. **Arquitetura e Clean Code:**
   - Separacao clara de responsabilidades (API Services, Hooks, Components, Utils).
   - Estrutura de pastas organizada (sugerimos _Feature-Sliced Design_ ou modular).

2. **Qualidade de UI/UX:**
   - Tratamento de estados de Loading (Skeletons) e Error (Empty States).
   - Design responsivo, fluido e minimalista.
   - Tema Dark/Light (persistido via Zustand).
   - Menu mobile funcional (hamburger/drawer).
   - Tabela responsiva (cards no mobile).

3. **Dominio da Stack:**
   - Uso correto de chaves de cache e invalidacao no TanStack Query.
   - Componentizacao eficiente (evitar prop drilling excessivo).
   - Testes unitarios cobrindo regras de negocio (ex: validacao do form, logica do dashboard).

4. **Git e Processo:**
   - Uso de GitFlow (branches `feature/`, `fix/`).
   - Commits semanticos.

## Como entregar

1. Faca um **fork** deste repositorio para a sua propria conta do GitHub.
2. Desenvolva sua solucao em uma branch separada (ex: `feature/cinedash-impl`).
3. Quando finalizar, abra um **Pull Request** para a branch `main` do **seu** repositorio forkado.
4. Crie um arquivo `ARCHITECTURE.md` explicando suas decisoes tecnicas.
   - A estrutura de pastas escolhida.
   - Como gerenciou a autenticacao sem backend.
   - Desafios encontrados com a API do TMDB.
5. Crie um arquivo `INSTRUCTIONS.md` explicando o projeto escolhido e como rodar seu projeto.
6. No corpo do PR, inclua uma breve descricao do que foi feito.
7. Envie o link do seu Pull Request (ou do repositorio) para o recrutador responsavel.

## Recursos Uteis

- [Documentacao TMDB](https://developer.themoviedb.org/docs)
- [TanStack Docs](https://tanstack.com/)
- [Feature-Sliced Design](https://feature-sliced.design/)

Boa sorte! Estamos ansiosos para ver sua solucao.