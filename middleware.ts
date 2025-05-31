import { withAuth } from 'next-auth/middleware'

export default withAuth({
  pages: {
    signIn: '/signin',
  },
})

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/crops/:path*',
    '/stations/:path*',
    '/producers/:path*',
    '/users/:path*',
    '/farms/:path*',
    '/profile',
    '/roles',
  ],
}
