import type { Metadata } from "next";
import { getMilestones } from "@/lib/content";
import { Reveal } from "@/components/ui/Reveal";
export const metadata: Metadata = {
  title: "Journey",
  description: "From school magazines at 16 to building digital products.",
};
export const revalidate = 60;
export default async function Journey() {
  const items = await getMilestones();
  return (
    <div className="container page-section">
      <p className="eyebrow">STILL A WORK IN PROGRESS</p>
      <h1 className="page-title">
        A little further.
        <br />
        <span className="muted">Every time.</span>
      </h1>
      <p className="page-lead">
        The path hasn’t been a straight line.
        <br />
        That’s what makes it interesting.
      </p>
      <div className="timeline">
        {items.map((m) => (
          <Reveal key={m.id}>
            <article className="timeline-item">
              <span className="timeline-year">{m.year}</span>
              <div className="glass-card">
                <h2>{m.title}</h2>
                <p>{m.description}</p>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
