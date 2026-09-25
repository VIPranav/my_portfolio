"use server";
import { AuthError } from "next-auth";
import { signIn, signOut, requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { settingsSchema } from "@/lib/validators";
import { z } from "zod";
import type { ActionResult } from "./projects";
export async function loginAction(
  _: ActionResult,
  form: FormData,
): Promise<ActionResult> {
  try {
    await signIn("credentials", {
      email: form.get("email"),
      password: form.get("password"),
      redirectTo: "/admin",
    });
    return { ok: true };
  } catch (error) {
    if (error instanceof AuthError)
      return {
        ok: false,
        error:
          "Unable to sign in. Check your credentials and configuration, or wait before trying again.",
      };
    throw error;
  }
}
export async function logoutAction() {
  await signOut({ redirectTo: "/admin/login" });
}
export async function messageCommand(form: FormData): Promise<ActionResult> {
  try {
    await requireAdmin();
    const id = z.string().min(1).max(100).parse(form.get("id"));
    const status = z
      .enum(["NEW", "READ", "ARCHIVED"])
      .parse(form.get("status"));
    await prisma.message.update({ where: { id }, data: { status } });
    revalidatePath("/admin/messages");
    revalidatePath("/admin");
    return { ok: true };
  } catch {
    return { ok: false, error: "Could not update this message." };
  }
}
export async function saveSettings(form: FormData): Promise<ActionResult> {
  try {
    await requireAdmin();
    const parsed = settingsSchema.parse(Object.fromEntries(form));
    await prisma.$transaction(
      Object.entries(parsed).map(([key, value]) =>
        prisma.setting.upsert({
          where: { key },
          update: { value: value || "" },
          create: { key, value: value || "" },
        }),
      ),
    );
    revalidatePath("/", "layout");
    return { ok: true };
  } catch {
    return {
      ok: false,
      error: "Could not save. Check the title, bio, email, and HTTPS links.",
    };
  }
}
