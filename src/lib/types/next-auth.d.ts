import { JWT as DefaultJWT } from 'next-auth/jwt'
import { DefaultSession, DefaultUser } from 'next-auth'

/** 
 * Ampliamos lo que devuelve `getSession()` o el hook `useSession()`
 */
declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      email: string
      name: string
      role: string
    } & DefaultSession['user']
  }

  interface User extends DefaultUser {
    id: string
    email: string
    name: string
    role: string
  }
}

/** 
 * Ampliamos el JWT interno de NextAuth para que incluya nuestro campo `user`
 */
declare module 'next-auth/jwt' {
  interface JWT extends DefaultJWT {
    user: {
      id: string
      email: string
      name: string
      role: string
    }
  }
}
