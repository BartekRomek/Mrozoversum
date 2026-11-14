create table if not exists public.badge_definitions (
  id text primary key,
  name text not null,
  description text not null,
  icon text not null,
  book_id text not null
);

insert into public.badge_definitions (id, name, description, icon, book_id)
values ('konfrontacja', 'Konfrontacja', 'Przeczytano książkę, która łączy wszystkie serie Mrozoversum.', '/covers/konfrontacja.jpg', 'konfrontacja')
on conflict (id) do update set name = excluded.name, description = excluded.description, icon = excluded.icon, book_id = excluded.book_id;

create table if not exists public.user_badges (
  user_id uuid not null references auth.users(id) on delete cascade,
  badge_id text not null references public.badge_definitions(id) on delete cascade,
  earned_at timestamptz not null default now(),
  primary key (user_id, badge_id)
);

alter table public.badge_definitions enable row level security;
alter table public.user_badges enable row level security;
revoke all on table public.badge_definitions from anon, authenticated;
grant select on table public.badge_definitions to authenticated;
revoke all on table public.user_badges from anon;
grant select on table public.user_badges to authenticated;

drop policy if exists "Authenticated users can read badge definitions" on public.badge_definitions;
create policy "Authenticated users can read badge definitions" on public.badge_definitions for select to authenticated using (true);
drop policy if exists "Users can read their own badges" on public.user_badges;
create policy "Users can read their own badges" on public.user_badges for select to authenticated using ((select auth.uid()) = user_id);

create or replace function public.award_badges_for_read_book()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.is_read = true and (tg_op = 'INSERT' or old.is_read is distinct from true) then
    insert into public.user_badges (user_id, badge_id)
    select new.user_id, id from public.badge_definitions where book_id = new.book_id
    on conflict (user_id, badge_id) do nothing;
  end if;
  return new;
end;
$$;

revoke all on function public.award_badges_for_read_book() from public, anon, authenticated;
drop trigger if exists award_badges_after_read_book on public.user_book_status;
create trigger award_badges_after_read_book
after insert or update of is_read on public.user_book_status
for each row execute function public.award_badges_for_read_book();
