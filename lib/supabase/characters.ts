import type { SupabaseClient } from "@supabase/supabase-js";

export type CharacterFavorite = {
  characterKey: string;
  characterName: string;
};

export async function getUserCharacterFavorites(supabase: SupabaseClient, userId: string) {
  const { data, error } = await supabase
    .from("user_character_favorites")
    .select("character_key, character_name")
    .eq("user_id", userId);
  if (error) throw error;

  return Object.fromEntries((data ?? []).map((item) => [item.character_key, {
    characterKey: item.character_key,
    characterName: item.character_name
  }]));
}

export async function saveCharacterFavorite(
  supabase: SupabaseClient,
  userId: string,
  favorite: CharacterFavorite,
  isFavorite: boolean
) {
  if (!isFavorite) {
    const { error } = await supabase.from("user_character_favorites")
      .delete().eq("user_id", userId).eq("character_key", favorite.characterKey);
    if (error) throw error;
    return;
  }

  const { error } = await supabase.from("user_character_favorites").upsert({
    user_id: userId,
    character_key: favorite.characterKey,
    character_name: favorite.characterName
  });
  if (error) throw error;
}
