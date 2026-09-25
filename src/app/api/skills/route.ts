import { sameOrigin } from "@/lib/http";
import { getSkills } from "@/lib/content";
import { getAdmin } from "@/lib/auth";
import { skillSchema } from "@/lib/validators";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
export async function GET() {
  return Response.json(await getSkills());
}
export async function POST(request: Request) {
  if (!sameOrigin(request))
    return Response.json({ error: "Forbidden origin" }, { status: 403 });
  if (!(await getAdmin()))
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const text = await request.text();
    if (text.length > 2000)
      return Response.json({ error: "Request too large" }, { status: 413 });
    const data = skillSchema.parse(JSON.parse(text));
    const skill = await prisma.skill.create({ data });
    revalidatePath("/skills");
    revalidatePath("/resume");
    revalidatePath("/admin/skills");
    return Response.json(skill, { status: 201 });
  } catch {
    return Response.json({ error: "Invalid skill" }, { status: 400 });
  }
}
