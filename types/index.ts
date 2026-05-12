export type Article = {
  id: string
  name: string
  description: string | null
  unit: string
  unit_price: number
  vat_rate: number
  category: string
  active: boolean
  created_at: string
}

export type Setting = {
  id: string
  key: string
  value: string | null
}

export type EstimateLine = {
  description: string
  quantity: number
  unit: string
  unit_price: number
  vat_rate: number
}

export type Customer = {
  name: string
  email: string
  address: string
  phone: string
}

export type Estimate = {
  id: string
  estimate_number: string
  customer_name: string | null
  customer_email: string | null
  customer_address: string | null
  customer_phone: string | null
  description: string | null
  lines: EstimateLine[]
  subtotal: number | null
  vat_total: number | null
  total: number | null
  status: string
  created_at: string
}

export type ParsedEstimate = {
  customer: Customer
  description: string
  lines: EstimateLine[]
  notes: string
}

export type CompanySettings = {
  company_name: string
  company_address: string
  company_city: string
  company_phone: string
  company_email: string
  company_kvk: string
  company_btw: string
  company_iban: string
  payment_term_days: string
  jortt_client_id: string
  jortt_client_secret: string
}
