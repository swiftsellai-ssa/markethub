-- Run in Supabase SQL Editor to fix: "Database error saving new user"
-- Step 1: see what is firing on auth.users
select
  tgname as trigger_name,
  pg_get_triggerdef(oid) as definition
from pg_trigger
where tgrelid = 'auth.users'::regclass
  and not tgisinternal;

-- Step 2: see function bodies named like handle_new_user
select
  n.nspname as schema,
  p.proname as function_name,
  pg_get_functiondef(p.oid) as definition
from pg_proc p
join pg_namespace n on n.oid = p.pronamespace
where p.proname ilike '%new_user%'
   or p.proname ilike '%handle_user%';

-- Step 3: nuclear unblock — remove ALL custom triggers on auth.users
-- (Auth will create users again. Workspace is created from the app on first login.)
do $$
declare
  r record;
begin
  for r in
    select t.tgname
    from pg_trigger t
    where t.tgrelid = 'auth.users'::regclass
      and not t.tgisinternal
  loop
    execute format('drop trigger if exists %I on auth.users', r.tgname);
  end loop;
end $$;

-- Optional: keep a safe trigger (won't block signup if insert fails)
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

-- Belt-and-suspenders: let auth admin insert even without definer
grant usage on schema public to supabase_auth_admin;
grant insert, select on table public.workspaces to supabase_auth_admin;

drop policy if exists "auth_admin_insert_workspaces" on public.workspaces;
create policy "auth_admin_insert_workspaces"
  on public.workspaces for insert
  to supabase_auth_admin
  with check (true);
