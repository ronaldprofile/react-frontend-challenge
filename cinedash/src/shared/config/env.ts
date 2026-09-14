const env = import.meta.env

export const CONFIG = {
  api: {
    baseUrl: env.VITE_TMDB_BASE_URL ?? 'https://api.themoviedb.org/3',
    imageBaseUrl: env.VITE_TMDB_IMAGE_BASE_URL ?? 'https://image.tmdb.org/t/p',
    apiKey: env.VITE_TMDB_API_KEY ?? '',
  },
  app: {
    name: 'CineDash',
  },
} as const

export function hasApiKey(): boolean {
  return CONFIG.api.apiKey.length > 0
}