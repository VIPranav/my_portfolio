import { revalidatePath } from "next/cache";
import { prisma } from "./db";
import { requireAdmin } from "./auth";
import { projectSchema } from "./validators";
export async function refreshProjects(slug?: string) {
  revalidatePath("/");
  revalidatePath("/work");
  revalidatePath("/sitemap.xml");
  revalidatePath("/admin");
  revalidatePath("/admin/projects");
  if (slug) revalidatePath(`/work/${slug}`);
}
export async function saveProject(input: unknown, id?: string) {
  await requireAdmin();
  const { media, ...data } = projectSchema.parse(input);
  const previous = id
    ? await prisma.project.findUniqueOrThrow({ where: { id } })
    : null;
  const project = id
    ? await prisma.project.update({
        where: { id },
        data: { ...data, media: { deleteMany: {}, create: media } },
      })
    : await prisma.project.create({
        data: { ...data, media: { create: media } },
      });
  await refreshProjects(project.slug);
  if (previous?.slug !== project.slug) await refreshProjects(previous?.slug);
  return project;
}
