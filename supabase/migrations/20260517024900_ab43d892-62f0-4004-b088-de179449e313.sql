create table public.authorized_users (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  status text not null default 'active',
  plan text not null default 'annual',
  expires_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.authorized_users enable row level security;

create policy "Users can view own row"
on public.authorized_users
for select
to authenticated
using (auth.jwt() ->> 'email' = email);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger authorized_users_set_updated_at
before update on public.authorized_users
for each row execute function public.set_updated_at();