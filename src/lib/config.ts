export function databaseConfigured() {
  const url = process.env.DATABASE_URL;
  return Boolean(
    url && !url.includes("user:pass") && !url.includes("[PLACEHOLDER]"),
  );
}
export function siteUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
}
