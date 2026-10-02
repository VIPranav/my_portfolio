import type { Metadata } from "next";
import { getProjects } from "@/lib/content";
import { projectTypeSchema } from "@/lib/validators";
import ProjectGrid from "@/components/work/ProjectGrid";
import FilterPills from "@/components/work/FilterPills";
import PageWarpTitle from "@/components/ui/PageWarpTitle";
export const metadata: Metadata = {
  title: "Work",
  description:
    "Selected explorations in development, interface design, graphics, video, and 3D.",
};
export const revalidate = 60;
export default async function Work({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  const { type } = await searchParams;
  const parsed = projectTypeSchema.safeParse(type);
  const active = parsed.success ? parsed.data : undefined;
  const projects = await getProjects(active);
  return (
    <div className="container page-section">
      <p className="eyebrow">THE SELECTED COLLECTION</p>
      <PageWarpTitle text="Made with intention." />
      <p className="page-lead">
        A little design. A little code. A lot of curiosity.
      </p>
      <FilterPills active={active} />
      <ProjectGrid projects={projects} />
    </div>
  );
}
