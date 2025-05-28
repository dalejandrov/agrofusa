import { createClient } from '@/lib/supabase/client'
import { DocumentTypeArraySchema, type DocumentType } from '@/lib/schemas/documentTypeSchema'

const supabase = createClient()

/**
 * Recupera todos los tipos de documento de la tabla `document_types`
 */
export async function getAllDocumentTypes(): Promise<DocumentType[]> {
  const { data, error } = await supabase
    .from('document_types')
    .select('id, name')

  if (error) {
    console.error('[getAllDocumentTypes]', error)
    throw new Error('Error cargando tipos de documento')
  }

  const parsed = DocumentTypeArraySchema.safeParse(data ?? [])
  if (!parsed.success) {
    console.error('[getAllDocumentTypes] Zod error', parsed.error.format())
    throw new Error('Formato inesperado de tipos de documento')
  }

  return parsed.data
}
