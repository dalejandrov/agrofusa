import { createClient } from '@/lib/supabase/server';
import { CropArraySchema, type CropDTO } from '@/lib/schemas/cropSchema';

/**
 * Trae todos los cultivos y valida con Zod.
 * @throws Error si falla consulta o validación.
 */
export async function getAllCrops(): Promise<CropDTO[]> {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('crops')
        .select(`
      id,
      type,
      cycle:cycles (
        name
      )
    `);

    if (error) {
        throw new Error(`Supabase error: ${error.message}`);
    }

    // Validación Zod
    const parsed = CropArraySchema.safeParse(data ?? []);
    if (!parsed.success) {
        console.error('[ZOD_PARSE_ERROR]', parsed.error.format());
        throw new Error('Los datos de cultivos tienen un formato inesperado');
    }

    // Mapeo a DTO
    return parsed.data.map(({ id, type, cycle }) => ({
        id,
        type,
        cycleName: cycle?.name ?? '—',
    }));
}
