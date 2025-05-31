'use client'

import { useSession } from 'next-auth/react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function ProfilePage() {
  const { data: session } = useSession()
  const [firstName, setFirstName] = useState(session?.user?.name?.split(' ')[0] || '')
  const [lastName, setLastName] = useState(session?.user?.name?.split(' ')[1] || '')
  const [email] = useState(session?.user?.email || '')
  const router = useRouter()

  const handleSave = async () => {
    // Llamada a tu API para actualizar perfil...
    // await fetch('/api/users/' + session.user.id, { method:'PUT', body: ... })
    router.refresh()
  }

  return (
    <div className="max-w-md mx-auto py-12">
      <h1 className="text-2xl font-bold text-green-800 mb-6">Mi Perfil</h1>
      <div className="space-y-4">
        <div>
          <Label>Nombre</Label>
          <Input value={firstName} onChange={e => setFirstName(e.target.value)} />
        </div>
        <div>
          <Label>Apellido</Label>
          <Input value={lastName} onChange={e => setLastName(e.target.value)} />
        </div>
        <div>
          <Label>Correo (no editable)</Label>
          <Input value={email} disabled />
        </div>
        <Button onClick={handleSave}>Guardar cambios</Button>
      </div>
    </div>
  )
}
