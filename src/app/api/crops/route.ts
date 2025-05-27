import { NextResponse } from 'next/server';
import { getAllCrops } from '@/services/cropsService';
import type { CropDTO } from '@/lib/schemas/cropSchema';

export const runtime = 'edge';

export async function GET() {
  try {
    const crops: CropDTO[] = await getAllCrops();
    return NextResponse.json(crops, {
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=30',
      },
    });
  } catch (err) {
    console.error('[CROPS_API_ERROR]', err);
    const message = err instanceof Error ? err.message : 'Error desconocido';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
