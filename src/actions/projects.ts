"use server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { saveProject, refreshProjects } from "@/lib/projects";
import { z } from "zod";
export type ActionResult = { ok: boolean; error?: string; id?: string };
export async function saveProjectAction(
  input: unknown,
  id?: string,
): Promise<ActionResult> {
  try {
    const p = await saveProject(input, id);
    return { ok: true, id: p.id };
  } catch (error) {
    return {
      ok: false,
      error:
        error instanceof z.ZodError
          ? error.issues
              .map((i) => `${i.path.join(".")}: ${i.message}`)
              .join("; ")
          : "Could not save. Check your session and ensure the slug is unique.",
    };
  }
}
export async function projectCommand(form: FormData): Promise<ActionResult> {
  try {
    await requireAdmin();
    const id = z.string().min(1).max(100).parse(form.get("id"));
    const command = z
      .enum(["publish", "unpublish", "delete", "order"])
      .parse(form.get("command"));
    const p = await prisma.project.findUniqueOrThrow({ where: { id } });
    if (command === "delete") await prisma.project.delete({ where: { id } });
    else if (command === "order")
      await prisma.project.update({
        where: { id },
        data: {
          order: z.coerce
            .number()
            .int()
            .min(0)
            .max(10000)
            .parse(form.get("order")),
        },
      });
    else
      await prisma.project.update({
        where: { id },
        data: { published: command === "publish" },
      });
    await refreshProjects(p.slug);
    return { ok: true };
  } catch {
    return {
      ok: false,
      error: "Could not update the project. Please try again.",
    };
  }
}
