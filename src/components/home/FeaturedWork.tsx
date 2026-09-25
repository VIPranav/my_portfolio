import Link from "next/link";
import ProjectCard from "@/components/work/ProjectCard";
import type { ProjectWithMedia } from "@/lib/content";
export default function FeaturedWork({
  projects,
}: {
  projects: ProjectWithMedia[];
}) {
  return (
    <section className="section">
      <div className="container">
        <div className="section-heading">
          <div>
            <p className="eyebrow">SELECTED WORK</p>
            <h2>Ideas out in the world.</h2>
          </div>
          <Link href="/work" className="text-link">
            View all work ↗
          </Link>
        </div>
        <div className="featured-grid">
          {projects.map((p) => (
            <ProjectCard key={p.id} project={p} />
          ))}
        </div>
      </div>
    </section>
  );
}
