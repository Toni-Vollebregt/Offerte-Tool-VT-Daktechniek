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
        <div className="max-w-6xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-y-2">
          <div className="flex items-center gap-3">
            <span className="text-xl font-bold tracking-tight">
              <span className="text-[#cc0000]">VT</span>
              <span className="text-[#1a1a1a]"> Daktechniek</span>
            </span>
            <span className="text-sm font-medium text-[#2d2d2d] hidden sm:inline">Admin</span>
          </div>
          <nav className="flex items-center gap-0.5 sm:gap-1">
            <Link href="/admin/instellingen" className="px-2 sm:px-3 py-1.5 rounded-lg text-xs sm:text-sm text-[#2d2d2d] hover:bg-[#f5f5f5] transition-colors">Instellingen</Link>
            <Link href="/admin/offertes" className="px-2 sm:px-3 py-1.5 rounded-lg text-xs sm:text-sm text-[#2d2d2d] hover:bg-[#f5f5f5] transition-colors">Offertes</Link>
            <Link href="/offerte/nieuw" className="ml-1 sm:ml-2 px-2 sm:px-3 py-1.5 rounded-lg text-xs sm:text-sm bg-[#cc0000] text-white hover:bg-[#aa0000] transition-colors whitespace-nowrap">Nieuwe offerte</Link>
          </nav>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-4 py-6">
        {children}
      </main>
    </div>
  )
}
