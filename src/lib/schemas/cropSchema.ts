import { z } from 'zod';

/**
 * Esquema de la fila que devuelve Supabase (con join a cycles).
 */
export const CropSchema = z.object({
  id: z.string().uuid(),
  type: z.string().min(1),
  cycle: z
    .object({ name: z.string().min(1) })
    .nullable(),
});

export const CropArraySchema = CropSchema.array();

/**
 * Tipo de fila cruda desde Supabase tras el select<…>()
 */
export type CropRow = z.infer<typeof CropSchema>;

/**
 * DTO que exponemos al frontend
 */
export type CropDTO = {
  id: string;
  type: string;
  cycleName: string;
};
