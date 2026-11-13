create table if not exists public.user_book_status (
  user_id uuid not null references auth.users(id) on delete cascade,
  book_id text not null,
  is_favorite boolean not null default false,
  is_read boolean not null default false,
  updated_at timestamptz not null default now(),
  primary key (user_id, book_id)
);

alter table public.user_book_status enable row level security;

revoke all on table public.user_book_status from anon;
grant select, insert, update, delete on table public.user_book_status to authenticated;

drop policy if exists "Users can read their own book status" on public.user_book_status;
create policy "Users can read their own book status"
  on public.user_book_status for select
  to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists "Users can create their own book status" on public.user_book_status;
create policy "Users can create their own book status"
  on public.user_book_status for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

drop policy if exists "Users can update their own book status" on public.user_book_status;
create policy "Users can update their own book status"
  on public.user_book_status for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

drop policy if exists "Users can delete their own book status" on public.user_book_status;
create policy "Users can delete their own book status"
  on public.user_book_status for delete
  to authenticated
  using ((select auth.uid()) = user_id);
