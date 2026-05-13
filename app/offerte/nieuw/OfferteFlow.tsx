'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import type { ParsedEstimate, EstimateLine, CompanySettings, Customer } from '@/types'
import InputStap from '@/components/offerte/InputStap'
import KlantgegevensForm from '@/components/offerte/KlantgegevensForm'
import RegelsTabel from '@/components/offerte/RegelsTabel'
import Button from '@/components/ui/Button'
import { berekenTotalen, formatEuro } from '@/lib/utils'

const PdfPreview = dynamic(() => import('@/components/offerte/PdfPreview'), { ssr: false })

interface Props {
  settings: CompanySettings
}

type Stap = 1 | 2 | 3

const emptyCustomer: Customer = { name: '', email: '', address: '', phone: '' }

export default function OfferteFlow({ settings }: Props) {
  const [stap, setStap] = useState<Stap>(1)
  const [customer, setCustomer] = useState<Customer>(emptyCustomer)
  const [description, setDescription] = useState('')
  const [lines, setLines] = useState<EstimateLine[]>([])
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [savedId, setSavedId] = useState('')
  const [savedNumber, setSavedNumber] = useState('')
  const [saveError, setSaveError] = useState('')
  const [jorttSending, setJorttSending] = useState(false)
  const [jorttSent, setJorttSent] = useState(false)
  const [jorttError, setJorttError] = useState('')

  function handleParsed(result: ParsedEstimate) {
    setCustomer(result.customer)
    setDescription(result.description ?? '')
    setLines(result.lines)
    setStap(2)
  }

  async function handleOpslaan() {
    setSaving(true)
    setSaveError('')
    try {
      const res = await fetch('/api/estimates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customer, description, lines }),
      })
      const data = await res.json()
      if (!res.ok) {
        setSaveError(data.error ?? 'Opslaan mislukt.')
        setSaving(false)
        return
      }
      setSavedId(data.id)
      setSavedNumber(data.estimate_number)
      setSaved(true)
    } catch {
      setSaveError('Er is een fout opgetreden.')
    } finally {
      setSaving(false)
    }
  }

  async function handleVerstuurJortt() {
    setJorttSending(true)
    setJorttError('')
    try {
      const res = await fetch('/api/jortt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estimate_id: savedId }),
      })
      const data = await res.json()
      if (!res.ok) {
        setJorttError(data.error ?? 'Versturen naar Jortt mislukt.')
        return
      }
      setJorttSent(true)
    } catch {
      setJorttError('Er is een fout opgetreden bij het versturen naar Jortt.')
    } finally {
      setJorttSending(false)
    }
  }

  function resetFlow() {
    setStap(1)
    setCustomer(emptyCustomer)
    setDescription('')
    setLines([])
    setSaved(false)
    setSavedId('')
    setSavedNumber('')
    setSaveError('')
    setJorttSent(false)
    setJorttError('')
  }

  const { total } = berekenTotalen(lines)

  return (
    <div className="space-y-5">
      {/* Stap indicator */}
      <div className="flex items-center gap-2 sm:gap-3">
        {([1, 2, 3] as Stap[]).map((s) => (
          <div key={s} className="flex items-center gap-1.5 sm:gap-2">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
              stap === s ? 'bg-[#cc0000] text-white' : stap > s ? 'bg-[#2d2d2d] text-white' : 'bg-gray-200 text-gray-500'
            }`}>
              {stap > s ? '✓' : s}
            </div>
            <span className={`hidden sm:inline text-sm ${stap === s ? 'font-semibold text-[#2d2d2d]' : 'text-gray-400'}`}>
              {s === 1 ? 'Invoer' : s === 2 ? 'Controleren' : 'PDF'}
            </span>
            {s < 3 && <div className={`h-px w-4 sm:w-6 ${stap > s ? 'bg-[#2d2d2d]' : 'bg-gray-200'}`} />}
          </div>
        ))}
      </div>

      {/* Stap 1 */}
      {stap === 1 && (
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="text-base font-semibold text-[#2d2d2d] mb-4">Stap 1 — Klus invoeren</h2>
          <InputStap onParsed={handleParsed} />
        </div>
      )}

      {/* Stap 2 */}
      {stap === 2 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-[#2d2d2d]">Stap 2 — Controleer & pas aan</h2>
            <button onClick={() => setStap(1)} className="text-sm text-gray-500 hover:text-[#2d2d2d]">← Terug</button>
          </div>

          <KlantgegevensForm customer={customer} onChange={setCustomer} />

          {/* Omschrijving werkzaamheden */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="text-sm font-semibold text-[#2d2d2d] mb-1">Omschrijving werkzaamheden</h3>
            <p className="text-xs text-gray-500 mb-3">
              Één duidelijke zin over de uit te voeren werkzaamheden — wordt zichtbaar op de offerte.
            </p>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={3}
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-[#1a1a1a] focus:outline-none focus:ring-2 focus:ring-[#cc0000] resize-y"
              placeholder="Bijv. Vervangen bitumen dakbedekking plat dak inclusief isolatie, verwijdering oud materiaal en reiniging dakgoten."
            />
          </div>

          <RegelsTabel lines={lines} onChange={setLines} />

          <div className="flex flex-col sm:flex-row gap-3 justify-end pt-2">
            <Button variant="secondary" onClick={() => setStap(1)}>Terug</Button>
            <Button onClick={() => setStap(3)} disabled={lines.length === 0}>
              Naar PDF preview ({formatEuro(total)})
            </Button>
          </div>
        </div>
      )}

      {/* Stap 3 */}
      {stap === 3 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-[#2d2d2d]">Stap 3 — Preview & opslaan</h2>
            <button onClick={() => setStap(2)} className="text-sm text-gray-500 hover:text-[#2d2d2d]">← Terug</button>
          </div>

          {saved ? (
            <div className="bg-green-50 border border-green-200 rounded-xl p-5 text-center space-y-3">
              <div className="text-2xl">✓</div>
              <p className="font-semibold text-green-800">Offerte opgeslagen!</p>
              <p className="text-green-700 text-sm">Nummer: <strong>{savedNumber}</strong></p>
              {jorttSent ? (
                <p className="text-sm text-green-700 font-medium">Verstuurd naar Jortt.</p>
              ) : (
                <>
                  {jorttError && <p className="text-sm text-red-600">{jorttError}</p>}
                  <Button onClick={handleVerstuurJortt} loading={jorttSending} variant="secondary">
                    Verstuur naar Jortt
                  </Button>
                </>
              )}
              <div className="flex gap-3 justify-center pt-2">
                <Button onClick={resetFlow} variant="secondary">Nieuwe offerte</Button>
                <Button onClick={() => window.location.href = '/admin/offertes'}>Bekijk offertes</Button>
              </div>
            </div>
          ) : (
            <>
              <PdfPreview
                estimateNumber="CONCEPT"
                customer={customer}
                description={description}
                lines={lines}
                settings={settings}
              />
              {saveError && <p className="text-sm text-red-600">{saveError}</p>}
              <div className="flex flex-col sm:flex-row gap-3 justify-end">
                <Button variant="secondary" onClick={() => setStap(2)}>Terug</Button>
                <Button onClick={handleOpslaan} loading={saving}>Offerte opslaan</Button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}
