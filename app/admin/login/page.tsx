'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const supabase = createClient()

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error: err } = await supabase.auth.signInWithPassword({ email, password })
    if (err) {
      setError('Inloggen mislukt. Controleer uw e-mailadres en wachtwoord.')
      setLoading(false)
      return
    }
    router.push('/admin/offertes')
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-[#f5f5f5] flex items-center justify-center px-4">
      <div className="bg-white rounded-xl border border-gray-200 p-8 w-full max-w-sm">
        <div className="flex justify-center mb-6">
          <span className="text-2xl font-bold tracking-tight">
            <span className="text-[#cc0000]">VT</span>
            <span className="text-[#1a1a1a]"> Daktechniek</span>
          </span>
        </div>
        <h1 className="text-xl font-semibold text-[#2d2d2d] text-center mb-6">Admin inloggen</h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <Input
            label="E-mailadres"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            autoComplete="email"
            required
          />
          <Input
            label="Wachtwoord"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <Button type="submit" loading={loading} className="w-full">Inloggen</Button>
        </form>
      </div>
    </div>
  )
}
