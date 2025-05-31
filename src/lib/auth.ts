import { getUserByEmail, validatePassword } from "@/services/authService"
import { NextAuthOptions } from "next-auth"
import CredentialsProvider from 'next-auth/providers/credentials'


export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Email y contraseña',
      credentials: { email: { type: 'text' }, password: { type: 'password' } },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          throw new Error('Faltan credenciales')
        }
        const user = await getUserByEmail(credentials.email)
        if (!user || !user.email) {
          throw new Error('Email o contraseña incorrectos')
        }
        const isValid = await validatePassword(credentials.password, user.password)
        if (!isValid) {
          throw new Error('Email o contraseña incorrectos')
        }
        return {
          id:   user.id,
          email: user.email,
          name: `${user.first_name} ${user.last_name}`.trim(),
          role: user.role.name,
        }
      },
    }),
  ],
  session: { strategy: 'jwt' },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/signin',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.user = { id: user.id, email: user.email!, name: user.name!, role: user.role! }
      return token
    },
    async session({ session, token }) {
      session.user = { ...session.user!, ...token.user }
      return session
    },
  },
}