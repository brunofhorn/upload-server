import type { FastifyRequest } from 'fastify'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { exportUploads } from '@/app/functions/export-uploads'
import { unwrapEither } from '@/infra/shared/either'

const querystringSchema = z.object({
  searchQuery: z.string().optional(),
})

type QuerystringType = z.infer<typeof querystringSchema>

export const exportUploadsRoute: FastifyPluginAsyncZod = async server => {
  server.post(
    '/uploads/exports',
    {
      schema: {
        summary: 'Export uploads',
        tags: ['uploads'],
        querystring: z.object({
          searchQuery: z.string().optional(),
        }),
        response: {
          200: z.object({
            reportUrl: z.string(),
          }),
        },
      },
    },
    async (
      request: FastifyRequest<{ Querystring: QuerystringType }>,
      reply
    ) => {
      const { searchQuery } = request.query

      const result = await exportUploads({ searchQuery })

      const { reportUrl } = unwrapEither(result)

      return reply.status(200).send({ reportUrl })
    }
  )
}
