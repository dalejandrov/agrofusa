import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import type { CookieOptions } from "@supabase/ssr"

export async function createClient() {
    // const cookieStore = cookies()

    return createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                async getAll() {
                    const cookieStore = await cookies()
                    return cookieStore.getAll()
                },
                async setAll(cookiesToSet) {
                    try {
                        const cookieStore = await cookies()
                        cookiesToSet.forEach(({ name, value, options }) =>
                            cookieStore.set(name, value, options as CookieOptions)
                        )
                    } catch {
                        // Si se llama desde un Server Component sin permiso para escribir,
                        // podemos ignorar el error (por ejemplo, si tenemos middleware que
                        // ya refresca la sesión)
                    }
                },
            },
            // Opcional: si necesitas personalizar nombre, path, sameSite, etc.
            // cookieOptions: { name: "sb", path: "/", sameSite: "lax", secure: true },
        }
    )
}
