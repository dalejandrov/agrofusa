'use client'

import React, { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  Menu,
  X,
  LogOut,
  UserCircle,
  ChevronDown,
  Home,
  Sprout,
  Settings,
  LogIn,
  UserPlus,
  LucideProps,
} from 'lucide-react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { AvatarProps } from '@radix-ui/react-avatar'

type LucideIcon = React.ComponentType<LucideProps>

type RouteConfig = {
  path: string
  name: string
  icon: LucideIcon
  auth: boolean
}

const ROUTES: Record<string, RouteConfig> = {
  HOME: { path: '/', name: 'Inicio', icon: Home, auth: false },
  CROPS: { path: '/crops', name: 'Cultivos', icon: Sprout, auth: true },
  PROFILE: { path: '/profile', name: 'Mi Perfil', icon: UserCircle, auth: true },
  SETTINGS: { path: '/settings', name: 'Configuración', icon: Settings, auth: true },
  SIGNIN: { path: '/signin', name: 'Iniciar sesión', icon: LogIn, auth: false },
  SIGNUP: { path: '/signup', name: 'Registrarse', icon: UserPlus, auth: false },
} as const

export function Header() {
  const { data: session, status } = useSession()
  const loading = status === 'loading'
  const router = useRouter()
  const [mobileOpen, setMobileOpen] = useState(false)

  const fullName = session?.user?.name?.trim() ?? ''
  const firstName = fullName.split(' ')[0] || 'Usuario'
  const initials = fullName
    .split(' ')
    .map(w => w[0] ?? '')
    .join('')
    .slice(0, 2)
    .toUpperCase()
  const email = session?.user?.email ?? ''

  const handleSignOut = useCallback(async () => {
    await signOut({ redirect: false, callbackUrl: ROUTES.SIGNIN.path })
    router.push(ROUTES.SIGNIN.path)
    setMobileOpen(false)
  }, [router])

  const UserAvatar: React.FC<AvatarProps> = (props) => (
    <Avatar {...props}>
      {session?.user?.image ? (
        <AvatarImage src={session.user.image!} alt={fullName || 'Usuario'} />
      ) : (
        <AvatarFallback className="bg-green-100 text-green-800 font-semibold">
          {initials || <UserCircle size={20} />}
        </AvatarFallback>
      )}
    </Avatar>
  )

  // Rutas del dropdown
  const dropdownLinks = [
    ROUTES.HOME,
    ROUTES.CROPS,
    ROUTES.PROFILE,
    ROUTES.SETTINGS,
  ].filter(r => !r.auth || session?.user)

  return (
    <motion.header
      className="fixed top-0 w-full bg-white/95 backdrop-blur-sm shadow z-50"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1, transition: { duration: 0.4 } }}
      role="banner"
    >
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        <Link href={ROUTES.HOME.path} className="text-2xl font-extrabold text-green-700">
          Agrofusa
        </Link>

        {/* DESKTOP */}
        <div className="hidden lg:flex items-center space-x-4">
          {loading ? (
            <div className="flex items-center space-x-2 animate-pulse">
              <div className="h-9 w-9 bg-gray-200 rounded-full" />
              <div className="h-5 w-20 bg-gray-200 rounded" />
            </div>
          ) : session?.user ? (
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center space-x-2 px-3 py-1.5 rounded-full hover:bg-gray-100"
                >
                  <UserAvatar className="h-9 w-9" />
                  <span className="font-medium text-gray-800">{firstName}</span>
                  <ChevronDown size={16} />
                </Button>
              </PopoverTrigger>
              <PopoverContent align="end" className="w-56 mt-2 p-1 bg-white shadow-lg rounded-md">
                {/* Info de usuario */}
                <div className="px-3 py-2 border-b">
                  <p className="font-semibold text-gray-800 truncate">{fullName}</p>
                  <p className="text-xs text-gray-500 truncate">{email}</p>
                </div>
                {/* Links internos */}
                <div className="py-1">
                  {dropdownLinks.map(route => {
                    const Icon = route.icon
                    return (
                      <Button
                        key={route.path}
                        variant="ghost"
                        asChild
                        className="w-full justify-start gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <Link href={route.path}>
                          <Icon className="w-4 h-4 text-gray-500" />
                          {route.name}
                        </Link>
                      </Button>
                    )
                  })}
                </div>
                <Separator className="my-1" />
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-3 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                  onClick={handleSignOut}
                >
                  <LogOut className="w-4 h-4" />
                  Cerrar sesión
                </Button>
              </PopoverContent>
            </Popover>
          ) : (
            <>
              <Link href={ROUTES.SIGNIN.path}>
                <Button variant="ghost" className="px-4 py-2">
                  {ROUTES.SIGNIN.name}
                </Button>
              </Link>
              <Link href={ROUTES.SIGNUP.path}>
                <Button className="bg-green-600 text-white px-4 py-2">
                  {ROUTES.SIGNUP.name}
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* MOBILE */}
        <div className="lg:hidden">
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" className="p-2 text-gray-700 hover:text-green-600">
                {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </Button>
            </SheetTrigger>

            <SheetContent
              side="right"
              className="w-72 p-0 flex flex-col"
              aria-label="Menú móvil"
            >
              {/* 1. DialogTitle obligatorio para accesibilidad */}
              <SheetTitle className="sr-only">Menú de navegación</SheetTitle>

              {/* Cabecera Mobile */}
              <SheetHeader className="p-4 border-b">
                <div className="flex items-center justify-between">
                  {session?.user ? (
                    // Usuario autenticado
                    <div className="flex items-center space-x-3">
                      <UserAvatar className="h-10 w-10" />
                      <div>
                        <p className="text-base font-semibold text-gray-800 truncate">{firstName}</p>
                        <p className="text-sm text-gray-500 truncate">{email}</p>
                      </div>
                    </div>
                  ) : (
                    // No autenticado: sólo el logo/título
                    <span className="text-xl font-bold text-green-700">Agrofusa</span>
                  )}
                  <Button
                    variant="ghost"
                    className="p-2 text-gray-500 hover:text-gray-700"
                    onClick={() => setMobileOpen(false)}
                    aria-label="Cerrar menú"
                  >
                  </Button>
                </div>
              </SheetHeader>

              {/* Navegación Mobile */}
              <nav className="flex-1 p-4 space-y-2">
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-3 text-base h-12 px-3"
                  onClick={() => setMobileOpen(false)}
                  asChild
                >
                  <Link href={ROUTES.HOME.path}>
                    <Home className="w-5 h-5" />
                    Inicio
                  </Link>
                </Button>

                {session?.user && (
                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-3 text-base h-12 px-3"
                    onClick={() => setMobileOpen(false)}
                    asChild
                  >
                    <Link href={ROUTES.CROPS.path}>
                      <Sprout className="w-5 h-5" />
                      Cultivos
                    </Link>
                  </Button>
                )}
              </nav>

              {/* Footer Mobile */}
              <div className="p-4 border-t mt-auto">
                {session?.user ? (
                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-3 px-3 py-2 text-red-600 hover:bg-red-50"
                    onClick={handleSignOut}
                  >
                    <LogOut className="w-5 h-5" />
                    Cerrar sesión
                  </Button>
                ) : (
                  <div className="flex flex-col gap-3">
                    <Button
                      variant="outline"
                      className="w-full py-2"
                      onClick={() => setMobileOpen(false)}
                      asChild
                    >
                      <Link href={ROUTES.SIGNIN.path}>Iniciar sesión</Link>
                    </Button>
                    <Button
                      className="w-full bg-green-600 text-white py-2"
                      onClick={() => setMobileOpen(false)}
                      asChild
                    >
                      <Link href={ROUTES.SIGNUP.path}>Registrarse</Link>
                    </Button>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>

      </div>
    </motion.header>
  )
}
