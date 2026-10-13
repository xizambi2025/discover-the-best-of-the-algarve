create table public.algarve_request_counters (
  year integer primary key,
  last_number integer not null
);

create table public.algarve_stay_requests (
  id uuid primary key default gen_random_uuid(),
  ref text not null unique,
  created_at timestamptz not null default now(),
  name text not null,
  email text not null,
  phone text not null,
  notes text not null default '',
  lines jsonb not null
);

alter table public.algarve_request_counters enable row level security;
alter table public.algarve_stay_requests enable row level security;

create or replace function public.create_algarve_stay_request(
  p_name text,
  p_email text,
  p_phone text,
  p_notes text,
  p_lines jsonb
) returns public.algarve_stay_requests
language plpgsql
security definer
set search_path = public
as $$
declare
  y integer := extract(year from (now() at time zone 'Europe/Lisbon'))::integer;
  n integer;
  created public.algarve_stay_requests;
begin
  insert into public.algarve_request_counters as c (year, last_number)
  values (y, 1)
  on conflict (year) do update
    set last_number = c.last_number + 1
  returning last_number into n;

  insert into public.algarve_stay_requests (ref, name, email, phone, notes, lines)
  values (
    'DSCALG-' || y::text || '-' || lpad(n::text, 3, '0'),
    p_name,
    p_email,
    p_phone,
    coalesce(p_notes, ''),
    p_lines
  )
  returning * into created;

  return created;
end;
$$;

revoke all on function public.create_algarve_stay_request(text, text, text, text, jsonb) from public;
revoke all on function public.create_algarve_stay_request(text, text, text, text, jsonb) from anon;
revoke all on function public.create_algarve_stay_request(text, text, text, text, jsonb) from authenticated;
grant execute on function public.create_algarve_stay_request(text, text, text, text, jsonb) to service_role;
