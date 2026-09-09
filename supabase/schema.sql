-- MarketsXHub: workspaces, founding leads, atomic quota RPC
-- Run in Supabase SQL editor once.

create extension if not exists "pgcrypto";

create table if not exists public.workspaces (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade unique,
  plan text not null default 'free' check (plan in ('free', 'desk', 'floor')),
  brand jsonb not null default '{}'::jsonb,
  strategy jsonb,
  research jsonb,
  posts jsonb not null default '[]'::jsonb,
  articles jsonb not null default '[]'::jsonb,
  queue_state jsonb,
  x_runs_used integer not null default 0,
  seo_runs_used integer not null default 0,
  billing_cycle_start date not null default (date_trunc('month', now())::date),
  migrated_from_local boolean not null default false,
  founding boolean not null default false,
  founding_until timestamptz,
  stripe_customer_id text,
  stripe_subscription_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- CREATE TABLE IF NOT EXISTS is a no-op on an older workspaces table.
alter table public.workspaces
  add column if not exists plan text not null default 'free',
  add column if not exists brand jsonb not null default '{}'::jsonb,
  add column if not exists strategy jsonb,
  add column if not exists research jsonb,
  add column if not exists posts jsonb not null default '[]'::jsonb,
  add column if not exists articles jsonb not null default '[]'::jsonb,
  add column if not exists queue_state jsonb,
  add column if not exists x_runs_used integer not null default 0,
  add column if not exists seo_runs_used integer not null default 0,
  add column if not exists billing_cycle_start date not null default (date_trunc('month', now())::date),
  add column if not exists migrated_from_local boolean not null default false,
  add column if not exists founding boolean not null default false,
  add column if not exists founding_until timestamptz,
  add column if not exists stripe_customer_id text,
  add column if not exists stripe_subscription_id text,
  add column if not exists created_at timestamptz not null default now(),
  add column if not exists updated_at timestamptz not null default now();

create table if not exists public.founding_leads (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  source text,
  created_at timestamptz not null default now()
);

alter table public.workspaces enable row level security;
alter table public.founding_leads enable row level security;

drop policy if exists "workspaces_select_own" on public.workspaces;
create policy "workspaces_select_own"
  on public.workspaces for select
  using (auth.uid() = user_id);

drop policy if exists "workspaces_update_own" on public.workspaces;
create policy "workspaces_update_own"
  on public.workspaces for update
  using (auth.uid() = user_id);

drop policy if exists "workspaces_insert_own" on public.workspaces;
create policy "workspaces_insert_own"
  on public.workspaces for insert
  with check (auth.uid() = user_id);

-- Insert-only for anonymous founding form (no select for public).
drop policy if exists "founding_leads_insert" on public.founding_leads;
create policy "founding_leads_insert"
  on public.founding_leads for insert
  with check (true);

-- SECURITY DEFINER + empty search_path so supabase_auth_admin signup
-- can write public.workspaces. Never raise — Auth must not roll back.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.workspaces (user_id)
  values (new.id)
  on conflict (user_id) do nothing;
  return new;
exception
  when others then
    raise warning 'marketsxhub handle_new_user: %', sqlerrm;
    return new;
end;
$$;

alter function public.handle_new_user() owner to postgres;

revoke all on function public.handle_new_user() from public;
grant execute on function public.handle_new_user() to supabase_auth_admin, postgres;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

grant usage on schema public to supabase_auth_admin;
grant insert, select on table public.workspaces to supabase_auth_admin;

drop policy if exists "auth_admin_insert_workspaces" on public.workspaces;
create policy "auth_admin_insert_workspaces"
  on public.workspaces for insert
  to supabase_auth_admin
  with check (true);

create or replace function public.plan_limits(p text)
returns table (x_limit integer, seo_limit integer)
language sql
immutable
as $$
  select case p
    when 'desk' then 90
    when 'floor' then 90
    else 7
  end,
  case p
    when 'desk' then 4
    when 'floor' then 30
    else 1
  end;
$$;

-- Atomically consume one bot run for the signed-in user.
-- Returns rows: allowed (bool), remaining_runs (int)
create or replace function public.consume_bot_run(target_desk text)
returns table (allowed boolean, remaining_runs integer)
language plpgsql
security definer
set search_path = public
as $$
declare
  uid uuid := auth.uid();
  ws public.workspaces%rowtype;
  limits record;
  used integer;
  lim integer;
  remaining integer;
begin
  if uid is null then
    return query select false, 0;
    return;
  end if;

  if target_desk not in ('x', 'seo') then
    return query select false, 0;
    return;
  end if;

  select * into ws
  from public.workspaces
  where user_id = uid
  for update;

  if not found then
    insert into public.workspaces (user_id)
    values (uid)
    returning * into ws;
  end if;

  -- Reset counters at the start of a new calendar month.
  if ws.billing_cycle_start < date_trunc('month', now())::date then
    update public.workspaces
    set
      x_runs_used = 0,
      seo_runs_used = 0,
      billing_cycle_start = date_trunc('month', now())::date,
      updated_at = now()
    where id = ws.id
    returning * into ws;
  end if;

  select * into limits from public.plan_limits(ws.plan);

  if target_desk = 'x' then
    used := ws.x_runs_used;
    lim := limits.x_limit;
  else
    used := ws.seo_runs_used;
    lim := limits.seo_limit;
  end if;

  remaining := greatest(lim - used, 0);
  if remaining <= 0 then
    return query select false, 0;
    return;
  end if;

  if target_desk = 'x' then
    update public.workspaces
    set x_runs_used = x_runs_used + 1, updated_at = now()
    where id = ws.id;
  else
    update public.workspaces
    set seo_runs_used = seo_runs_used + 1, updated_at = now()
    where id = ws.id;
  end if;

  return query select true, remaining - 1;
end;
$$;

grant usage on schema public to anon, authenticated;
grant select, insert, update on public.workspaces to authenticated;
grant insert on public.founding_leads to anon, authenticated;
grant execute on function public.consume_bot_run(text) to authenticated;

create or replace function public.founding_seats_taken()
returns integer
language sql
stable
security definer
set search_path = public
as $$
  select count(*)::integer from public.founding_leads;
$$;

grant execute on function public.founding_seats_taken() to anon, authenticated, service_role;

create or replace function public.refund_bot_run(target_desk text)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  uid uuid := auth.uid();
begin
  if uid is null then
    return;
  end if;
  if target_desk = 'x' then
    update public.workspaces
    set x_runs_used = greatest(x_runs_used - 1, 0), updated_at = now()
    where user_id = uid;
  elsif target_desk = 'seo' then
    update public.workspaces
    set seo_runs_used = greatest(seo_runs_used - 1, 0), updated_at = now()
    where user_id = uid;
  end if;
end;
$$;

grant execute on function public.refund_bot_run(text) to authenticated;
