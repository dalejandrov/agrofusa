import { createClient } from '@/lib/supabase/client'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const from = searchParams.get('from')
  const to = searchParams.get('to')
  const station = searchParams.get('station')

  if (!from || !to || !station) {
    return NextResponse.json(
      { error: 'Faltan parámetros: from, to, station' },
      { status: 400 }
    )
  }

  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('capture_events')
      .select(
        'id, capture_date, capture_hour, temperature_dht22, humidity_dht22, hydrogen_mq, radiation'
      )
      .eq('station_id', station)
      .gte('capture_date', from)
      .lte('capture_date', to)
      .order('capture_date', { ascending: false })
      .limit(100)

    if (error) throw error
    return NextResponse.json(data)
  } catch (err: unknown) {
    console.error('Error al obtener capture-events:', err)

    const message = err instanceof Error ? err.message : 'Error interno'

    return NextResponse.json(
      { error: message },
      { status: 500 }
    )
  }
}
