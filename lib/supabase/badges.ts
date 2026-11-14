import type { SupabaseClient } from "@supabase/supabase-js";

export type UserBadge = {
  badgeId: string;
  earnedAt: string;
};

export async function getUserBadges(supabase: SupabaseClient, userId: string): Promise<UserBadge[]> {
  const { data, error } = await supabase
    .from("user_badges")
    .select("badge_id, earned_at")
    .eq("user_id", userId)
    .order("earned_at", { ascending: false });

  if (error) throw error;
  return (data ?? []).map((row) => ({ badgeId: row.badge_id as string, earnedAt: row.earned_at as string }));
}
