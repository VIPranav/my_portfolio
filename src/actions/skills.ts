"use server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { skillSchema, categorySchema } from "@/lib/validators";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import type { ActionResult } from "./projects";
export async function skillCommand(form: FormData): Promise<ActionResult> {
  try {
    await requireAdmin();
    const command = z
      .enum(["save-skill", "delete-skill", "save-category", "delete-category"])
      .parse(form.get("command"));
    const id = z
      .string()
      .max(100)
      .parse(form.get("id") || "");
    if (command === "delete-skill") {
      await prisma.skill.delete({ where: { id } });
    } else if (command === "delete-category") {
      const count = await prisma.skill.count({ where: { categoryId: id } });
      if (count)
        return {
          ok: false,
          error: "Move or delete this category’s skills first.",
        };
      await prisma.skillCategory.delete({ where: { id } });
    } else if (command === "save-category") {
      const data = categorySchema.parse({
        name: form.get("name"),
        order: Number(form.get("order") || 0),
      });
      if (id) await prisma.skillCategory.update({ where: { id }, data });
      else await prisma.skillCategory.create({ data });
    } else {
      const data = skillSchema.parse({
        name: form.get("name"),
        level: form.get("level"),
        categoryId: form.get("categoryId"),
        order: Number(form.get("order") || 0),
      });
      if (id) await prisma.skill.update({ where: { id }, data });
      else await prisma.skill.create({ data });
    }
    for (const path of ["/skills", "/resume", "/admin/skills", "/admin"])
      revalidatePath(path);
    return { ok: true };
  } catch {
    return {
      ok: false,
      error: "Could not save. Check the fields and duplicate category names.",
    };
  }
}
