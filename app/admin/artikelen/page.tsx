import { createClient } from '@/lib/supabase/server'
import ArtikelenPageClient from './ArtikelenPageClient'

export const dynamic = 'force-dynamic'

export default async function ArtikelenPage() {
  const supabase = await createClient()
  const { data: articles } = await supabase
    .from('articles')
    .select('*')
    .order('category')
    .order('name')

  return (
    <div>
      <h1 className="text-xl font-semibold text-[#2d2d2d] mb-5">Artikelen</h1>
      <ArtikelenPageClient initialArticles={articles ?? []} />
    </div>
  )
}
