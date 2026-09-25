import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProjects, getProject } from "@/lib/content";
import { getAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";
import Gallery from "@/components/work/Gallery";
import ModelViewer from "@/components/work/ModelViewer";
export const revalidate = 60;
export async function generateStaticParams() {
  return (await getProjects()).map((p) => ({ slug: p.slug }));
}
export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ preview?: string }>;
}): Promise<Metadata> {
  if ((await searchParams).preview)
    return {
      title: "Private preview",
      robots: { index: false, follow: false },
    };
  const p = await getProject((await params).slug);
  return p
    ? {
        title: p.title,
        description: p.summary,
        openGraph: { images: [p.coverUrl] },
      }
    : { title: "Project not found" };
}
export default async function CaseStudy({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ preview?: string }>;
}) {
  const { slug } = await params;
  const { preview } = await searchParams;
  let project = await getProject(slug);
  if (preview === "1") {
    if (!(await getAdmin())) notFound();
    project = await prisma.project.findUnique({
      where: { slug },
      include: { media: { orderBy: { order: "asc" } } },
    });
  }
  if (!project) notFound();
  const all = await getProjects();
  const next = all[(all.findIndex((p) => p.slug === slug) + 1) % all.length];
  return (
    <>
      <div className="container page-section case-heading">
        {preview && (
          <p className="notice">
            Private admin preview · {project.published ? "Published" : "Draft"}
          </p>
        )}
        <Link href="/work" className="text-link">
          ← All work
        </Link>
        <h1 className="page-title">{project.title}</h1>
        <p className="page-lead">{project.summary}</p>
      </div>
      <div className="case-cover">
        <Image
          src={project.coverUrl}
          alt={`${project.title} cover`}
          fill
          priority
          sizes="100vw"
          unoptimized={project.coverUrl.startsWith("https:")}
        />
      </div>
      <div className="container">
        <div className="case-meta">
          <div>
            <span>Role</span>
            <p>{project.role}</p>
          </div>
          <div>
            <span>Year</span>
            <p>{project.year}</p>
          </div>
          <div>
            <span>Toolkit</span>
            <p>{project.tools.join(" · ")}</p>
          </div>
          <div>
            {project.liveUrl && (
              <a
                className="text-link"
                href={project.liveUrl}
                rel="noreferrer"
                target="_blank"
              >
                Live project ↗
              </a>
            )}
            {project.repoUrl && (
              <a
                className="text-link"
                href={project.repoUrl}
                rel="noreferrer"
                target="_blank"
              >
                Source code ↗
              </a>
            )}
          </div>
        </div>
        {(
          [
            ["Overview", project.overview],
            ["Problem", project.problem],
            ["Process", project.process],
            ["Result", project.result],
          ] as const
        ).map(
          ([label, body]) =>
            body && (
              <section className="case-chapter" key={label}>
                <h2>{label}</h2>
                <p>{body}</p>
              </section>
            ),
        )}
        <Gallery media={project.media} />
        {project.modelUrl && <ModelViewer url={project.modelUrl} />}
        {next && next.slug !== slug && (
          <Link href={`/work/${next.slug}`} className="next-project">
            <span className="eyebrow">UP NEXT</span>
            <h2>{next.title} ↗</h2>
          </Link>
        )}
      </div>
    </>
  );
}
