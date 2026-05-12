import { createClient } from '@/lib/supabase/server'
import OffertesList from '@/components/admin/OffertesList'
import type { Estimate } from '@/types'

export const dynamic = 'force-dynamic'

export default async function OffertesPage() {
  const supabase = await createClient()
  const { data: estimates } = await supabase
    .from('estimates')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div>
      <h1 className="text-xl font-semibold text-[#2d2d2d] mb-5">Offertes</h1>
      <OffertesList estimates={(estimates ?? []) as Estimate[]} />
    </div>
  )
}
