'use client'

import Input from '@/components/ui/Input'
import type { Customer } from '@/types'

interface Props {
  customer: Customer
  onChange: (customer: Customer) => void
}

export default function KlantgegevensForm({ customer, onChange }: Props) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <h3 className="text-sm font-semibold text-[#2d2d2d] mb-4">Klantgegevens</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Naam"
          value={customer.name}
          onChange={e => onChange({ ...customer, name: e.target.value })}
          placeholder="Jan de Vries"
        />
        <Input
          label="Telefoonnummer"
          type="tel"
          value={customer.phone}
          onChange={e => onChange({ ...customer, phone: e.target.value })}
          placeholder="06 – 12 34 56 78"
        />
        <Input
          label="E-mailadres"
          type="email"
          value={customer.email}
          onChange={e => onChange({ ...customer, email: e.target.value })}
          placeholder="jan@voorbeeld.nl"
        />
        <Input
          label="Adres"
          value={customer.address}
          onChange={e => onChange({ ...customer, address: e.target.value })}
          placeholder="Straatnaam 1, 1234 AB Stad"
        />
      </div>
    </div>
  )
}
