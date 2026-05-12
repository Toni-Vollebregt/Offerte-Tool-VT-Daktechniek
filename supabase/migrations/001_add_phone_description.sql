alter table estimates
  add column if not exists customer_phone text,
  add column if not exists description text;
