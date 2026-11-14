create or replace function public.get_admin_user_count()
returns bigint
language plpgsql
security definer
set search_path = public, auth, pg_temp
as $$
begin
  if coalesce(auth.jwt() -> 'app_metadata' ->> 'role', '') <> 'admin' then
    raise exception 'not authorized';
  end if;

  return (select count(*) from auth.users);
end;
$$;

revoke all on function public.get_admin_user_count() from public;
grant execute on function public.get_admin_user_count() to authenticated;
