create table if not exists public.user_character_favorites (
  user_id uuid not null references auth.users(id) on delete cascade,
  character_key text not null,
  character_name text not null,
  created_at timestamptz not null default now(),
  primary key (user_id, character_key)
);

alter table public.user_character_favorites enable row level security;
revoke all on table public.user_character_favorites from anon;
grant select, insert, update, delete on table public.user_character_favorites to authenticated;

drop policy if exists "Users can read their own character favorites" on public.user_character_favorites;
drop policy if exists "Users can create their own character favorites" on public.user_character_favorites;
drop policy if exists "Users can update their own character favorites" on public.user_character_favorites;
drop policy if exists "Users can delete their own character favorites" on public.user_character_favorites;

create policy "Users can read their own character favorites" on public.user_character_favorites for select to authenticated using (auth.uid() = user_id);
create policy "Users can create their own character favorites" on public.user_character_favorites for insert to authenticated with check (auth.uid() = user_id);
create policy "Users can update their own character favorites" on public.user_character_favorites for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users can delete their own character favorites" on public.user_character_favorites for delete to authenticated using (auth.uid() = user_id);
