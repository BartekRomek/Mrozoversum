insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do update set public = true;

drop policy if exists "Avatar images are publicly readable" on storage.objects;
drop policy if exists "Users can upload their own avatar" on storage.objects;
drop policy if exists "Users can update their own avatar" on storage.objects;
drop policy if exists "Users can delete their own avatar" on storage.objects;

create policy "Avatar images are publicly readable" on storage.objects for select using (bucket_id = 'avatars');
create policy "Users can upload their own avatar" on storage.objects for insert to authenticated with check (bucket_id = 'avatars' and name like auth.uid()::text || '/%');
create policy "Users can update their own avatar" on storage.objects for update to authenticated using (bucket_id = 'avatars' and name like auth.uid()::text || '/%') with check (bucket_id = 'avatars' and name like auth.uid()::text || '/%');
create policy "Users can delete their own avatar" on storage.objects for delete to authenticated using (bucket_id = 'avatars' and name like auth.uid()::text || '/%');
