-- Hotfix: workspace insert fails with
--   null value in column "desk_type" of relation "workspaces" violates not-null constraint
-- A workspace is not one desk. Run this in the SQL editor (safe to re-run).

do $$
declare
  r record;
begin
  for r in
    select a.attname as col
    from pg_attribute a
    join pg_class c on c.oid = a.attrelid
    join pg_namespace n on n.oid = c.relnamespace
    where n.nspname = 'public'
      and c.relname = 'workspaces'
      and a.attnum > 0
      and not a.attisdropped
      and a.attnotnull
      and not a.atthasdef
      and coalesce(a.attidentity, '') = ''
      and a.attname not in ('id', 'user_id')
  loop
    execute format('alter table public.workspaces alter column %I drop not null', r.col);
  end loop;

  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'workspaces'
      and column_name = 'desk_type'
  ) then
    begin
      execute 'alter table public.workspaces alter column desk_type set default ''x''';
      execute 'update public.workspaces set desk_type = ''x'' where desk_type is null';
    exception
      when others then
        null;
    end;
  end if;
end $$;
