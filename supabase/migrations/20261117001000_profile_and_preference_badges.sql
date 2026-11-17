alter table public.badge_definitions
  add column if not exists trigger_type text;

alter table public.badge_definitions
  alter column book_id drop not null;

update public.badge_definitions
set trigger_type = 'book_read'
where trigger_type is null;

alter table public.badge_definitions
  alter column trigger_type set default 'book_read',
  alter column trigger_type set not null;

insert into public.badge_definitions (id, name, description, icon, book_id, trigger_type)
values
  ('pierwszy-krok', 'Pierwszy krok', 'Założono konto w Mrozoversum.', '/badges/odkryte-drzwi.png', null, 'account_created'),
  ('biblioteka-serca', 'Biblioteka serca', 'Dodano książkę do ulubionych.', '/badges/ulubiona-ksiazka.png', null, 'favorite_book'),
  ('wlasny-portret', 'Własny portret', 'Ustawiono własne zdjęcie lub awatar postaci.', '/badges/wybrany-avatar.png', null, 'avatar_set')
on conflict (id) do update set
  name = excluded.name,
  description = excluded.description,
  icon = excluded.icon,
  book_id = excluded.book_id,
  trigger_type = excluded.trigger_type;

insert into public.user_badges (user_id, badge_id)
select users.id, definition.id
from auth.users as users
cross join public.badge_definitions as definition
where definition.trigger_type = 'account_created'
on conflict (user_id, badge_id) do nothing;

update public.badge_definitions
set name = 'Mroźne AVENGERS',
    icon = '/badges/konfrontacja.png',
    description = 'Przeczytano książkę, która łączy wszystkie serie Mrozoversum.'
where id = 'konfrontacja';

insert into public.user_badges (user_id, badge_id)
select users.id, definition.id
from auth.users as users
cross join public.badge_definitions as definition
where definition.trigger_type = 'avatar_set'
  and nullif(users.raw_user_meta_data ->> 'avatar_url', '') is not null
on conflict (user_id, badge_id) do nothing;

insert into public.user_badges (user_id, badge_id)
select distinct status.user_id, definition.id
from public.user_book_status as status
cross join public.badge_definitions as definition
where status.is_favorite = true
  and definition.trigger_type = 'favorite_book'
on conflict (user_id, badge_id) do nothing;

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
    where definition.trigger_type = 'book_read'
      and definition.book_id = new.book_id
    on conflict (user_id, badge_id) do nothing;
  else
    delete from public.user_badges as user_badge
    using public.badge_definitions as definition
    where user_badge.user_id = new.user_id
      and user_badge.badge_id = definition.id
      and definition.trigger_type = 'book_read'
      and definition.book_id = new.book_id;
  end if;

  if new.is_favorite = true then
    insert into public.user_badges (user_id, badge_id)
    select new.user_id, definition.id
    from public.badge_definitions as definition
    where definition.trigger_type = 'favorite_book'
    on conflict (user_id, badge_id) do nothing;
  elsif not exists (
    select 1 from public.user_book_status
    where user_id = new.user_id and is_favorite = true
  ) then
    delete from public.user_badges as user_badge
    using public.badge_definitions as definition
    where user_badge.user_id = new.user_id
      and user_badge.badge_id = definition.id
      and definition.trigger_type = 'favorite_book';
  end if;

  return new;
end;
$$;

revoke all on function public.sync_badges_for_read_book() from public, anon, authenticated;
drop trigger if exists sync_badges_after_read_book on public.user_book_status;
create trigger sync_badges_after_read_book
after insert or update of is_read, is_favorite on public.user_book_status
for each row execute function public.sync_badges_for_read_book();

create or replace function public.award_account_created_badge()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.user_badges (user_id, badge_id)
  select new.id, definition.id
  from public.badge_definitions as definition
  where definition.trigger_type = 'account_created'
  on conflict (user_id, badge_id) do nothing;
  return new;
end;
$$;

revoke all on function public.award_account_created_badge() from public, anon, authenticated;
drop trigger if exists award_account_created_badge on auth.users;
create trigger award_account_created_badge
after insert on auth.users
for each row execute function public.award_account_created_badge();

create or replace function public.sync_avatar_badge()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if nullif(new.raw_user_meta_data ->> 'avatar_url', '') is not null then
    insert into public.user_badges (user_id, badge_id)
    select new.id, definition.id
    from public.badge_definitions as definition
    where definition.trigger_type = 'avatar_set'
    on conflict (user_id, badge_id) do nothing;
  else
    delete from public.user_badges as user_badge
    using public.badge_definitions as definition
    where user_badge.user_id = new.id
      and user_badge.badge_id = definition.id
      and definition.trigger_type = 'avatar_set';
  end if;
  return new;
end;
$$;

revoke all on function public.sync_avatar_badge() from public, anon, authenticated;
drop trigger if exists sync_avatar_badge on auth.users;
create trigger sync_avatar_badge
after update of raw_user_meta_data on auth.users
for each row execute function public.sync_avatar_badge();
