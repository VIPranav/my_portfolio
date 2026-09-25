import { prisma } from "./db";
import { contactSchema } from "./validators";
import { rateLimit, clientIdentity } from "./rate-limit";
import { databaseConfigured } from "./config";
export type ContactResult = {
  ok: boolean;
  error?: string;
  fields?: Record<string, string[] | undefined>;
};
export async function submitContact(
  input: unknown,
  headers: Headers,
): Promise<ContactResult> {
  const parsed = contactSchema.safeParse(input);
  if (!parsed.success)
    return {
      ok: false,
      error: "Please check the highlighted fields.",
      fields: parsed.error.flatten().fieldErrors,
    };
  if (parsed.data.website) return { ok: true };
  if (!databaseConfigured())
    return {
      ok: false,
      error: "The contact form is not configured yet. Please try again later.",
    };
  try {
    if (!(await rateLimit("contact", clientIdentity(headers), 3, 60000)))
      return {
        ok: false,
        error: "Too many requests. Please wait a minute and try again.",
      };
    const { website: _website, ...data } = parsed.data;
    void _website;
    await prisma.message.create({ data });
    return { ok: true };
  } catch {
    return {
      ok: false,
      error: "Your message could not be saved. Please try again shortly.",
    };
  }
}
