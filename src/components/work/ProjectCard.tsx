import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { ProjectWithMedia } from "@/lib/content";
import { typeLabels } from "@/data/content";
export default function ProjectCard({
  project,
  priority = false,
}: {
  project: ProjectWithMedia;
  priority?: boolean;
}) {
  return (
    <Link href={`/work/${project.slug}`} className="project-card">
      <div className="project-image">
        <Image
          src={project.coverUrl}
          alt={`${project.title} project cover`}
          fill
          sizes="(max-width: 767px) 100vw, 60vw"
          priority={priority}
          unoptimized={project.coverUrl.startsWith("https:")}
        />
        <span className="project-arrow">
          <ArrowUpRight size={20} />
        </span>
      </div>
      <div className="project-caption">
        <div>
          <p className="eyebrow">
            {typeLabels[project.type]}{" "}
            {project.id.startsWith("sample-") ? " / SAMPLE CONCEPT" : ""}
          </p>
          <h3>{project.title}</h3>
          <p>{project.summary}</p>
        </div>
        <span className="small muted">{project.year}</span>
      </div>
    </Link>
  );
}
