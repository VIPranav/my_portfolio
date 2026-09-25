import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";
import ProjectForm from "@/components/admin/ProjectForm";
export default async function EditProject({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const project = await prisma.project.findUnique({
    where: { id: (await params).id },
    include: { media: { orderBy: { order: "asc" } } },
  });
  if (!project) notFound();
  return (
    <>
      <h1>Edit project</h1>
      <ProjectForm project={project} />
    </>
  );
}
