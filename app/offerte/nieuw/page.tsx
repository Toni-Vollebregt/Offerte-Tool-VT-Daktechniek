import OfferteFlow from './OfferteFlow'
import { createClient } from '@/lib/supabase/server'
import type { CompanySettings } from '@/types'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

const defaultSettings: CompanySettings = {
  company_name: 'VT Daktechniek',
  company_address: '',
  company_city: '',
  company_phone: '06 18020530',
  company_email: 'info@vtdaktechniek.nl',
  company_kvk: '',
  company_btw: '',
  company_iban: '',
  payment_term_days: '14',
  jortt_client_id: '',
  jortt_client_secret: '',
}

export default async function NieuweOffertePage() {
  const supabase = await createClient()
  const { data: rows } = await supabase.from('settings').select('key, value')

  const settings: CompanySettings = { ...defaultSettings }
  for (const row of rows ?? []) {
    if (row.key in settings) {
      (settings as Record<string, string>)[row.key] = row.value ?? ''
    }
  }

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <span className="text-xl font-bold tracking-tight">
            <span className="text-[#cc0000]">VT</span>
            <span className="text-[#1a1a1a]"> Daktechniek</span>
          </span>
          <Link href="/login" className="text-sm text-gray-500 hover:text-[#2d2d2d]">Admin</Link>
        </div>
      </header>
      <main className="max-w-4xl mx-auto px-4 py-6">
        <OfferteFlow settings={settings} />
      </main>
    </div>
  )
}
