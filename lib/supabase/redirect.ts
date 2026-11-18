const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");

export function getAuthRedirectUrl(path = "") {
  if (configuredSiteUrl) return `${configuredSiteUrl}${path}`;
  if (typeof window !== "undefined") return `${window.location.origin}${path}`;
  return undefined;
}
