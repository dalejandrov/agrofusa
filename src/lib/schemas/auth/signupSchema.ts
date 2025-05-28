import { z } from 'zod'

export const signupSchema = z.object({
  name: z
    .string()
    .min(3, { message: 'El nombre debe tener al menos 3 caracteres' })
    .max(100, { message: 'El nombre es muy largo' }),
  email: z.string().email({ message: 'Email inválido' }),
  password: z
    .string()
    .min(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
    .max(100, { message: 'La contraseña es muy larga' }),
  documentTypeId: z.string().uuid({ message: 'documentTypeId debe ser un UUID válido' }),
  documentNumber: z
    .string()
    .min(4, { message: 'El número de documento es muy corto' })
    .max(20, { message: 'El número de documento es muy largo' }),
  phone: z.string().optional(),
  address: z.string().optional(),
})

export type SignupInput = z.infer<typeof signupSchema>
