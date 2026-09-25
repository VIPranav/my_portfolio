import { z } from "zod";
export const projectTypeSchema = z.enum([
  "DEV",
  "UIUX",
  "GRAPHIC",
  "VIDEO",
  "THREED",
]);
export const skillLevelSchema = z.enum([
  "FOUNDATIONAL",
  "PRACTICAL",
  "PROFICIENT",
]);
export const safeUrl = z
  .string()
  .trim()
  .max(2048)
  .refine((value) => {
    if (/^\/(?![\/\\])[^\\\s]*$/.test(value)) return true;
    try {
      const u = new URL(value);
      return u.protocol === "https:" && !u.username && !u.password;
    } catch {
      return false;
    }
  }, "Use an HTTPS URL or a local path beginning with /.");
const optionalUrl = z
  .union([safeUrl, z.literal("")])
  .nullish()
  .transform((v) => v || null);
export const contactSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z
    .email()
    .max(254)
    .transform((v) => v.toLowerCase()),
  projectType: projectTypeSchema,
  budget: z.string().trim().max(100).optional(),
  body: z.string().trim().min(10).max(2000),
  website: z.string().max(200).optional().default(""),
});
export const mediaSchema = z.object({
  url: safeUrl,
  kind: z.enum(["image", "video"]),
  caption: z.string().trim().max(300).nullish(),
  order: z.number().int().min(0).max(1000).default(0),
});
export const projectSchema = z.object({
  title: z.string().trim().min(2).max(120),
  slug: z
    .string()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    .max(120),
  summary: z.string().trim().min(5).max(300),
  type: projectTypeSchema,
  year: z.number().int().min(2000).max(2100),
  role: z.string().trim().min(2).max(120),
  coverUrl: safeUrl,
  modelUrl: optionalUrl,
  liveUrl: optionalUrl,
  repoUrl: optionalUrl,
  overview: z.string().trim().min(10).max(20000),
  problem: z.string().max(20000).nullish(),
  process: z.string().max(20000).nullish(),
  result: z.string().max(20000).nullish(),
  tools: z.array(z.string().trim().min(1).max(60)).max(30),
  featured: z.boolean().default(false),
  published: z.boolean().default(false),
  order: z.number().int().min(0).max(10000).default(0),
  media: z.array(mediaSchema).max(30).default([]),
});
export const skillSchema = z.object({
  name: z.string().trim().min(2).max(80),
  level: skillLevelSchema,
  categoryId: z.string().min(1).max(100),
  order: z.number().int().min(0).max(1000).default(0),
});
export const categorySchema = z.object({
  name: z.string().trim().min(2).max(80),
  order: z.number().int().min(0).max(1000).default(0),
});
export const settingsSchema = z.object({
  title: z.string().trim().min(2).max(120),
  bio: z.string().trim().min(10).max(2000),
  email: z.union([z.email(), z.literal("")]),
  github: optionalUrl,
  linkedin: optionalUrl,
  instagram: optionalUrl,
  resumeUrl: optionalUrl,
});
export const loginSchema = z.object({
  email: z
    .email()
    .max(254)
    .transform((v) => v.toLowerCase()),
  password: z.string().min(1).max(200),
});
