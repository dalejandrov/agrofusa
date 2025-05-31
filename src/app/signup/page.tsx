'use client'

import { useState, useEffect, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { motion } from 'framer-motion'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Eye, EyeOff, Loader2 } from 'lucide-react'

type DocumentType = {
  id: string
  name: string
}

const baseInputClassName =
  'mt-1 w-full border-gray-300 focus:border-green-500 focus:ring-green-500 rounded-md shadow-sm'
const passwordInputClassName = `${baseInputClassName} pr-10`
const labelClassName = 'text-sm font-medium text-gray-700'

export default function SignUpPage() {
  const router = useRouter()

  // Form state
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [documentTypeId, setDocumentTypeId] = useState('')
  const [documentNumber, setDocumentNumber] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')

  // UI state
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  // Document types dropdown state
  const [docTypes, setDocTypes] = useState<DocumentType[]>([])
  const [loadingDocTypes, setLoadingDocTypes] = useState(true)
  const [docTypesError, setDocTypesError] = useState<string | null>(null)

  useEffect(() => {
    const controller = new AbortController()
    const { signal } = controller

    async function fetchDocTypes() {
      setLoadingDocTypes(true)
      setDocTypesError(null)
      try {
        const res = await fetch('/api/document-types', { signal })
        if (!res.ok) {          
          let errorMsg = 'Error cargando tipos de documento'
          try {
            const errorData = await res.json()
            errorMsg = errorData?.message || errorMsg
          } catch (parseError) {            
            console.error('Error parsing error response for doc types:', parseError)
          }
          throw new Error(errorMsg)
        }
        const data: DocumentType[] = await res.json()
        setDocTypes(data)
        if (data.length > 0 && !documentTypeId) {
          setDocumentTypeId(data[0].id)
        }
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          setDocTypesError(err.message || 'Error inesperado al cargar tipos de documento.')
        }
      } finally {        
        if (signal.aborted) {
            console.log("Fetch aborted for document types.");
        } else {
            setLoadingDocTypes(false);
        }
      }
    }

    fetchDocTypes()

    return () => {
      controller.abort() 
    }
  }, [documentTypeId])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.')
      return
    }
    if (!documentTypeId) {
      setError('Por favor, selecciona un tipo de documento.')
      return
    }

    setLoading(true)
    try {
      const signupPayload = {
        name,
        email,
        password,
        documentTypeId,
        documentNumber,
        phone: phone || undefined,
        address: address || undefined,
      }

      // 1) Signup API call
      const signupRes = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(signupPayload),
      })
      const signupData = await signupRes.json()

      if (!signupRes.ok) {
        const errorMessages = signupData.errors
          ? Object.values(signupData.errors)
              .flatMap((fieldErrors: any) => (Array.isArray(fieldErrors) ? fieldErrors : [fieldErrors]))
              .join(' ')
          : signupData.message
        throw new Error(errorMessages || 'Error al crear la cuenta.')
      }

      // 2) Auto-login
      const signInRes = await signIn('credentials', {
        redirect: false,
        email,
        password,
      })

      if (signInRes?.error) {
        const loginErrorMsg =
          signInRes.error === 'CredentialsSignin'
            ? 'Cuenta creada, pero hubo un error al iniciar sesión automáticamente. Por favor, intenta iniciar sesión manualmente.'
            : `Error de inicio de sesión: ${signInRes.error}`
        // Set error, but don't throw, as signup was successful. Or redirect to login with message.
        // For this example, we'll show the error and let user proceed to login.
        setError(loginErrorMsg)
        router.push(`/signin?message=${encodeURIComponent(loginErrorMsg)}`) // Redirect to signin with a message
        return; // Stop further execution in this function
      }

      // 3) Redirect to dashboard on successful login
      router.push('/dashboard')
    } catch (err: any) {
      setError(err.message || 'Ocurrió un error inesperado.')
    } finally {
      setLoading(false)
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
            Únete a <br className="hidden xl:block" /> Agrofusa
          </h2>
          <p className="text-xl opacity-90">
            Regístrate para transformar tu gestión agrícola con herramientas inteligentes y análisis precisos.
          </p>
          <ul className="list-disc list-inside space-y-3 text-lg pl-2">
            <li>Optimización de recursos</li>
            <li>Monitoreo en tiempo real</li>
            <li>Decisiones basadas en datos</li>
            <li>Soporte especializado</li>
          </ul>
        </div>
      </motion.div>

      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-green-50 via-green-100 to-white">
        <motion.div
          className="w-full max-w-lg"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0, transition: { duration: 0.6 } }}
        >
          <Card className="border border-green-200 shadow-xl rounded-lg">
            <CardHeader className="p-6 sm:p-8">
              <CardTitle className="text-3xl font-bold text-green-800 text-center">
                Crear cuenta
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

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <Label htmlFor="name" className={labelClassName}>Nombre completo</Label>
                  <Input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="Alejandro Londoño"
                    className={baseInputClassName}
                  />
                </div>

                <div>
                  <Label htmlFor="email" className={labelClassName}>Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="tu@email.com"
                    className={baseInputClassName}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="documentTypeId" className={labelClassName}>Tipo de documento</Label>
                    {loadingDocTypes ? (
                      <div className={`${baseInputClassName} flex items-center text-gray-500`}>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Cargando...
                      </div>
                    ) : docTypesError ? (
                      <div className="mt-1 text-sm text-red-600 p-2 bg-red-50 border border-red-200 rounded-md">
                        {docTypesError}
                      </div>
                    ) : (
                      <Select
                        value={documentTypeId}
                        onValueChange={setDocumentTypeId}
                        required
                      >
                        <SelectTrigger className={`${baseInputClassName} w-full`}>
                          <SelectValue placeholder="Selecciona un tipo" />
                        </SelectTrigger>
                        <SelectContent>
                          {docTypes.map((dt) => (
                            <SelectItem key={dt.id} value={dt.id}>
                              {dt.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="documentNumber" className={labelClassName}>Número de documento</Label>
                    <Input
                      id="documentNumber"
                      type="text"
                      value={documentNumber}
                      onChange={(e) => setDocumentNumber(e.target.value)}
                      required
                      placeholder="1002300455"
                      className={baseInputClassName}
                      disabled={loadingDocTypes || docTypesError !== null}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="phone" className={labelClassName}>Teléfono (Opcional)</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+57 300 123 4567"
                    className={baseInputClassName}
                  />
                </div>

                <div>
                  <Label htmlFor="address" className={labelClassName}>Dirección (Opcional)</Label>
                  <Input
                    id="address"
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Calle 123 #45-67"
                    className={baseInputClassName}
                  />
                </div>

                <div>
                  <Label htmlFor="password" className={labelClassName}>Contraseña</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      placeholder="••••••••"
                      className={passwordInputClassName}
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-green-600 cursor-pointer"
                      aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                <div>
                  <Label htmlFor="confirmPassword" className={labelClassName}>Confirmar contraseña</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      placeholder="••••••••"
                      className={passwordInputClassName}
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword((v) => !v)}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-green-600 cursor-pointer"
                      aria-label={showConfirmPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                    >
                      {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={loading || loadingDocTypes}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 mt-2 rounded-md shadow-md hover:shadow-lg transition-shadow focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creando cuenta...
                    </>
                  ) : (
                    'Registrarse'
                  )}
                </Button>
              </form>

              <p className="mt-6 text-center text-sm text-gray-600">
                ¿Ya tienes una cuenta?{' '}
                <a
                  href="/signin"
                  className="font-medium text-green-600 hover:text-green-500"
                >
                  Inicia sesión
                </a>
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}