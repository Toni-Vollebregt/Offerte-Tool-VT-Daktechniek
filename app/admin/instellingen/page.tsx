import { createClient } from '@/lib/supabase/server'
import InstellingenForm from '@/components/admin/InstellingenForm'
import type { CompanySettings } from '@/types'

export const dynamic = 'force-dynamic'

const defaultSettings: CompanySettings = {
  company_name: '',
  company_address: '',
  company_city: '',
  company_phone: '',
  company_email: '',
  company_kvk: '',
  company_btw: '',
  company_iban: '',
  payment_term_days: '14',
  jortt_client_id: '',
  jortt_client_secret: '',
}

export default async function InstellingenPage() {
  const supabase = await createClient()
  const { data: rows } = await supabase.from('settings').select('key, value')

  const settings: CompanySettings = { ...defaultSettings }
  for (const row of rows ?? []) {
    if (row.key in settings) {
      (settings as Record<string, string>)[row.key] = row.value ?? ''
    }
  }

  return (
    <div>
      <h1 className="text-xl font-semibold text-[#2d2d2d] mb-5">Instellingen</h1>
      <InstellingenForm settings={settings} />
    </div>
  )
}
