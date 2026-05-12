# Start prompt — Demo Dak Offerte Tool

Lees eerst `CLAUDE.md` volledig door. Dat is je referentie voor de hele build.

---

## Opdracht

Bouw de Demo Dak offerte tool volgens CLAUDE.md. Werk de buildvolgorde stap voor stap af.

---

## Stap 1 — Project initialiseren

```bash
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir=false --import-alias="@/*"
```

Installeer packages:
```bash
npm install @supabase/supabase-js @supabase/ssr @anthropic-ai/sdk @react-pdf/renderer lucide-react
npm install -D @types/node
```

---

## Stap 2 — Supabase schema

Maak `supabase/schema.sql` aan met de drie tabellen en seed data uit CLAUDE.md.

---

## Stap 3 — Mappenstructuur

Zet alle mappen en lege bestanden op zoals beschreven in CLAUDE.md voordat je begint met invullen.

---

## Stap 4 — Build

Werk de 13 stappen uit de buildvolgorde in CLAUDE.md af.

### Specifieke aandachtspunten:

**Vercel compatibiliteit:**
- Gebruik `export const dynamic = 'force-dynamic'` op API routes die Supabase aanroepen
- Geen `fs` of Node.js-only modules in client components
- `@react-pdf/renderer` alleen in client components met `dynamic(() => import(...), { ssr: false })`

**AI parsing:**
- Anthropic API key alleen server-side — nooit in client components of NEXT_PUBLIC_ variabelen
- Parse de JSON response defensief: strip eventuele markdown backticks voor `JSON.parse()`

**BTW berekeningen:**
- Altijd berekenen als: `regelprijs = quantity * unit_price`, `btw = regelprijs * (vat_rate / 100)`
- Totaal incl. BTW = subtotaal + btw_totaal
- Afgerond op 2 decimalen, weergegeven met `€` prefix en Nederlandse notatie (komma als decimaalteken)

**PDF preview:**
- `@react-pdf/renderer` werkt niet met SSR — gebruik `dynamic import` met `ssr: false`
- PDF renderen via `<PDFViewer>` voor preview, `<PDFDownloadLink>` voor download knop

**Admin auth:**
- `app/admin/layout.tsx` checkt Supabase sessie server-side
- Redirect naar `/admin/login` als geen sessie
- Maak ook `/admin/login/page.tsx` met email/password formulier

---

## Visuele stijl

De tool is voor een vakman op de bouwplaats — mobielvriendelijk en direct bruikbaar.

- Achtergrond: wit (`#ffffff`) en lichtgrijs (`#f5f5f5`) — strak en clean
- Primaire accentkleur: rood (`#cc0000`) — past bij Demo Dak logo
- Secundair: antraciet (`#2d2d2d`) voor koppen, borders, iconen
- Tekst: bijna-zwart (`#1a1a1a`)
- Font: Inter (standaard Next.js)
- Logo: `public/logo.png` (PNG met transparante achtergrond) — gebruik in header van de tool en linksboven op de PDF
- UI: clean, weinig afleidingen, grote touch targets op mobiel
- Stappen visueel duidelijk gescheiden (stap 1 → 2 → 3)
- Foutmeldingen in het Nederlands

---

## Oplevering

Zorg dat het project draait met:
```bash
npm run dev
```

En bouw klaar is voor Vercel deploy zonder extra configuratie:
```bash
npm run build
```

Maak ook aan:
- `.env.example` met alle variabelen (lege waarden)
- `README.md` met: lokale setup, Supabase project aanmaken, Vercel deploy instructies
