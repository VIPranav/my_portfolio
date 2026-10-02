import type { Metadata } from "next";
import { getSkills } from "@/lib/content";
import PageWarpTitle from "@/components/ui/PageWarpTitle";
export const metadata: Metadata = {
  title: "Skills",
  description:
    "An honest view of my design, development, art, video, 3D, and AI workflow toolkit.",
};
export const revalidate = 60;
const levels = { FOUNDATIONAL: 1, PRACTICAL: 2, PROFICIENT: 3 };
const toSectionId = (name: string) => name.toLowerCase().replaceAll(" ", "-");
export default async function Skills() {
  const groups = await getSkills();
  return (
    <div className="container page-section">
      <p className="eyebrow">THE TOOLKIT</p>
      <PageWarpTitle text={"Different tools.\nOne considered approach."} />
      <p className="page-lead">
        An honest snapshot of what I use, what I know,
        <br />
        and what I’m still exploring.
      </p>
      <div className="skills-grid">
        {groups.map((g) => (
          <section className="glass-card" id={toSectionId(g.name)} key={g.id}>
            <h2>{g.name}</h2>
            {g.skills.map((s) => (
              <div className="skill-row" key={s.id}>
                <span>{s.name}</span>
                <div>
                  <span className="skill-dots" aria-hidden="true">
                    {[1, 2, 3].map((n) => (
                      <i
                        className={n <= levels[s.level] ? "filled" : ""}
                        key={n}
                      />
                    ))}
                  </span>
                  <span className="skill-label">{s.level.toLowerCase()}</span>
                </div>
              </div>
            ))}
          </section>
        ))}
      </div>
      <p className="small muted">
        Foundational: learning the essentials. Practical: using it in projects.
        Proficient: confident with regular use.
      </p>
    </div>
  );
}
