insert into public.badge_definitions (id, name, description, icon, book_id, trigger_type)
values
  ('pierwsze-audio', 'Pierwszy głos', 'Po raz pierwszy odsłuchano nagranie postaci.', '/badges/pierwsze-audio.png', null, 'audio_first'),
  ('o-projekcie', 'Za kulisami', 'Odwiedzono stronę O projekcie.', '/badges/poznaj-projekt.png', null, 'project_visit'),
  ('katalog-postaci', 'Kartoteka postaci', 'Odwiedzono katalog postaci.', '/badges/album-postaci.png', null, 'character_album_visit')
on conflict (id) do update set
  name = excluded.name,
  description = excluded.description,
  icon = excluded.icon,
  book_id = excluded.book_id,
  trigger_type = excluded.trigger_type;

create or replace function public.award_user_badge(target_badge_id text)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is null then
    raise exception 'Not authenticated';
  end if;

  insert into public.user_badges (user_id, badge_id)
  select auth.uid(), definition.id
  from public.badge_definitions as definition
  where definition.id = target_badge_id
    and definition.trigger_type in ('audio_first', 'project_visit', 'character_album_visit')
  on conflict (user_id, badge_id) do nothing;
end;
$$;

revoke all on function public.award_user_badge(text) from public, anon;
grant execute on function public.award_user_badge(text) to authenticated;
