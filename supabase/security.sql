-- MarketsXHub security locks. Safe to re-run.
-- Run in the Supabase SQL editor AFTER the matching app deploy is live.
-- CREATE TABLE IF NOT EXISTS does not add columns to an existing table,
-- so this file adds any missing workspace columns first.

create table if not exists public.workspaces (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade unique
);

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

-- ---------------------------------------------------------------------------
-- Non-negative run counters
-- ---------------------------------------------------------------------------
update public.workspaces set x_runs_used = 0 where x_runs_used < 0;
update public.workspaces set seo_runs_used = 0 where seo_runs_used < 0;

alter table public.workspaces
  drop constraint if exists workspaces_x_runs_used_nonneg;
alter table public.workspaces
  add constraint workspaces_x_runs_used_nonneg check (x_runs_used >= 0);

alter table public.workspaces
  drop constraint if exists workspaces_seo_runs_used_nonneg;
alter table public.workspaces
  add constraint workspaces_seo_runs_used_nonneg check (seo_runs_used >= 0);

-- ---------------------------------------------------------------------------
-- Clients may edit content only. Billing/quota/stripe stay service-role.
-- ---------------------------------------------------------------------------
revoke insert, update, delete on public.workspaces from anon;
revoke update on public.workspaces from authenticated;

grant update (
  brand,
  strategy,
  research,
  posts,
  articles,
  queue_state,
  migrated_from_local,
  updated_at
) on public.workspaces to authenticated;

create or replace function public.workspaces_protect()
returns trigger
language plpgsql
as $$
declare
  privileged boolean;
begin
  privileged :=
    current_user in ('postgres', 'supabase_admin', 'supabase_auth_admin', 'service_role')
    or coalesce(auth.role(), '') = 'service_role';

  if pg_column_size(coalesce(new.brand, '{}'::jsonb)) > 65536 then
    raise exception 'brand too large';
  end if;
  if pg_column_size(coalesce(new.strategy, '{}'::jsonb)) > 65536 then
    raise exception 'strategy too large';
  end if;
  if pg_column_size(coalesce(new.research, '{}'::jsonb)) > 262144 then
    raise exception 'research too large';
  end if;
  if pg_column_size(coalesce(new.posts, '[]'::jsonb)) > 1048576 then
    raise exception 'posts too large';
  end if;
  if pg_column_size(coalesce(new.articles, '[]'::jsonb)) > 1048576 then
    raise exception 'articles too large';
  end if;
  if pg_column_size(coalesce(new.queue_state, '{}'::jsonb)) > 262144 then
    raise exception 'queue_state too large';
  end if;

  if tg_op = 'INSERT' and not privileged then
    if new.user_id is distinct from auth.uid() then
      raise exception 'workspaces: user_id must be the signed-in user'
        using errcode = '42501';
    end if;
    if coalesce(new.plan, 'free') is distinct from 'free'
       or coalesce(new.x_runs_used, 0) <> 0
       or coalesce(new.seo_runs_used, 0) <> 0
       or coalesce(new.founding, false) <> false
       or new.founding_until is not null
       or new.stripe_customer_id is not null
       or new.stripe_subscription_id is not null then
      raise exception 'workspaces: cannot set billing fields on insert'
        using errcode = '42501';
    end if;
    new.plan := 'free';
    new.x_runs_used := 0;
    new.seo_runs_used := 0;
    new.founding := false;
    new.stripe_customer_id := null;
    new.stripe_subscription_id := null;
    new.founding_until := null;
  end if;

  if tg_op = 'UPDATE' and not privileged then
    if new.id is distinct from old.id
       or new.user_id is distinct from old.user_id
       or new.plan is distinct from old.plan
       or new.founding is distinct from old.founding
       or new.founding_until is distinct from old.founding_until
       or new.stripe_customer_id is distinct from old.stripe_customer_id
       or new.stripe_subscription_id is distinct from old.stripe_subscription_id
       or new.x_runs_used is distinct from old.x_runs_used
       or new.seo_runs_used is distinct from old.seo_runs_used
       or new.billing_cycle_start is distinct from old.billing_cycle_start
       or new.created_at is distinct from old.created_at then
      raise exception 'workspaces: billing columns are read-only'
        using errcode = '42501';
    end if;
  end if;

  return new;
end;
$$;

drop trigger if exists workspaces_protect on public.workspaces;
create trigger workspaces_protect
  before insert or update on public.workspaces
  for each row execute function public.workspaces_protect();

-- ---------------------------------------------------------------------------
-- Close leftover quota RPCs to browser JWTs (skip if never created)
-- ---------------------------------------------------------------------------
do $$
begin
  if to_regprocedure('public.consume_bot_run(text)') is not null then
    execute 'revoke all on function public.consume_bot_run(text) from public, anon, authenticated';
    execute 'grant execute on function public.consume_bot_run(text) to service_role';
  end if;
  if to_regprocedure('public.refund_bot_run(text)') is not null then
    execute 'revoke all on function public.refund_bot_run(text) from public, anon, authenticated';
    execute 'grant execute on function public.refund_bot_run(text) to service_role';
  end if;
  if to_regprocedure('public.plan_limits(text)') is not null then
    execute 'revoke all on function public.plan_limits(text) from public, anon, authenticated';
  end if;
end $$;

-- ---------------------------------------------------------------------------
-- Analytics + founding leads: API / service role only
-- ---------------------------------------------------------------------------
do $$
begin
  if to_regclass('public.analytics_events') is not null then
    execute 'drop policy if exists "analytics_events_insert" on public.analytics_events';
    execute 'revoke insert, select, update, delete on public.analytics_events from anon, authenticated';
  end if;
  if to_regprocedure('public.analytics_funnel(integer)') is not null then
    execute 'revoke all on function public.analytics_funnel(integer) from public, anon, authenticated';
    execute 'grant execute on function public.analytics_funnel(integer) to service_role';
  end if;
  if to_regclass('public.founding_leads') is not null then
    execute 'drop policy if exists "founding_leads_insert" on public.founding_leads';
    execute 'revoke insert, select, update, delete on public.founding_leads from anon, authenticated';
  end if;
  if to_regprocedure('public.founding_seats_taken()') is not null then
    execute 'revoke all on function public.founding_seats_taken() from public, anon, authenticated';
    execute 'grant execute on function public.founding_seats_taken() to service_role';
  end if;
end $$;

-- ---------------------------------------------------------------------------
-- Rate limit counter (service role only)
-- ---------------------------------------------------------------------------
create table if not exists public.rate_limits (
  id text primary key,
  window_start timestamptz not null default now(),
  hits integer not null default 0
);

alter table public.rate_limits enable row level security;

create or replace function public.hit_rate_limit(
  p_key text,
  p_limit integer,
  p_window_seconds integer
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  rec public.rate_limits%rowtype;
begin
  if p_limit < 1 or p_window_seconds < 1 or p_key is null or length(p_key) = 0 or length(p_key) > 200 then
    return false;
  end if;

  insert into public.rate_limits (id, window_start, hits)
  values (p_key, now(), 0)
  on conflict (id) do nothing;

  select * into rec from public.rate_limits where id = p_key for update;

  if rec.window_start + make_interval(secs => p_window_seconds) <= now() then
    update public.rate_limits
      set window_start = now(), hits = 1
      where id = p_key;
    return true;
  end if;

  if rec.hits >= p_limit then
    return false;
  end if;

  update public.rate_limits set hits = hits + 1 where id = p_key;
  return true;
end;
$$;

revoke all on function public.hit_rate_limit(text, integer, integer) from public, anon, authenticated;
grant execute on function public.hit_rate_limit(text, integer, integer) to service_role;
grant all on table public.rate_limits to service_role;

-- Desk/Floor with no Stripe ids is leftover from before billing columns were locked.
update public.workspaces
set
  plan = 'free',
  founding = false,
  updated_at = now()
where plan in ('desk', 'floor')
  and stripe_subscription_id is null
  and stripe_customer_id is null;
