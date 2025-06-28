import { jsonSchemaTransform } from 'fastify-type-provider-zod'

type TransformSwaggerSchemaData = Parameters<typeof jsonSchemaTransform>[0]

export function transformSwaggerSchema(data: TransformSwaggerSchemaData) {
  const result = jsonSchemaTransform(data)
  const schema = result.schema

  if (
    schema &&
    typeof schema === 'object' &&
    Array.isArray(schema.consumes) &&
    schema.consumes.includes('multipart/form-data')
  ) {
    schema.body = schema.body ?? {
      type: 'object',
      required: [],
      properties: {},
    }

    const body = schema.body as {
      type: string
      required: string[]
      properties: Record<string, unknown>
    }

    body.properties.file = {
      type: 'string',
      format: 'binary',
    }

    if (!body.required.includes('file')) {
      body.required.push('file')
    }
  }

  return result
}
