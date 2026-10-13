alter table public.algarve_stay_requests
  add column if not exists paid boolean not null default false,
  add column if not exists amount numeric(12, 2),
  add column if not exists paid_at timestamptz;

create table if not exists public.algarve_stay_experiences (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null references public.algarve_stay_requests (id) on delete cascade,
  activity_id text not null,
  title text not null,
  experience_date date not null,
  people integer not null check (people between 1 and 16)
);

create table if not exists public.algarve_stay_hours (
  id uuid primary key default gen_random_uuid(),
  experience_id uuid not null references public.algarve_stay_experiences (id) on delete cascade,
  starts time not null,
  ends time not null,
  check (ends > starts)
);

create index if not exists algarve_stay_experiences_request_idx
  on public.algarve_stay_experiences (request_id);
create index if not exists algarve_stay_experiences_activity_idx
  on public.algarve_stay_experiences (activity_id);
create index if not exists algarve_stay_experiences_date_idx
  on public.algarve_stay_experiences (experience_date);

alter table public.algarve_stay_experiences enable row level security;
alter table public.algarve_stay_hours enable row level security;

create table if not exists public.algarve_admins (
  username text primary key,
  password_hash text not null,
  updated_at timestamptz not null default now()
);

alter table public.algarve_admins enable row level security;

insert into public.algarve_admins (username, password_hash)
values
  ('mcambaza', 'scrypt:208bde7720eaa8aa3bf4832c1c16e4fe:61d64e46493eb838ba75c843852d3ab4e5048c2db271172145652a27a0e86e6e'),
  ('bcabral', 'scrypt:da2202e6dd5493e8135c5b704debdfe8:78de944785d01abae81d66081f58680b97d5c91a187548e670c30215c634b0d6')
on conflict (username) do nothing;

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
  item jsonb;
  span jsonb;
  experience_id uuid;
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

  for item in select value from jsonb_array_elements(coalesce(p_lines, '[]'::jsonb))
  loop
    insert into public.algarve_stay_experiences (request_id, activity_id, title, experience_date, people)
    values (
      created.id,
      item->>'activityId',
      item->>'title',
      (item->>'date')::date,
      (item->>'people')::integer
    )
    returning id into experience_id;

    for span in select value from jsonb_array_elements(coalesce(item->'ranges', '[]'::jsonb))
    loop
      insert into public.algarve_stay_hours (experience_id, starts, ends)
      values (experience_id, (span->>'start')::time, (span->>'end')::time);
    end loop;
  end loop;

  return created;
end;
$$;

revoke all on function public.create_algarve_stay_request(text, text, text, text, jsonb) from public;
revoke all on function public.create_algarve_stay_request(text, text, text, text, jsonb) from anon;
revoke all on function public.create_algarve_stay_request(text, text, text, text, jsonb) from authenticated;
grant execute on function public.create_algarve_stay_request(text, text, text, text, jsonb) to service_role;
