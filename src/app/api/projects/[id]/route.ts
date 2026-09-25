import { sameOrigin } from "@/lib/http";
import { getAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { saveProject, refreshProjects } from "@/lib/projects";
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!sameOrigin(request))
    return Response.json({ error: "Forbidden origin" }, { status: 403 });
  if (!(await getAdmin()))
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const current = await prisma.project.findUnique({
    where: { id },
    include: { media: true },
  });
  if (!current) return Response.json({ error: "Not found" }, { status: 404 });
  try {
    const text = await request.text();
    if (text.length > 150000)
      return Response.json({ error: "Request too large" }, { status: 413 });
    return Response.json(
      await saveProject({ ...current, ...JSON.parse(text) }, id),
    );
  } catch {
    return Response.json(
      { error: "Invalid project or duplicate slug" },
      { status: 400 },
    );
  }
}
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!sameOrigin(request))
    return Response.json({ error: "Forbidden origin" }, { status: 403 });
  if (!(await getAdmin()))
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const project = await prisma.project.findUnique({ where: { id } });
  if (!project) return Response.json({ error: "Not found" }, { status: 404 });
  await prisma.project.delete({ where: { id } });
  await refreshProjects(project.slug);
  return new Response(null, { status: 204 });
}
