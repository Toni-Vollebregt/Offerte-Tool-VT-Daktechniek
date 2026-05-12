# Demo Dak — Offerte Tool

Offerte-tool voor dakdekkersbedrijf Demo Dak. Gebouwd als SaaS-product door Scorpio Agents.

## Functionaliteiten

- 3-stappen offerteflow (invoer → controleren → PDF)
- AI-parsing van tekst en foto's (Anthropic Claude)
- A4 PDF-preview en download
- Admin portal: artikelen CRUD, bedrijfsinstellingen, offertehistorie
- Supabase authenticatie voor admin

## Lokale setup

**1. Repository klonen en afhankelijkheden installeren:**

```bash
git clone <repo-url>
cd demo-dak
npm install
```

**2. Omgevingsvariabelen instellen:**

```bash
cp .env.example .env.local
```

Vul de variabelen in `.env.local` in (zie stap 3 en 4).

**3. Supabase project aanmaken:**

1. Ga naar [supabase.com](https://supabase.com) en maak een nieuw project aan.
2. Ga naar **SQL Editor** en voer het schema uit:
   ```
   supabase/schema.sql
   ```
3. Ga naar **Settings → API** en kopieer:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role secret` key → `SUPABASE_SERVICE_ROLE_KEY`
4. Maak een admin gebruiker aan via **Authentication → Users → Invite user**.

**4. Anthropic API key:**

Haal een API key op via [console.anthropic.com](https://console.anthropic.com) en zet deze in `ANTHROPIC_API_KEY`.

**5. Development server starten:**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Vercel deploy

1. Koppel de repository aan Vercel.
2. Stel de environment variables in via **Settings → Environment Variables**:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `ANTHROPIC_API_KEY`
3. Deploy. Geen extra configuratie nodig.

## Hergebruik voor andere klanten (Scorpio Agents)

Per nieuwe klant:
1. Clone deze repository.
2. Maak een nieuw Supabase project aan en voer het schema uit.
3. Pas de seed data aan (`supabase/schema.sql`).
4. Maak een nieuwe Vercel deployment aan.
5. Stel de environment variables in.

Geen klantspecifieke waarden in de code — alleen in de database en omgevingsvariabelen.
