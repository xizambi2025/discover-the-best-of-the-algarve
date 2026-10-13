create table if not exists public.algarve_catalog (
  id text primary key,
  document jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.algarve_catalog enable row level security;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('catalog', 'catalog', true, 2621440, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do update
set public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "catalog public read" on storage.objects;
create policy "catalog public read"
on storage.objects for select
to public
using (bucket_id = 'catalog');
