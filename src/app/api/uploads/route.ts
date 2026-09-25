import { sameOrigin } from "@/lib/http";
import { getAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";
export async function POST(request: Request) {
  if (!sameOrigin(request))
    return Response.json({ error: "Forbidden origin" }, { status: 403 });
  if (!(await getAdmin()))
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  if (Number(request.headers.get("content-length") || 0) > 5500000)
    return Response.json(
      { error: "Maximum file size is 5 MB." },
      { status: 413 },
    );
  try {
    const form = await request.formData();
    const file = form.get("file");
    if (
      !(file instanceof File) ||
      file.size > 5 * 1024 * 1024 ||
      file.size < 12
    )
      return Response.json(
        { error: "Choose an image under 5 MB." },
        { status: 400 },
      );
    const bytes = Buffer.from(await file.arrayBuffer());
    let mimeType = "";
    if (
      bytes
        .subarray(0, 8)
        .equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))
    )
      mimeType = "image/png";
    else if (bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255)
      mimeType = "image/jpeg";
    else if (
      bytes.toString("ascii", 0, 4) === "RIFF" &&
      bytes.toString("ascii", 8, 12) === "WEBP"
    )
      mimeType = "image/webp";
    if (!mimeType)
      return Response.json(
        { error: "Only PNG, JPEG, and WebP images are accepted." },
        { status: 400 },
      );
    const asset = await prisma.asset.create({
      data: { bytes, mimeType },
      select: { id: true },
    });
    return Response.json({ url: `/api/media/${asset.id}` }, { status: 201 });
  } catch {
    return Response.json(
      { error: "Upload could not be saved." },
      { status: 400 },
    );
  }
}
