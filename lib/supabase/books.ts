import type { SupabaseClient } from "@supabase/supabase-js";

export type BookStatus = {
  isFavorite: boolean;
  isRead: boolean;
};

export async function getUserBookStatuses(
  supabase: SupabaseClient,
  userId: string
): Promise<Record<string, BookStatus>> {
  const { data, error } = await supabase
    .from("user_book_status")
    .select("book_id,is_favorite,is_read")
    .eq("user_id", userId);

  if (error) throw error;

  return Object.fromEntries(
    (data ?? []).map((item) => [
      item.book_id,
      { isFavorite: item.is_favorite === true, isRead: item.is_read === true }
    ])
  );
}

export async function getBookStatus(supabase: SupabaseClient, userId: string, bookId: string): Promise<BookStatus> {
  const { data, error } = await supabase
    .from("user_book_status")
    .select("is_favorite,is_read")
    .eq("user_id", userId)
    .eq("book_id", bookId)
    .maybeSingle();

  if (error) throw error;
  return {
    isFavorite: data?.is_favorite === true,
    isRead: data?.is_read === true
  };
}

export async function saveBookStatus(
  supabase: SupabaseClient,
  userId: string,
  bookId: string,
  status: BookStatus
) {
  const { error } = await supabase.from("user_book_status").upsert({
    user_id: userId,
    book_id: bookId,
    is_favorite: status.isFavorite,
    is_read: status.isRead,
    updated_at: new Date().toISOString()
  }, { onConflict: "user_id,book_id" });

  if (error) throw error;
}
