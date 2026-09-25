import Image from "next/image";
import type { ProjectWithMedia } from "@/lib/content";
export default function Gallery({
  media,
}: {
  media: ProjectWithMedia["media"];
}) {
  return (
    <div className="gallery">
      {media.map((m) => (
        <figure key={m.id}>
          {m.kind === "video" ? (
            <video
              controls
              preload="metadata"
              src={m.url}
              aria-label={m.caption || "Project video"}
            />
          ) : (
            <Image
              src={m.url}
              alt={m.caption || "Project detail"}
              width={1400}
              height={900}
              sizes="(max-width: 768px) 100vw, 1100px"
              unoptimized={m.url.startsWith("https:")}
            />
          )}
          {m.caption && <figcaption>{m.caption}</figcaption>}
        </figure>
      ))}
    </div>
  );
}
