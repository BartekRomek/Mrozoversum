export function assetPath(path: string) {
  if (!path) return path;

  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

  let assetPath = path;

  if (path.startsWith("/avatars/")) {
    assetPath = path
      .replace("/avatars/", "/avatars-optimized/")
      .replace(/\.(png|jpe?g)$/i, ".webp");
  }

  if (assetPath.startsWith("/")) {
    return `${basePath}${assetPath}`;
  }

  return assetPath;
}