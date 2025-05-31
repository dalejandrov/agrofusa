import { createClient } from '@/lib/supabase/client'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase.from('stations').select('id')
    if (error) throw error
    const stations = data.map((s: { id: string }) => ({ id: s.id, name: s.id }))
    return NextResponse.json(stations)
  } catch (err: any) {
    console.error('Error al obtener estaciones:', err.message)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}