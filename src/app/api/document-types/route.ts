import { NextResponse } from 'next/server'
import { getAllDocumentTypes } from '@/services/documentTypeService'

export const runtime = 'edge'

export async function GET() {
  try {
    const types = await getAllDocumentTypes()
    return NextResponse.json(types, { status: 200 })
  } catch (err: unknown) {
    console.error('[DOCUMENT_TYPES_API]', err)

    const message = err instanceof Error
      ? err.message
      : 'Error interno al cargar tipos de documento'

    return NextResponse.json(
      { message },
      { status: 500 }
    )
  }
}
