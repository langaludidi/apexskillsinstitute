-- Let an authenticated Apex administrator read only their own active role row.
-- This allows the bootstrap RPC to run with invoker rights instead of bypassing RLS.

create policy "apex admins read own active profile"
on public.apex_admin_users
for select
to authenticated
using (
  user_id = (select auth.uid())
  and is_active = true
  and lower(email) = lower(btrim(coalesce((select auth.jwt()) ->> 'email', '')))
);

alter function public.bootstrap_apex_admin() security invoker;
