'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { Home, Settings, LogOut, ChevronDown } from 'lucide-react'

export function DashboardHeader() {
  const { data: session } = useSession()
  const pathname = usePathname()
  const router = useRouter()

  const titles: Record<string, string> = {
    '/dashboard':           'Inicio',
    '/dashboard/analytics': 'Analytics',
    '/dashboard/settings':  'Ajustes',
  }
  const title = titles[pathname] || ''

  const handleSignOut = async () => {
    await signOut({ redirect: false, callbackUrl: '/signin' })
    router.push('/signin')
  }

  return (
    <header
      className="
        fixed top-0 right-0 left-0 h-16
        flex items-center justify-between
        bg-white border-b z-30
        px-4 sm:px-6
        lg:left-64 lg:px-8
      "
    >
      <h1 className="text-xl font-semibold text-gray-800">{title}</h1>

      {session?.user && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center space-x-2">
              <Avatar className="h-8 w-8">
                {session.user.image
                  ? <AvatarImage src={session.user.image} alt={session.user.name ?? 'Usuario'} />
                  : <AvatarFallback>{session.user.name?.[0] ?? 'U'}</AvatarFallback>}
              </Avatar>
              <span className="hidden sm:inline text-gray-700">{session.user.name?.split(' ')[0]}</span>
              <ChevronDown className="w-4 h-4 text-gray-500" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem asChild>
              <Link href="/dashboard/profile" className="flex items-center space-x-2">
                <Home className="w-4 h-4" />
                <span>Perfil</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/dashboard/settings" className="flex items-center space-x-2">
                <Settings className="w-4 h-4" />
                <span>Ajustes</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={handleSignOut}
              className="flex items-center space-x-2 text-red-600"
            >
              <LogOut className="w-4 h-4" />
              <span>Cerrar sesión</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </header>
  )
}
