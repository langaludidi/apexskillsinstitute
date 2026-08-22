-- Harden the Apex administration authentication boundary without replacing
-- Supabase Auth or the existing Apex role model.

create or replace function public.bootstrap_apex_admin()
returns table (user_id uuid, email text, roles public.apex_admin_role[])
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_uid uuid := auth.uid();
  v_email text := lower(btrim(coalesce(auth.jwt() ->> 'email', '')));
begin
  if v_uid is null then
    raise exception 'Authentication required' using errcode = '28000';
  end if;

  return query
  select a.user_id, a.email, a.roles
  from public.apex_admin_users as a
  where a.user_id = v_uid
    and lower(a.email) = v_email
    and a.is_active = true;

  if not found then
    raise exception 'This account is not authorised for Apex administration'
      using errcode = '42501';
  end if;
end;
$$;

revoke all on function public.bootstrap_apex_admin() from public, anon;
grant execute on function public.bootstrap_apex_admin() to authenticated;

-- These RPCs all enforce Apex administrator access internally. Removing the
-- inherited PUBLIC grant closes the anonymous API surface while preserving
-- access for authenticated administrators.
do $$
declare
  fn regprocedure;
begin
  for fn in
    select p.oid::regprocedure
    from pg_proc as p
    join pg_namespace as n on n.oid = p.pronamespace
    where n.nspname = 'public'
      and p.proname like 'learner_%'
      and p.proname <> 'learner_submit_application'
  loop
    execute format('revoke all on function %s from public, anon', fn);
    execute format('grant execute on function %s to authenticated', fn);
  end loop;
end;
$$;

revoke all on function private.is_apex_admin() from public, anon;
revoke all on function private.has_apex_admin_role(public.apex_admin_role[]) from public, anon;
grant execute on function private.is_apex_admin() to authenticated;
grant execute on function private.has_apex_admin_role(public.apex_admin_role[]) to authenticated;
