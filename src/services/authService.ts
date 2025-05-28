import { UserRow, UserRowSchema } from '@/lib/schemas/auth/authSchema'
import { SignupInput } from '@/lib/schemas/auth/signupSchema'
import { createClient } from '@/lib/supabase/client'
import bcrypt from 'bcryptjs'

const supabase = createClient()

/**
 * Busca un usuario por email y valida esquema.
 */
export async function getUserByEmail(email: string): Promise<UserRow | null> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('users')
    .select(`
      id, first_name, last_name,
      role:roles(name),
      email, password, created_at
    `)
    .eq('email', email)
    .limit(1)
    .single()

  if (error && error.code !== 'PGRST116') {
    console.error('[SUPABASE_ERROR]', error.message)
    throw new Error('Error al consultar usuario')
  }
  if (!data) return null

  const parsed = UserRowSchema.safeParse(data)
  if (!parsed.success) {
    console.error('[ZOD_PARSE_ERROR]', parsed.error.format())
    throw new Error('Formato de usuario inválido')
  }
  return parsed.data
}

/**
 * Compara la contraseña en texto plano con el hash.
 */

export async function validatePassword(plain: string, hash: string) {
  return bcrypt.compare(plain, hash)
}

/**
 * Busca un role por nombre. Devuelve el id o null.
 */
export async function getRoleIdByName(name: string): Promise<string | null> {
  const { data, error } = await supabase
    .from('roles')
    .select('id')
    .eq('name', name)
    .limit(1)
    .single()

  if (error) {
    console.error('[getRoleIdByName]', error)
    throw new Error('Error consultando roles')
  }
  return data?.id ?? null
}

/**
 * Comprueba si ya existe un usuario con email o documento.
 */
export async function isUserExists(email: string, documentNumber: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('users')
    .select('id')
    .or(`email.eq.${email},document_number.eq.${documentNumber}`)
    .limit(1)
    .single()

  if (error && error.code !== 'PGRST116') {
    console.error('[isUserExists]', error)
    throw new Error('Error comprobando usuario existente')
  }
  return !!data
}

/**
 * Crea un usuario. Devuelve el nuevo id.
 */
export async function createUser(input: SignupInput, roleId: string): Promise<string> {
  const [first_name, ...rest] = input.name.trim().split(' ')
  const last_name = rest.join(' ') || ''

  // Hasheamos
  const password_hash = await bcrypt.hash(input.password, 12)

  const { data, error } = await supabase
    .from('users')
    .insert({
      first_name,
      last_name,
      document_type_id: input.documentTypeId,
      document_number: input.documentNumber,
      role_id: roleId,
      email: input.email,
      phone: input.phone ?? null,
      address: input.address ?? null,
      password: password_hash,
    })
    .select('id')
    .single()

  if (error || !data) {
    console.error('[createUser]', error)
    throw new Error('Error creando el usuario')
  }
  return data.id
}
