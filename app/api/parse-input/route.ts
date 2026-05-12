import { NextRequest } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import type { ParsedEstimate } from '@/types'

export const dynamic = 'force-dynamic'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as
      | { type: 'text'; content: string }
      | { type: 'image'; content: string; mediaType: string }

    const systemPrompt = `Je bent een assistent voor een dakdekkersbedrijf in Nederland.
Je krijgt een notitie van een dakdekker over een klus.
Extraheer de informatie en geef ALLEEN een JSON object terug, zonder uitleg en zonder markdown backticks.

JSON structuur:
{
  "customer": { "name": "", "email": "", "address": "", "phone": "" },
  "description": "",
  "lines": [
    { "description": "Aangenomen werk", "quantity": 1, "unit": "project", "unit_price": 0, "vat_rate": 21 }
  ],
  "notes": ""
}

Regels voor het veld "description":
- Schrijf een uitgebreide Nederlandse omschrijving van alle werkzaamheden.
- Beschrijf concreet wat er gedaan wordt: welke materialen, welke handelingen, welke onderdelen van het dak.
- Meerdere zinnen zijn prima. Dit wordt zichtbaar op de offerte als omschrijving van de opdracht.
- Voorbeeld: "Het vervangen van de bestaande bitumen dakbedekking op het platte dak, inclusief het verwijderen van de oude dakbedekking en isolatie, het aanbrengen van nieuwe PIR-isolatieplaten 80mm, het leggen van een nieuwe 2-laagse bitumen dakbedekking, het reinigen en controleren van de dakgoten en afvoeren, en het netjes achterlaten van het werk."

Regels voor "lines":
- Geef ALTIJD precies één regel terug: { "description": "Aangenomen werk", "quantity": 1, "unit": "project", "unit_price": 0, "vat_rate": 21 }
- Vul NOOIT een prijs in — unit_price blijft altijd 0.
- Voeg GEEN extra regels toe voor materialen, arbeid of andere posten.

Houd alle tekst in het Nederlands.`

    let messageContent: Anthropic.MessageParam['content']

    if (body.type === 'text') {
      messageContent = body.content
    } else {
      messageContent = [
        {
          type: 'image',
          source: {
            type: 'base64',
            media_type: body.mediaType as 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp',
            data: body.content,
          },
        },
        {
          type: 'text',
          text: 'Analyseer deze afbeelding en extraheer de offertegegevens.',
        },
      ]
    }

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1000,
      system: systemPrompt,
      messages: [{ role: 'user', content: messageContent }],
    })

    const rawText = message.content[0].type === 'text' ? message.content[0].text : ''
    const cleaned = rawText.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim()
    const parsed: ParsedEstimate = JSON.parse(cleaned)

    return Response.json(parsed)
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error('parse-input error:', msg)
    return Response.json({ error: `Verwerking mislukt: ${msg}` }, { status: 500 })
  }
}
