'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Article } from '@/types'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

interface Props {
  articles: Article[]
  onRefresh: () => void
}

const emptyForm = {
  name: '',
  description: '',
  unit: 'stuk',
  unit_price: '',
  vat_rate: '21',
  category: 'materiaal',
}

export default function ArtikelenForm({ articles, onRefresh }: Props) {
  const [form, setForm] = useState(emptyForm)
  const [editId, setEditId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const supabase = createClient()

  function startEdit(article: Article) {
    setEditId(article.id)
    setForm({
      name: article.name,
      description: article.description ?? '',
      unit: article.unit,
      unit_price: String(article.unit_price),
      vat_rate: String(article.vat_rate),
      category: article.category,
    })
  }

  function cancelEdit() {
    setEditId(null)
    setForm(emptyForm)
    setError('')
  }

  async function handleSave() {
    if (!form.name || !form.unit_price) {
      setError('Naam en stukprijs zijn verplicht.')
      return
    }
    setLoading(true)
    setError('')
    const data = {
      name: form.name,
      description: form.description || null,
      unit: form.unit,
      unit_price: parseFloat(form.unit_price),
      vat_rate: parseInt(form.vat_rate),
      category: form.category,
    }
    if (editId) {
      const { error: err } = await supabase.from('articles').update(data).eq('id', editId)
      if (err) { setError('Opslaan mislukt.'); setLoading(false); return }
    } else {
      const { error: err } = await supabase.from('articles').insert(data)
      if (err) { setError('Toevoegen mislukt.'); setLoading(false); return }
    }
    setLoading(false)
    cancelEdit()
    onRefresh()
  }

  async function handleToggle(article: Article) {
    await supabase.from('articles').update({ active: !article.active }).eq('id', article.id)
    onRefresh()
  }

  async function handleDelete(id: string) {
    if (!confirm('Artikel verwijderen?')) return
    await supabase.from('articles').delete().eq('id', id)
    onRefresh()
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h2 className="text-base font-semibold text-[#2d2d2d] mb-4">
          {editId ? 'Artikel bewerken' : 'Nieuw artikel'}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input label="Naam" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Bitumen dakbedekking" />
          <Input label="Omschrijving" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Optioneel" />
          <Input label="Eenheid" value={form.unit} onChange={e => setForm(f => ({ ...f, unit: e.target.value }))} placeholder="stuk / m² / uur" />
          <Input label="Stukprijs excl. BTW (€)" type="number" step="0.01" value={form.unit_price} onChange={e => setForm(f => ({ ...f, unit_price: e.target.value }))} placeholder="0,00" />
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-[#2d2d2d]">BTW%</label>
            <select
              value={form.vat_rate}
              onChange={e => setForm(f => ({ ...f, vat_rate: e.target.value }))}
              className="rounded-lg border border-gray-300 px-3 py-2.5 text-sm min-h-[44px] focus:outline-none focus:ring-2 focus:ring-[#cc0000]"
            >
              <option value="0">0%</option>
              <option value="9">9%</option>
              <option value="21">21%</option>
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-[#2d2d2d]">Categorie</label>
            <select
              value={form.category}
              onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
              className="rounded-lg border border-gray-300 px-3 py-2.5 text-sm min-h-[44px] focus:outline-none focus:ring-2 focus:ring-[#cc0000]"
            >
              <option value="materiaal">Materiaal</option>
              <option value="arbeid">Arbeid</option>
              <option value="overig">Overig</option>
            </select>
          </div>
        </div>
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
        <div className="mt-4 flex gap-3">
          <Button onClick={handleSave} loading={loading}>
            {editId ? 'Opslaan' : 'Toevoegen'}
          </Button>
          {editId && (
            <Button variant="secondary" onClick={cancelEdit}>Annuleren</Button>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-[#f5f5f5] border-b border-gray-200">
            <tr>
              <th className="text-left px-4 py-3 text-[#2d2d2d] font-semibold">Naam</th>
              <th className="text-left px-4 py-3 text-[#2d2d2d] font-semibold hidden sm:table-cell">Eenheid</th>
              <th className="text-right px-4 py-3 text-[#2d2d2d] font-semibold">Prijs</th>
              <th className="text-center px-4 py-3 text-[#2d2d2d] font-semibold hidden sm:table-cell">BTW</th>
              <th className="text-left px-4 py-3 text-[#2d2d2d] font-semibold hidden md:table-cell">Cat.</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {articles.map(article => (
              <tr key={article.id} className={article.active ? '' : 'opacity-50'}>
                <td className="px-4 py-3 text-[#1a1a1a]">{article.name}</td>
                <td className="px-4 py-3 text-gray-600 hidden sm:table-cell">{article.unit}</td>
                <td className="px-4 py-3 text-right text-[#1a1a1a]">€ {Number(article.unit_price).toFixed(2)}</td>
                <td className="px-4 py-3 text-center text-gray-600 hidden sm:table-cell">{article.vat_rate}%</td>
                <td className="px-4 py-3 text-gray-600 hidden md:table-cell">{article.category}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-2 justify-end">
                    <button onClick={() => startEdit(article)} className="text-xs px-2 py-1 rounded border border-gray-300 hover:bg-gray-50 text-[#2d2d2d]">Bewerk</button>
                    <button onClick={() => handleToggle(article)} className="text-xs px-2 py-1 rounded border border-gray-300 hover:bg-gray-50 text-[#2d2d2d]">
                      {article.active ? 'Deactiv.' : 'Activ.'}
                    </button>
                    <button onClick={() => handleDelete(article.id)} className="text-xs px-2 py-1 rounded border border-red-200 hover:bg-red-50 text-red-700">Verwijder</button>
                  </div>
                </td>
              </tr>
            ))}
            {articles.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-gray-400">Geen artikelen gevonden.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
