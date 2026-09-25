import { submitContact } from "@/lib/contact-service";
import { readJson } from "@/lib/http";
export async function POST(request: Request) {
  try {
    const result = await submitContact(
      await readJson(request, 12000),
      request.headers,
    );
    return Response.json(result, {
      status: result.ok
        ? 200
        : result.error?.startsWith("Too many")
          ? 429
          : 400,
    });
  } catch {
    return Response.json(
      { error: "Invalid or oversized request" },
      { status: 400 },
    );
  }
}
