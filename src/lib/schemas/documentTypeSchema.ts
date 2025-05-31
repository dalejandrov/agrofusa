import { z } from 'zod'

export const DocumentTypeSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
})
export type DocumentType = z.infer<typeof DocumentTypeSchema>
export const DocumentTypeArraySchema = DocumentTypeSchema.array()
