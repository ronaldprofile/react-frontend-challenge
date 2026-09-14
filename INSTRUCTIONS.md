# INSTRUCTIONS

This document explains how to run the project, the available scripts, and how to set up the TMDB API.

## Chosen challenge

**Option A: CineDash (Movies)** — an analytics/curation dashboard for movies powered by the [TMDB API](https://developer.themoviedb.org/docs/getting-started).

The source code lives in the [`cinedash/`](./cinedash) directory.

## Requirements

- **Node.js** `>= 20.19` (or `>= 22.12`), recommended LTS. Vite 8 requires it (`node -v` to check).
- **npm** (installed together with Node).
- A free **TMDB API key** (see [TMDB API setup](#tmdb-api-setup)).

## Installing dependencies

```bash
cd cinedash
npm install
```

## TMDB API setup

The app talks to the public [TMDB API](https://developer.themoviedb.org/docs) (movies: trending, popular, search, discover, details, credits, videos and genres).

To get an API key:

1. Create an account at [themoviedb.org](https://www.themoviedb.org/signup).
2. Go to **Settings > API** (https://www.themoviedb.org/settings/api) and request an API key.
3. Copy the key to your local environment.

Create a `.env` file in `cinedash/` (the `.env.example` file is a ready-made template):

```bash
# cinedash/.env
VITE_TMDB_API_KEY=your_api_key_here
```

Optional overrides (defaults are used if omitted):

```bash
# VITE_TMDB_BASE_URL=https://api.themoviedb.org/3
# VITE_TMDB_IMAGE_BASE_URL=https://image.tmdb.org/t/p
```

> **Note:** the TMDB key is only needed at build time and is exposed to the browser
> via `VITE_` env vars (Vite convention). Never put a backend-only secret here —
> this project has no backend, so the key is embedded in the frontend bundle by design.

All environment variables are read at `cinedash/src/shared/config/env.ts` and consumed
by the API layer at `cinedash/src/shared/api/tmdb.ts`. Restart the dev server after changing `.env`.

## Running the project

Dev server (with HMR):

```bash
npm run dev
```

Open http://localhost:5173 (Vite prints the actual port if 5173 is busy).

Production build + preview of the built assets:

```bash
npm run build
npm run preview
```

## Available scripts

All scripts run inside `cinedash/`.

| Script | Description |
| --- | --- |
| `npm run dev` | Starts the Vite dev server with hot reload. |
| `npm run build` | Type-checks (`tsc -b`) then bundles the app with Vite. Output goes to `dist/`. |
| `npm run preview` | Serves the production build locally for review. |
| `npm run lint` | Runs [Oxlint](https://oxc.rs/docs/guide/usage/linter) over the source. |
| `npm run test` | Runs the test suite (Vitest) in watch mode. |
| `npm run test:run` | Runs the test suite once (CI-friendly). |
| `npm run coverage` | Runs the test suite once and reports code coverage. |

> While working on routes, the [TanStack Router plugin](https://tanstack.com/router)
> generates route tree files automatically as part of `dev`/`build`.

## Stack summary

React 19 + TypeScript (strict) + Vite 8 · TanStack Query (server state/cache) ·
Zustand (client state + persistence) · TanStack Router (routing) ·
TanStack Table (watchlist) · Shadcn/ui + TailwindCSS 4 ·
React Hook Form + Zod (forms/validation) · Vitest + Testing Library (tests).

See [`ARCHITECTURE.md`](./ARCHITECTURE.md) for the technical decisions behind the implementation.