-- Grant Floor to YOUR magic-link login so testing is not stuck on Free / FK errors.
-- 1) Run the SELECT and copy your email.
-- 2) Put that email in the INSERT below (and in Vercel INSIGHTS_ALLOWED_EMAILS).
-- Safe to re-run. Does not invent user_ids — only rows that exist in auth.users.

select id, email, created_at
from auth.users
order by created_at;

insert into public.workspaces (
  user_id,
  plan,
  x_runs_used,
  seo_runs_used,
  billing_cycle_start
)
select
  u.id,
  'floor',
  0,
  0,
  date_trunc('month', now())::date
from auth.users u
where lower(u.email) = lower('YOUR_LOGIN_EMAIL')
on conflict (user_id) do update
set
  plan = 'floor',
  founding = false,
  x_runs_used = 0,
  seo_runs_used = 0,
  billing_cycle_start = date_trunc('month', now())::date,
  updated_at = now();
