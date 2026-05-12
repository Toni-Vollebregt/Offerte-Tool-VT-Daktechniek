import { NextRequest } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import type { EstimateLine } from '@/types'

export const dynamic = 'force-dynamic'

const JORTT_TOKEN_URL = 'https://app.jortt.nl/oauth-provider/token'
const JORTT_API_BASE = 'https://app.jortt.nl/api'

async function getJorttToken(clientId: string, clientSecret: string): Promise<string> {
  const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString('base64')
  const res = await fetch(JORTT_TOKEN_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${credentials}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Jortt OAuth mislukt (${res.status}): ${text}`)
  }

  const data = await res.json() as { access_token: string }
  return data.access_token
}

export async function POST(req: NextRequest) {
  try {
    const { estimate_id } = await req.json() as { estimate_id: string }

    const supabase = createServiceClient()

    const [{ data: estimate, error: estimateError }, { data: settingsRows }] = await Promise.all([
      supabase.from('estimates').select('*').eq('id', estimate_id).single(),
      supabase.from('settings').select('key, value').in('key', ['jortt_client_id', 'jortt_client_secret']),
    ])

    if (estimateError || !estimate) {
      return Response.json({ error: 'Offerte niet gevonden.' }, { status: 404 })
    }

    const settingsMap = Object.fromEntries(
      (settingsRows ?? []).map(r => [r.key, r.value ?? ''])
    )
    const clientId = settingsMap['jortt_client_id']
    const clientSecret = settingsMap['jortt_client_secret']

    if (!clientId || !clientSecret) {
      return Response.json(
        { error: 'Jortt client_id en client_secret zijn nog niet ingevuld in de instellingen.' },
        { status: 400 }
      )
    }

    const token = await getJorttToken(clientId, clientSecret)

    const lines = (estimate.lines as EstimateLine[]).map(line => ({
      description: line.description,
      amount: line.quantity,
      unit: line.unit,
      price_per_unit: line.unit_price,
      vat_percentage: line.vat_rate,
    }))

    const payload = {
      quotation: {
        customer: {
          name: estimate.customer_name ?? '',
          email: estimate.customer_email ?? '',
          address: estimate.customer_address ?? '',
          phone: estimate.customer_phone ?? '',
        },
        reference: estimate.estimate_number,
        description: estimate.description ?? '',
        lines,
      },
    }

    const jorttRes = await fetch(`${JORTT_API_BASE}/quotations`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    if (!jorttRes.ok) {
      const text = await jorttRes.text()
      throw new Error(`Jortt API fout (${jorttRes.status}): ${text}`)
    }

    const jorttData = await jorttRes.json()

    await supabase
      .from('estimates')
      .update({ status: 'verstuurd_jortt' })
      .eq('id', estimate_id)

    return Response.json({ success: true, jortt: jorttData })
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error('jortt route error:', msg)
    return Response.json({ error: msg }, { status: 500 })
  }
}
