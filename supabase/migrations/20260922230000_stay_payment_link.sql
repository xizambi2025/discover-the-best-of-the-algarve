alter table algarve_stay_requests
  add column if not exists payment_link text,
  add column if not exists payment_link_at timestamptz;
