import type { SupabaseClient } from "@supabase/supabase-js";

export const newsIdForVersion = (version: string) => `update-${version}`;

export async function getReadNewsIds(supabase: SupabaseClient, userId: string) {
  const { data, error } = await supabase.from("user_read_news").select("news_id").eq("user_id", userId);
  if (error) throw error;
  return new Set((data ?? []).map((item) => item.news_id as string));
}

export async function markNewsAsRead(supabase: SupabaseClient, userId: string, newsId: string) {
  const { error } = await supabase.from("user_read_news").upsert({ user_id: userId, news_id: newsId, read_at: new Date().toISOString() }, { onConflict: "user_id,news_id" });
  if (error) throw error;
}
