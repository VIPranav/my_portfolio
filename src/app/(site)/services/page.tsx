import type { Metadata } from "next";
import { Code2, Layers, PenTool, Film } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
export const metadata: Metadata = {
  title: "Services",
  description:
    "Web apps, UI/UX, visual design, and video — with design and development working together.",
};
export default function Services() {
  return (
    <div className="container page-section">
      <p className="eyebrow">HOW I CAN HELP</p>
      <h1 className="page-title">
        From “what if”
        <br />
        <span className="muted">to “here it is.”</span>
      </h1>
      <p className="page-lead">
        A thoughtful partner for the idea you want to bring to life.
      </p>
      <div className="services-grid">
        {[
          [
            "Web apps",
            "Responsive interfaces, dashboards, API integrations, and database-driven experiences.",
            Code2,
          ],
          [
            "UI/UX design",
            "Clear flows, considered layouts, and interfaces built around real needs.",
            Layers,
          ],
          [
            "Branding & graphics",
            "Visual identities, social graphics, posters, and print that tell a clear story.",
            PenTool,
          ],
          [
            "Video & 3D",
            "Video editing with purpose, and exploratory 3D work with an honest scope.",
            Film,
          ],
        ].map(([title, description, Icon]) => {
          const Symbol = Icon as typeof Code2;
          return (
            <article key={String(title)} className="glass-card">
              <Symbol size={32} />
              <h2>{String(title)}</h2>
              <p>{String(description)}</p>
              <ButtonLink href="/contact" className="button-secondary">
                Start a project ↗
              </ButtonLink>
            </article>
          );
        })}
      </div>
    </div>
  );
}
