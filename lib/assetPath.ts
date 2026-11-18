export function assetPath(path: string) {
  if (!path) return path;

  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

  let assetPath = path;

  // Obsługa avatarów zapisanych zarówno jako:
  // "avatars/Chylka.png"
  // jak i "/avatars/Chylka.png"
  if (path.startsWith("avatars/") || path.startsWith("/avatars/")) {
    assetPath = path
      .replace(/^\/?avatars\//, "/avatars-optimized/")
      .replace(/\.(png|jpe?g)$/i, ".webp");
  }

  if (path.startsWith("badges/") || path.startsWith("/badges/")) {
    assetPath = path
      .replace(/^\/?badges\//, "/badges-optimized/")
      .replace(/\.(png|jpe?g)$/i, ".webp");
  }

  if (path.startsWith("icons/") || path.startsWith("/icons/")) {
    assetPath = path
      .replace(/^\/?icons\//, "/icons-optimized/")
      .replace(/\.svg$/i, ".webp");
  }

  if (assetPath.startsWith("/")) {
    return `${basePath}${assetPath}`;
  }

  return `${basePath}/${assetPath}`;
}
