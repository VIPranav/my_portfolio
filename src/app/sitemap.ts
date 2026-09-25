import type { MetadataRoute } from "next";
import { getProjects } from "@/lib/content";
import { siteUrl } from "@/lib/config";
export const revalidate = 60;
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteUrl();
  const projects = await getProjects();
  return [
    ...[
      "",
      "/work",
      "/about",
      "/skills",
      "/journey",
      "/services",
      "/contact",
      "/resume",
    ].map((path) => ({
      url: `${base}${path}`,
      changeFrequency: "monthly" as const,
      priority: path ? 0.7 : 1,
    })),
    ...projects.map((p) => ({
      url: `${base}/work/${p.slug}`,
      lastModified: p.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
