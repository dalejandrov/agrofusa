import { signupSchema } from '@/lib/schemas/auth/signupSchema'
import { createUser, getRoleIdByName, isUserExists } from '@/services/authService'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  // 1) Validación Zod del body
  const body = await req.json()
  const parse = signupSchema.safeParse(body)
  if (!parse.success) {
    return NextResponse.json(
      { errors: parse.error.format() },
      { status: 400 }
    )
  }
  const input = parse.data

  try {
    // 2) Role PRODUCTOR
    const roleId = await getRoleIdByName('PRODUCTOR')
    if (!roleId) {
      return NextResponse.json(
        { message: 'Role PRODUCTOR no configurado' },
        { status: 500 }
      )
    }

    // 3) Duplicados
    const exists = await isUserExists(input.email, input.documentNumber)
    if (exists) {
      return NextResponse.json(
        { message: 'Ya existe un usuario con ese email o documento' },
        { status: 409 }
      )
    }

    // 4) Creación
    const userId = await createUser(input, roleId)
    return NextResponse.json(
      { message: 'Usuario creado', userId },
      { status: 201 }
    )
  } catch (err: unknown) {
    console.error('[SIGNUP_ROUTE_ERROR]', err)

    const message = err instanceof Error ? err.message : 'Error interno'

    return NextResponse.json(
      { message },
      { status: 500 }
    )
  }
}
