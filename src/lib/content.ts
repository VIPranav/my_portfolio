import { cache } from "react";
import type { Prisma, ProjectType } from "@prisma/client";
import { prisma } from "./db";
import { databaseConfigured } from "./config";
import { sampleProjects, skillGroups, milestones } from "@/data/content";
import { site } from "@/data/site";
export type ProjectWithMedia = Prisma.ProjectGetPayload<{
  include: { media: true };
}>;
const samples: ProjectWithMedia[] = sampleProjects.map((p, order) => ({
  ...p,
  tools: [...p.tools],
  order,
  featured: true,
  published: true,
  modelUrl: null,
  liveUrl: null,
  repoUrl: null,
  media: [],
  createdAt: new Date("2026-01-01"),
  updatedAt: new Date("2026-01-01"),
}));
export const getProjects = cache(
  async (type?: ProjectType): Promise<ProjectWithMedia[]> => {
    if (!databaseConfigured())
      return samples.filter((p) => !type || p.type === type);
    return prisma.project.findMany({
      where: { published: true, ...(type ? { type } : {}) },
      include: { media: { orderBy: { order: "asc" } } },
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    });
  },
);
export const getProject = cache(async (slug: string) => {
  if (!databaseConfigured())
    return samples.find((p) => p.slug === slug) ?? null;
  return prisma.project.findFirst({
    where: { slug, published: true },
    include: { media: { orderBy: { order: "asc" } } },
  });
});
export const getSkills = cache(async () => {
  if (!databaseConfigured())
    return skillGroups.map((group, order) => ({
      id: `category-${order}`,
      name: group.name,
      order,
      skills: group.skills.map(([name, level], i) => ({
        id: `skill-${order}-${i}`,
        name,
        level,
        order: i,
        categoryId: `category-${order}`,
      })),
    }));
  return prisma.skillCategory.findMany({
    orderBy: { order: "asc" },
    include: { skills: { orderBy: { order: "asc" } } },
  });
});
export const getMilestones = cache(async () => {
  if (!databaseConfigured())
    return milestones.map((m, order) => ({
      ...m,
      id: `milestone-${order}`,
      order,
    }));
  return prisma.milestone.findMany({ orderBy: { order: "asc" } });
});
export const getSettings = cache(async () => {
  const defaults = {
    title: site.title as string,
    bio: site.description as string,
    email: "",
    github: "",
    linkedin: "",
    instagram: "",
    resumeUrl: "/resume.pdf",
  };
  if (!databaseConfigured()) return defaults;
  const entries = await prisma.setting.findMany();
  for (const entry of entries)
    if (entry.key in defaults)
      defaults[entry.key as keyof typeof defaults] = entry.value;
  return defaults;
});
