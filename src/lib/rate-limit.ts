import { createHash } from "node:crypto";
import { prisma } from "./db";
export async function rateLimit(
  scope: string,
  identity: string,
  limit: number,
  windowMs: number,
) {
  const key = createHash("sha256").update(`${scope}:${identity}`).digest("hex");
  const now = new Date();
  const expiresAt = new Date(now.getTime() + windowMs);
  const rows = await prisma.$queryRaw<
    { count: number }[]
  >`INSERT INTO "RateLimit" ("key", "count", "expiresAt") VALUES (${key}, 1, ${expiresAt}) ON CONFLICT ("key") DO UPDATE SET "count" = CASE WHEN "RateLimit"."expiresAt" <= ${now} THEN 1 ELSE "RateLimit"."count" + 1 END, "expiresAt" = CASE WHEN "RateLimit"."expiresAt" <= ${now} THEN ${expiresAt} ELSE "RateLimit"."expiresAt" END RETURNING "count"`;
  // Bound storage without relying on a process-local cache. Expired counters can be discarded.
  await prisma.rateLimit.deleteMany({
    where: { expiresAt: { lt: new Date(now.getTime() - 86400000) } },
  });
  return rows[0].count <= limit;
}
export function clientIdentity(headers: Headers) {
  // Enable only behind a proxy that overwrites the specified header.
  const trustedHeader = process.env.TRUSTED_IP_HEADER;
  return trustedHeader
    ? headers.get(trustedHeader)?.split(",")[0].trim().slice(0, 100) ||
        "unknown"
    : "shared";
}
