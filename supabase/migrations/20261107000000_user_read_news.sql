create table if not exists public.user_read_news (
  user_id uuid not null references auth.users(id) on delete cascade,
  news_id text not null,
  read_at timestamptz not null default now(),
  primary key (user_id, news_id)
);

alter table public.user_read_news enable row level security;

revoke all on table public.user_read_news from anon;
grant select, insert, update, delete on table public.user_read_news to authenticated;

drop policy if exists "Users can read their own news status" on public.user_read_news;
create policy "Users can read their own news status"
  on public.user_read_news for select
  to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists "Users can mark their own news as read" on public.user_read_news;
create policy "Users can mark their own news as read"
  on public.user_read_news for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

drop policy if exists "Users can update their own news status" on public.user_read_news;
create policy "Users can update their own news status"
  on public.user_read_news for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

drop policy if exists "Users can delete their own news status" on public.user_read_news;
create policy "Users can delete their own news status"
  on public.user_read_news for delete
  to authenticated
  using ((select auth.uid()) = user_id);
