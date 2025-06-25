import { jsonSchemaTransform } from 'fastify-type-provider-zod'

type TransformSwaggerSchemaData = Parameters<typeof jsonSchemaTransform>[0]

export function transformSwaggerSchema(data: TransformSwaggerSchemaData) {
  const { schema, url } = jsonSchemaTransform(data)

  if (schema.consumes?.includes('multipart/form-data')) {
    const bodySchema = (schema.body ?? {
      type: 'object',
      required: [],
      properties: {},
    }) as {
      type: 'object'
      required: string[]
      properties: Record<string, unknown>
    }

    bodySchema.properties.file = {
      type: 'string',
      format: 'binary',
    }

    if (!bodySchema.required.includes('file')) {
      bodySchema.required.push('file')
    }

    schema.body = bodySchema
  }

  return { schema, url }
}
