-- Stripe billing columns for MarketsXHub workspaces
-- Run after supabase/schema.sql (safe to re-run)

alter table public.workspaces
  add column if not exists founding boolean not null default false,
  add column if not exists founding_until timestamptz,
  add column if not exists stripe_customer_id text,
  add column if not exists stripe_subscription_id text;

create index if not exists workspaces_stripe_customer_id_idx
  on public.workspaces (stripe_customer_id);

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
