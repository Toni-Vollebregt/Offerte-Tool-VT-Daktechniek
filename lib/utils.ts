import type { EstimateLine } from '@/types'

export function berekenTotalen(lines: EstimateLine[]) {
  let subtotal = 0
  let vat_total = 0
  for (const line of lines) {
    const regelprijs = line.quantity * line.unit_price
    const btw = regelprijs * (line.vat_rate / 100)
    subtotal += regelprijs
    vat_total += btw
  }
  return {
    subtotal: Math.round(subtotal * 100) / 100,
    vat_total: Math.round(vat_total * 100) / 100,
    total: Math.round((subtotal + vat_total) * 100) / 100,
  }
}

export function regelPrijs(line: EstimateLine): number {
  return Math.round(line.quantity * line.unit_price * 100) / 100
}

export function formatEuro(amount: number): string {
  return '€ ' + amount.toFixed(2).replace('.', ',')
}

export function generateEstimateNumber(): string {
  const now = new Date()
  const year = now.getFullYear()
  const rand = Math.floor(Math.random() * 9000) + 1000
  return `OFF-${year}-${rand}`
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('nl-NL', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

export function addDays(date: Date, days: number): Date {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}
