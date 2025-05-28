import { NextResponse } from 'next/server'
import { getAllDocumentTypes } from '@/services/documentTypeService'

export const runtime = 'edge'

export async function GET() {
  try {
    const types = await getAllDocumentTypes()
    return NextResponse.json(types, { status: 200 })
  } catch (err: any) {
    console.error('[DOCUMENT_TYPES_API]', err)
    return NextResponse.json(
      { message: err.message || 'Error interno al cargar tipos de documento' },
      { status: 500 }
    )
  }
}
