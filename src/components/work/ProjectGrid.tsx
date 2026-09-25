import type { ProjectWithMedia } from "@/lib/content";
import ProjectCard from "./ProjectCard";
export default function ProjectGrid({
  projects,
}: {
  projects: ProjectWithMedia[];
}) {
  return projects.length ? (
    <div className="project-grid">
      {projects.map((project, i) => (
        <ProjectCard key={project.id} project={project} priority={i === 0} />
      ))}
    </div>
  ) : (
    <div className="empty-state">
      <h2>More in the making.</h2>
      <p>No published projects in this discipline yet.</p>
    </div>
  );
}
