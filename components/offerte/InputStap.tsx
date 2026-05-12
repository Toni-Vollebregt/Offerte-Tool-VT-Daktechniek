'use client'

import { useState, useRef } from 'react'
import type { ParsedEstimate } from '@/types'
import Button from '@/components/ui/Button'

interface Props {
  onParsed: (result: ParsedEstimate) => void
}

export default function InputStap({ onParsed }: Props) {
  const [tab, setTab] = useState<'tekst' | 'foto'>('tekst')
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  const template = `Klantgegevens:
Omschrijving:
Soort klus:
Werkzaamheden:
Materialen:
Arbeid:`

  async function handleAnalyse() {
    setError('')
    setLoading(true)
    try {
      let body: object
      if (tab === 'tekst') {
        if (!text.trim()) {
          setError('Voer een tekst in om te analyseren.')
          setLoading(false)
          return
        }
        body = { type: 'text', content: text }
      } else {
        const file = fileRef.current?.files?.[0]
        if (!file) {
          setError('Selecteer een afbeelding.')
          setLoading(false)
          return
        }
        const base64 = await toBase64(file)
        body = { type: 'image', content: base64, mediaType: file.type }
      }

      const res = await fetch('/api/parse-input', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error ?? 'Verwerking mislukt.')
        return
      }
      onParsed(data as ParsedEstimate)
    } catch {
      setError('Er is een fout opgetreden. Probeer opnieuw.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setTab('tekst')}
          className={`px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors ${
            tab === 'tekst'
              ? 'border-[#cc0000] text-[#cc0000]'
              : 'border-transparent text-gray-500 hover:text-[#2d2d2d]'
          }`}
        >
          Tekst invoer
        </button>
        <button
          onClick={() => setTab('foto')}
          className={`px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors ${
            tab === 'foto'
              ? 'border-[#cc0000] text-[#cc0000]'
              : 'border-transparent text-gray-500 hover:text-[#2d2d2d]'
          }`}
        >
          Foto / screenshot
        </button>
      </div>

      {tab === 'tekst' ? (
        <div className="space-y-3">
          <p className="text-sm text-gray-600">
            Vul uw klus-notities in of gebruik het template hieronder:
          </p>
          <button
            onClick={() => setText(template)}
            className="text-xs text-[#cc0000] hover:underline"
          >
            Laad template
          </button>
          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            rows={10}
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-[#1a1a1a] font-mono focus:outline-none focus:ring-2 focus:ring-[#cc0000] resize-y"
            placeholder={template}
          />
        </div>
      ) : (
        <div className="space-y-3">
          <p className="text-sm text-gray-600">
            Upload een foto of screenshot van uw notities of werkbon.
          </p>
          <label className="flex flex-col items-center justify-center w-full min-h-[160px] border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-[#cc0000] transition-colors bg-[#f5f5f5]">
            <div className="text-center p-6">
              <svg className="mx-auto mb-2 text-gray-400" width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-sm text-gray-500">Tik om een afbeelding te selecteren</p>
              <p className="text-xs text-gray-400 mt-1">JPG, PNG, WEBP</p>
            </div>
            <input
              ref={fileRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={() => setError('')}
            />
          </label>
          {fileRef.current?.files?.[0] && (
            <p className="text-sm text-gray-600">📎 {fileRef.current.files[0].name}</p>
          )}
        </div>
      )}

      {error && <p className="text-sm text-red-600">{error}</p>}

      <Button onClick={handleAnalyse} loading={loading} className="w-full sm:w-auto">
        Analyseer met AI
      </Button>
    </div>
  )
}

function toBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result as string
      resolve(result.split(',')[1])
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}
