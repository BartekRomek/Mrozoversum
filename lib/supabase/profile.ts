import type { SupabaseClient } from "@supabase/supabase-js";

const allowedTypes = new Set(["image/png", "image/jpeg", "image/webp"]);

export async function uploadUserAvatar(supabase: SupabaseClient, userId: string, file: File) {
  if (!allowedTypes.has(file.type)) throw new Error("Wybierz obraz PNG, JPG lub WebP.");
  if (file.size > 5 * 1024 * 1024) throw new Error("Zdjęcie może mieć maksymalnie 5 MB.");

  const extension = file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg";
  const path = `${userId}/avatar.${extension}`;
  const { error: uploadError } = await supabase.storage.from("avatars").upload(path, file, {
    upsert: true,
    cacheControl: "3600",
    contentType: file.type
  });
  if (uploadError) throw uploadError;

  const { data } = supabase.storage.from("avatars").getPublicUrl(path);
  const url = `${data.publicUrl}?v=${Date.now()}`;
  const { error } = await supabase.auth.updateUser({ data: { avatar_url: url } });
  if (error) throw error;
  return url;
}
