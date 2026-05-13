'use client'

import type { EstimateLine } from '@/types'
import { berekenTotalen, formatEuro, regelPrijs } from '@/lib/utils'

interface Props {
  lines: EstimateLine[]
  onChange: (lines: EstimateLine[]) => void
}

const defaultLine: EstimateLine = {
  description: '',
  quantity: 1,
  unit: 'stuk',
  unit_price: 0,
  vat_rate: 21,
}

export default function RegelsTabel({ lines, onChange }: Props) {
  const { subtotal, vat_total, total } = berekenTotalen(lines)

  function updateLine(index: number, field: keyof EstimateLine, value: string | number) {
    const updated = lines.map((l, i) => i === index ? { ...l, [field]: value } : l)
    onChange(updated)
  }

  function removeLine(index: number) {
    onChange(lines.filter((_, i) => i !== index))
  }

  function addLine() {
    onChange([...lines, { ...defaultLine }])
  }

  const inputClass = 'w-full rounded border border-gray-200 px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#cc0000] bg-white'

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm min-w-[640px]">
          <thead className="bg-[#f5f5f5] border-b border-gray-200">
            <tr>
              <th className="text-left px-3 py-3 text-[#2d2d2d] font-semibold w-[35%]">Omschrijving</th>
              <th className="text-right px-3 py-3 text-[#2d2d2d] font-semibold w-[8%]">Aantal</th>
              <th className="text-center px-3 py-3 text-[#2d2d2d] font-semibold w-[10%]">Eenheid</th>
              <th className="text-right px-3 py-3 text-[#2d2d2d] font-semibold w-[13%]">Stukprijs</th>
              <th className="text-center px-3 py-3 text-[#2d2d2d] font-semibold w-[10%]">BTW%</th>
              <th className="text-right px-3 py-3 text-[#2d2d2d] font-semibold w-[13%]">Totaal</th>
              <th className="w-[6%]"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {lines.map((line, i) => (
              <tr key={i} className="hover:bg-[#f5f5f5]/30">
                <td className="px-3 py-2">
                  <input
                    className={inputClass}
                    value={line.description}
                    onChange={e => updateLine(i, 'description', e.target.value)}
                    placeholder="Omschrijving"
                  />
                </td>
                <td className="px-3 py-2">
                  <input
                    className={`${inputClass} text-right`}
                    type="number"
                    min="0"
                    step="0.5"
                    value={line.quantity}
                    onChange={e => updateLine(i, 'quantity', parseFloat(e.target.value) || 0)}
                  />
                </td>
                <td className="px-3 py-2">
                  <input
                    className={`${inputClass} text-center`}
                    value={line.unit}
                    onChange={e => updateLine(i, 'unit', e.target.value)}
                    placeholder="stuk"
                  />
                </td>
                <td className="px-3 py-2">
                  <input
                    className={`${inputClass} text-right`}
                    type="number"
                    min="0"
                    step="0.01"
                    value={line.unit_price}
                    onChange={e => updateLine(i, 'unit_price', parseFloat(e.target.value) || 0)}
                  />
                </td>
                <td className="px-3 py-2">
                  <select
                    className={`${inputClass} text-center`}
                    value={line.vat_rate}
                    onChange={e => updateLine(i, 'vat_rate', parseInt(e.target.value))}
                  >
                    <option value={0}>0%</option>
                    <option value={9}>9%</option>
                    <option value={21}>21%</option>
                  </select>
                </td>
                <td className="px-3 py-2 text-right font-medium text-[#1a1a1a]">
                  {formatEuro(regelPrijs(line))}
                </td>
                <td className="px-3 py-2 text-center">
                  <button
                    onClick={() => removeLine(i)}
                    className="text-gray-400 hover:text-red-600 transition-colors p-1"
                    title="Regel verwijderen"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
            {lines.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-6 text-center text-gray-400">
                  Geen regels. Klik op &quot;Regel toevoegen&quot; om te beginnen.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="border-t border-gray-200 px-4 py-3 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-0">
        <button
          onClick={addLine}
          className="text-sm text-[#cc0000] hover:text-[#aa0000] font-medium flex items-center gap-1 self-start"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 5v14M5 12h14" />
          </svg>
          Regel toevoegen
        </button>

        <div className="space-y-1 sm:text-right">
          <div className="flex justify-between sm:justify-end sm:gap-8 text-sm text-gray-600">
            <span>Subtotaal excl. BTW</span>
            <span className="sm:w-24 text-right">{formatEuro(subtotal)}</span>
          </div>
          <div className="flex justify-between sm:justify-end sm:gap-8 text-sm text-gray-600">
            <span>BTW</span>
            <span className="sm:w-24 text-right">{formatEuro(vat_total)}</span>
          </div>
          <div className="flex justify-between sm:justify-end sm:gap-8 text-base font-bold text-[#1a1a1a] pt-1 border-t border-gray-200 mt-1">
            <span>Totaal incl. BTW</span>
            <span className="sm:w-24 text-right">{formatEuro(total)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
