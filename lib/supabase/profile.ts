import type { SupabaseClient } from "@supabase/supabase-js";

const allowedTypes = new Set(["image/png", "image/jpeg", "image/webp"]);

export async function uploadUserAvatar(supabase: SupabaseClient, userId: string, file: File) {
  if (!allowedTypes.has(file.type)) throw new Error("Wybierz obraz PNG, JPG lub WebP.");
  if (file.size > 5 * 1024 * 1024) throw new Error("Zdjęcie może mieć maksymalnie 5 MB.");

  const extension = file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg";
  const basePath = `${userId}/avatar.${extension}`;
  const bucket = supabase.storage.from("avatars");
  let path = basePath;
  let { error: uploadError } = await bucket.upload(path, file, {
    upsert: true,
    cacheControl: "3600",
    contentType: file.type
  });
  if (uploadError) {
    path = `${userId}/avatar-${Date.now()}.${extension}`;
    ({ error: uploadError } = await bucket.upload(path, file, {
      upsert: false,
      cacheControl: "3600",
      contentType: file.type
    }));
  }
  if (uploadError) throw uploadError;

  const { data } = bucket.getPublicUrl(path);
  const url = `${data.publicUrl}?v=${Date.now()}`;
  const { error } = await supabase.auth.updateUser({ data: { avatar_url: url } });
  if (error) throw error;
  return url;
}
