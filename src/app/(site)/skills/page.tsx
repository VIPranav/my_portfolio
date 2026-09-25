import type { Metadata } from "next";
import { getSkills } from "@/lib/content";
export const metadata: Metadata = {
  title: "Skills",
  description:
    "An honest view of my design, development, video, 3D, and AI workflow toolkit.",
};
export const revalidate = 60;
const levels = { FOUNDATIONAL: 1, PRACTICAL: 2, PROFICIENT: 3 };
export default async function Skills() {
  const groups = await getSkills();
  return (
    <div className="container page-section">
      <p className="eyebrow">THE TOOLKIT</p>
      <h1 className="page-title">
        Different tools.
        <br />
        <span className="muted">One considered approach.</span>
      </h1>
      <p className="page-lead">
        An honest snapshot of what I use, what I know,
        <br />
        and what I’m still exploring.
      </p>
      <div className="skills-grid">
        {groups.map((g) => (
          <section className="glass-card" key={g.id}>
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
