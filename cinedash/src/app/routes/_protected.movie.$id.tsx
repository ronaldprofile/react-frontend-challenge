import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'

import { MovieDetailsPage } from '@/pages/movie/MovieDetailsPage'

const movieParamsSchema = z.object({
  id: z.coerce.number(),
})

export const Route = createFileRoute('/_protected/movie/$id')({
  parseParams: (params) => movieParamsSchema.parse(params),
  component: MovieDetailsPage,
})