create table articles (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  unit text default 'stuk',
  unit_price numeric(10,2) not null,
  vat_rate integer default 21,
  category text default 'materiaal',
  active boolean default true,
  created_at timestamptz default now()
);

create table settings (
  id uuid primary key default gen_random_uuid(),
  key text unique not null,
  value text
);

create table estimates (
  id uuid primary key default gen_random_uuid(),
  estimate_number text unique not null,
  customer_name text,
  customer_email text,
  customer_address text,
  customer_phone text,
  description text,
  lines jsonb not null default '[]',
  subtotal numeric(10,2),
  vat_total numeric(10,2),
  total numeric(10,2),
  status text default 'concept',
  created_at timestamptz default now()
);

-- Settings seed voor VT Daktechniek
insert into settings (key, value) values
  ('company_name', 'VT Daktechniek'),
  ('company_address', 'Kwikstaartlaan 42'),
  ('company_city', '3704 GS Zeist'),
  ('company_phone', '06 18020530'),
  ('company_email', 'info@vtdaktechniek.nl'),
  ('company_kvk', '88694712'),
  ('company_btw', 'PLACEHOLDER_BTW'),
  ('company_iban', 'PLACEHOLDER_IBAN'),
  ('payment_term_days', '14'),
  ('jortt_client_id', ''),
  ('jortt_client_secret', '');
