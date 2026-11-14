-- Keep book-specific badges synchronized with the user's current read status.
-- This migration is additive and replaces the award-only trigger from the
-- previous migration with a trigger that also removes stale book badges.

update public.badge_definitions
set icon = '/badges/konfrontacja.svg'
where id = 'konfrontacja';

create or replace function public.sync_badges_for_read_book()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.is_read = true then
    insert into public.user_badges (user_id, badge_id)
    select new.user_id, definition.id
    from public.badge_definitions as definition
    where definition.book_id = new.book_id
    on conflict (user_id, badge_id) do nothing;
  else
    delete from public.user_badges as user_badge
    using public.badge_definitions as definition
    where user_badge.user_id = new.user_id
      and user_badge.badge_id = definition.id
      and definition.book_id = new.book_id;
  end if;

  return new;
end;
$$;

revoke all on function public.sync_badges_for_read_book() from public, anon, authenticated;

drop trigger if exists award_badges_after_read_book on public.user_book_status;
drop trigger if exists sync_badges_after_read_book on public.user_book_status;

create trigger sync_badges_after_read_book
after insert or update of is_read on public.user_book_status
for each row
execute function public.sync_badges_for_read_book();
