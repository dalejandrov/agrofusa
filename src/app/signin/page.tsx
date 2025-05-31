'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { motion } from 'framer-motion'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Eye, EyeOff } from 'lucide-react' 

export default function SignInPage() {
    const router = useRouter()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        const res = await signIn('credentials', {
            redirect: false,
            email,
            password,
        })

        setLoading(false)
        if (res?.error) {
            if (res.error === "CredentialsSignin") {
                setError("Email o contraseña incorrectos. Por favor, inténtalo de nuevo.")
            } else {
                setError(res.error)
            }
        } else {
            router.push('/dashboard')
        }
    }

    return (
        <div className="min-h-screen flex flex-col lg:flex-row">            
            <motion.div
                className="hidden lg:flex w-full lg:w-1/2 bg-green-600 text-white items-center justify-center p-12"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0, transition: { duration: 0.6 } }}
            >
                <div className="max-w-lg space-y-8">
                    <h2 className="text-5xl font-extrabold leading-tight">
                        Bienvenido a <br className="hidden xl:block" /> Agrofusa
                    </h2>
                    <p className="text-xl opacity-90">
                        Tu plataforma inteligente para la gestión avanzada de cultivos. Controla tu producción en tiempo real y optimiza tus recursos.
                    </p>
                    <ul className="list-disc list-inside space-y-3 text-lg pl-2"> 
                        <li>Análisis en tiempo real</li>
                        <li>Alertas inteligentes</li>
                        <li>Planificación automatizada</li>
                    </ul>
                </div>
            </motion.div>
        
            <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-green-50 via-green-100 to-white">
                <motion.div
                    className="w-full max-w-md"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0, transition: { duration: 0.6 } }}
                >
                    <Card className="border border-green-200 shadow-xl rounded-lg">
                        <CardHeader className="p-6 sm:p-8">
                            <CardTitle className="text-3xl font-bold text-green-800 text-center">
                                Iniciar sesión
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 sm:p-8">
                            {error && (
                                <motion.div
                                    className="mb-5 p-3 bg-red-100 border-l-4 border-red-500 text-red-700 rounded-md text-sm"
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0, transition: { duration: 0.3 } }}
                                    role="alert"
                                >
                                    {error}
                                </motion.div>
                            )}
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                        required
                                        placeholder="tu@email.com"
                                        className="mt-1 w-full border-gray-300 focus:border-green-500 focus:ring-green-500 rounded-md shadow-sm"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="password" className="text-sm font-medium text-gray-700">Contraseña</Label>
                                    <div className="relative mt-1">
                                        <Input
                                            id="password"
                                            type={showPassword ? 'text' : 'password'}
                                            value={password}
                                            onChange={e => setPassword(e.target.value)}
                                            required
                                            placeholder="••••••••"
                                            className="w-full border-gray-300 focus:border-green-500 focus:ring-green-500 rounded-md shadow-sm pr-10" 
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-green-600 cursor-pointer"
                                            aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                                        >
                                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                        </button>
                                    </div>
                                </div>
                                <Button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 mt-2 rounded-md shadow-md hover:shadow-lg transition-shadow duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"                                    
                                >
                                    {loading ? (
                                        <div className="flex items-center justify-center">
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Entrando...
                                        </div>
                                    ) : 'Entrar'}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                    <p className="mt-6 text-center text-sm text-gray-600">
                        ¿No tienes una cuenta?{' '}
                        <a href="/signup" className="font-medium text-green-600 hover:text-green-500">
                            Regístrate aquí
                        </a>
                    </p>
                </motion.div>
            </div>
        </div>
    )
}