import { sameOrigin } from "@/lib/http";
import { getProjects } from "@/lib/content";
import { getAdmin } from "@/lib/auth";
import { projectTypeSchema } from "@/lib/validators";
import { saveProject } from "@/lib/projects";
export async function GET(request: Request) {
  const type = new URL(request.url).searchParams.get("type");
  const parsed = projectTypeSchema.safeParse(type);
  if (type && !parsed.success)
    return Response.json({ error: "Invalid project type" }, { status: 400 });
  return Response.json(
    await getProjects(parsed.success ? parsed.data : undefined),
  );
}
export async function POST(request: Request) {
  if (!sameOrigin(request))
    return Response.json({ error: "Forbidden origin" }, { status: 403 });
  if (!(await getAdmin()))
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const text = await request.text();
    if (text.length > 150000)
      return Response.json({ error: "Request too large" }, { status: 413 });
    const project = await saveProject(JSON.parse(text));
    return Response.json(project, { status: 201 });
  } catch {
    return Response.json(
      { error: "Invalid project or duplicate slug" },
      { status: 400 },
    );
  }
}
