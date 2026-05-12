import { NextRequest } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { berekenTotalen, generateEstimateNumber } from '@/lib/utils'
import type { EstimateLine, Customer } from '@/types'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as {
      customer: Customer
      description: string
      lines: EstimateLine[]
    }

    const { subtotal, vat_total, total } = berekenTotalen(body.lines)
    const estimate_number = generateEstimateNumber()

    const supabase = createServiceClient()
    const { data, error } = await supabase
      .from('estimates')
      .insert({
        estimate_number,
        customer_name: body.customer.name,
        customer_email: body.customer.email,
        customer_address: body.customer.address,
        customer_phone: body.customer.phone,
        description: body.description,
        lines: body.lines,
        subtotal,
        vat_total,
        total,
        status: 'concept',
      })
      .select()
      .single()

    if (error) {
      console.error('estimates insert error:', error)
      return Response.json({ error: 'Opslaan mislukt.' }, { status: 500 })
    }

    return Response.json(data)
  } catch (err) {
    console.error('estimates POST error:', err)
    return Response.json({ error: 'Onverwachte fout.' }, { status: 500 })
  }
}

export async function GET() {
  try {
    const supabase = createServiceClient()
    const { data, error } = await supabase
      .from('estimates')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      return Response.json({ error: 'Ophalen mislukt.' }, { status: 500 })
    }

    return Response.json(data)
  } catch (err) {
    console.error('estimates GET error:', err)
    return Response.json({ error: 'Onverwachte fout.' }, { status: 500 })
  }
}
