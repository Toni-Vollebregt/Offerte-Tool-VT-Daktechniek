'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { CompanySettings } from '@/types'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

interface Props {
  settings: CompanySettings
}

export default function InstellingenForm({ settings }: Props) {
  const [form, setForm] = useState<CompanySettings>(settings)
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')
  const supabase = createClient()

  async function handleSave() {
    setLoading(true)
    setError('')
    setSaved(false)
    const entries = Object.entries(form) as [string, string][]
    for (const [key, value] of entries) {
      const { error: err } = await supabase
        .from('settings')
        .upsert({ key, value }, { onConflict: 'key' })
      if (err) {
        setError('Opslaan mislukt.')
        setLoading(false)
        return
      }
    }
    setLoading(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="space-y-6 max-w-lg">
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h2 className="text-base font-semibold text-[#2d2d2d] mb-5">Bedrijfsgegevens</h2>
        <div className="space-y-4">
          <Input label="Bedrijfsnaam" value={form.company_name} onChange={e => setForm(f => ({ ...f, company_name: e.target.value }))} />
          <Input label="Adres" value={form.company_address} onChange={e => setForm(f => ({ ...f, company_address: e.target.value }))} />
          <Input label="Postcode + plaats" value={form.company_city} onChange={e => setForm(f => ({ ...f, company_city: e.target.value }))} />
          <Input label="Telefoonnummer" value={form.company_phone} onChange={e => setForm(f => ({ ...f, company_phone: e.target.value }))} />
          <Input label="E-mailadres" type="email" value={form.company_email} onChange={e => setForm(f => ({ ...f, company_email: e.target.value }))} />
          <Input label="KvK-nummer" value={form.company_kvk} onChange={e => setForm(f => ({ ...f, company_kvk: e.target.value }))} />
          <Input label="BTW-nummer" value={form.company_btw} onChange={e => setForm(f => ({ ...f, company_btw: e.target.value }))} />
          <Input label="IBAN" value={form.company_iban} onChange={e => setForm(f => ({ ...f, company_iban: e.target.value }))} />
          <Input label="Betaaltermijn (dagen)" type="number" value={form.payment_term_days} onChange={e => setForm(f => ({ ...f, payment_term_days: e.target.value }))} />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h2 className="text-base font-semibold text-[#2d2d2d] mb-1">Jortt koppeling</h2>
        <p className="text-xs text-gray-500 mb-4">
          OAuth2 client_credentials voor het doorsturen van offertes naar Jortt. Vind je credentials via Mijn Jortt → Koppelingen.
        </p>
        <div className="space-y-4">
          <Input label="Client ID" value={form.jortt_client_id} onChange={e => setForm(f => ({ ...f, jortt_client_id: e.target.value }))} placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx" />
          <Input label="Client Secret" type="password" value={form.jortt_client_secret} onChange={e => setForm(f => ({ ...f, jortt_client_secret: e.target.value }))} placeholder="••••••••••••••••" />
        </div>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}
      {saved && <p className="text-sm text-green-600">Instellingen opgeslagen.</p>}
      <Button onClick={handleSave} loading={loading}>Opslaan</Button>
    </div>
  )
}
