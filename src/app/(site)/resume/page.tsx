import type { Metadata } from "next";
import PrintButton from "@/components/ui/PrintButton";
import { getSettings, getSkills } from "@/lib/content";
export const metadata: Metadata = {
  title: "Résumé",
  description: "Pranav VP — design and development résumé.",
};
export const revalidate = 60;
export default async function Resume() {
  const [settings, groups] = await Promise.all([getSettings(), getSkills()]);
  return (
    <article className="container page-section resume">
      <div className="no-print button-row">
        <PrintButton />
        {settings.resumeUrl && (
          <a href={settings.resumeUrl} className="button" download>
            Download résumé PDF ↓
          </a>
        )}
      </div>
      <h1 className="page-title">Pranav VP</h1>
      <p className="page-lead">Design & development</p>
      {settings.email && <p>{settings.email}</p>}
      <section>
        <h2>Profile</h2>
        <p>{settings.bio}</p>
      </section>
      <section>
        <h2>Experience & approach</h2>
        <p>
          Started graphic design at 16, creating school magazines, pamphlets,
          posters, and visual materials. Practical experience with responsive
          interfaces, dashboards, APIs, database-driven apps, Linux development
          environments, and Git workflows.
        </p>
        <p>
          AI-assisted development across backends, authentication, databases,
          and application logic, with a focus on understanding how the pieces
          fit together.
        </p>
      </section>
      <section>
        <h2>Toolkit</h2>
        {groups.map((g) => (
          <p key={g.id}>
            <strong>{g.name}:</strong>{" "}
            {g.skills
              .map((s) => `${s.name} (${s.level.toLowerCase()})`)
              .join(", ")}
          </p>
        ))}
      </section>
      <section>
        <h2>Education & selected projects</h2>
        <p>
          [PLACEHOLDER — add verified education, dates, and project experience.]
        </p>
      </section>
    </article>
  );
}
