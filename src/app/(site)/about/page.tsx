import type { Metadata } from "next";
import { Reveal } from "@/components/ui/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import CtaBanner from "@/components/home/CtaBanner";
export const metadata: Metadata = {
  title: "About",
  description:
    "Pranav VP — a designer and developer with a creative foundation that started at 16.",
};
export default function About() {
  return (
    <>
      <div className="container page-section">
        <p className="eyebrow">A LITTLE ABOUT ME</p>
        <h1 className="page-title">
          One curious mind.
          <br />
          <span className="muted">A few different lenses.</span>
        </h1>
        <div className="about-grid">
          <div
            className="portrait-placeholder"
            role="img"
            aria-label="Portrait placeholder for Pranav VP"
          >
            <span>VP.</span>
            <p>[PORTRAIT PLACEHOLDER]</p>
          </div>
          <div>
            <h2>
              I like the space
              <br />
              where ideas become real.
            </h2>
            {[
              "I started graphic design at 16, making school magazines, pamphlets, posters, and visual materials. Those early projects taught me that good design makes things easier to understand, not just better to look at.",
              "That curiosity grew into video editing, UI/UX, and 3D. Along the way, I started learning to code. Understanding how interfaces, backends, and databases fit together changed what I could make.",
              "Today, I bring those disciplines together. I use modern web tools and AI-assisted workflows, while staying involved in the decisions, the details, and the work of getting something ready to ship.",
            ].map((p) => (
              <Reveal key={p}>
                <p className="body-copy">{p}</p>
              </Reveal>
            ))}
            <ButtonLink href="/resume" className="button-secondary">
              View résumé ↗
            </ButtonLink>
          </div>
        </div>
        <div className="values-grid">
          {[
            [
              "Clarity first.",
              "Make the important things easy to find and understand.",
            ],
            [
              "Care in the details.",
              "The small decisions are part of the experience.",
            ],
            [
              "Keep learning.",
              "Stay curious, test assumptions, and improve through making.",
            ],
          ].map(([h, p]) => (
            <div key={h}>
              <h3>{h}</h3>
              <p>{p}</p>
            </div>
          ))}
        </div>
      </div>
      <CtaBanner />
    </>
  );
}
