'use client'

import type { Estimate } from '@/types'
import { formatEuro, formatDate } from '@/lib/utils'

interface Props {
  estimates: Estimate[]
}

const statusLabels: Record<string, string> = {
  concept: 'Concept',
  verzonden: 'Verzonden',
  geaccepteerd: 'Geaccepteerd',
  afgewezen: 'Afgewezen',
}

const statusColors: Record<string, string> = {
  concept: 'bg-gray-100 text-gray-700',
  verzonden: 'bg-blue-100 text-blue-700',
  geaccepteerd: 'bg-green-100 text-green-700',
  afgewezen: 'bg-red-100 text-red-700',
}

export default function OffertesList({ estimates }: Props) {
  if (estimates.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-10 text-center text-gray-400">
        Nog geen offertes opgeslagen.
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-[#f5f5f5] border-b border-gray-200">
          <tr>
            <th className="text-left px-4 py-3 font-semibold text-[#2d2d2d]">Nummer</th>
            <th className="text-left px-4 py-3 font-semibold text-[#2d2d2d] hidden sm:table-cell">Klant</th>
            <th className="text-right px-4 py-3 font-semibold text-[#2d2d2d]">Totaal</th>
            <th className="text-center px-4 py-3 font-semibold text-[#2d2d2d]">Status</th>
            <th className="text-right px-4 py-3 font-semibold text-[#2d2d2d] hidden md:table-cell">Datum</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {estimates.map(e => (
            <tr key={e.id} className="hover:bg-[#f5f5f5]/50">
              <td className="px-4 py-3 font-mono text-[#cc0000] font-medium">{e.estimate_number}</td>
              <td className="px-4 py-3 text-[#1a1a1a] hidden sm:table-cell">{e.customer_name || '—'}</td>
              <td className="px-4 py-3 text-right font-medium text-[#1a1a1a]">
                {e.total != null ? formatEuro(e.total) : '—'}
              </td>
              <td className="px-4 py-3 text-center">
                <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[e.status] ?? 'bg-gray-100 text-gray-700'}`}>
                  {statusLabels[e.status] ?? e.status}
                </span>
              </td>
              <td className="px-4 py-3 text-right text-gray-500 hidden md:table-cell">{formatDate(e.created_at)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
