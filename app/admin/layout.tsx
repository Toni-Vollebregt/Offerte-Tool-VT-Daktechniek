import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xl font-bold tracking-tight">
              <span className="text-[#cc0000]">VT</span>
              <span className="text-[#1a1a1a]"> Daktechniek</span>
            </span>
            <span className="text-sm font-medium text-[#2d2d2d] hidden sm:inline">Admin</span>
          </div>
          <nav className="flex items-center gap-1">
            <Link href="/admin/instellingen" className="px-3 py-1.5 rounded-lg text-sm text-[#2d2d2d] hover:bg-[#f5f5f5] transition-colors">Instellingen</Link>
            <Link href="/admin/offertes" className="px-3 py-1.5 rounded-lg text-sm text-[#2d2d2d] hover:bg-[#f5f5f5] transition-colors">Offertes</Link>
            <Link href="/offerte/nieuw" className="ml-2 px-3 py-1.5 rounded-lg text-sm bg-[#cc0000] text-white hover:bg-[#aa0000] transition-colors">Nieuwe offerte</Link>
          </nav>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-4 py-6">
        {children}
      </main>
    </div>
  )
}
