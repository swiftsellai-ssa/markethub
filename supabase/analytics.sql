-- First-party funnel events. Run in Supabase SQL editor (safe to re-run).

create table if not exists public.analytics_events (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  path text,
  props jsonb not null default '{}'::jsonb,
  user_id uuid,
  created_at timestamptz not null default now()
);

create index if not exists analytics_events_created_at_idx
  on public.analytics_events (created_at desc);

create index if not exists analytics_events_name_idx
  on public.analytics_events (name);

alter table public.analytics_events enable row level security;

drop policy if exists "analytics_events_insert" on public.analytics_events;
create policy "analytics_events_insert"
  on public.analytics_events for insert
  with check (true);

grant insert on public.analytics_events to anon, authenticated;

create or replace function public.analytics_funnel(days integer default 7)
returns table (name text, n bigint)
language sql
stable
security definer
set search_path = public
as $$
  select e.name, count(*)::bigint
  from public.analytics_events e
  where e.created_at >= now() - make_interval(days => greatest(days, 1))
  group by e.name
  order by count(*) desc;
$$;

grant execute on function public.analytics_funnel(integer) to authenticated;
