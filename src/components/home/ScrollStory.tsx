"use client";
import { useRef, useState } from "react";
import { useMotionValueEvent, useScroll, useTransform } from "framer-motion";
import { Code2, PenTool, Layers, Film, Box } from "lucide-react";
const chapters = [
  {
    title: "Ideas, made real.",
    tag: "01 / DEVELOPMENT",
    body: "Interfaces are just the beginning. I connect frontend, backend, and databases to build experiences that actually work.",
    icon: Code2,
    label: "From concept to commit",
    note: "Next.js · React · TypeScript",
  },
  {
    title: "Clarity in every click.",
    tag: "02 / UI & UX",
    body: "Thoughtful hierarchy. Familiar interactions. Responsive interfaces that put the person using them first.",
    icon: Layers,
    label: "Designed around people",
    note: "Flows · Interfaces · Prototypes",
  },
  {
    title: "Make it mean something.",
    tag: "03 / GRAPHIC DESIGN",
    body: "My creative foundation: telling a clear story through typography, composition, and visual identity.",
    icon: PenTool,
    label: "Form meets feeling",
    note: "Photoshop · Canva · Illustrator",
  },
  {
    title: "Find the right rhythm.",
    tag: "04 / VIDEO",
    body: "From the first frame to the final cut, editing is about giving a story the space and pace it deserves.",
    icon: Film,
    label: "A story in motion",
    note: "Premiere Pro · Editing",
  },
  {
    title: "A new dimension.",
    tag: "05 / 3D",
    body: "Exploring form, light, and depth. Learning how a different perspective can bring an idea to life.",
    icon: Box,
    label: "Space to experiment",
    note: "Autodesk Maya · 3D studies",
  },
];
function Chapter({ index }: { index: number }) {
  const c = chapters[index];
  const Icon = c.icon;
  return (
    <div className="story-content">
      <div>
        <p className="eyebrow">{c.tag}</p>
        <h2>{c.title}</h2>
        <p className="body-copy">{c.body}</p>
      </div>
      <div className="story-art">
        <div className="story-art-grid" />
        <Icon size={110} strokeWidth={0.7} />
        <h3>{c.label}</h3>
        <p>{c.note}</p>
      </div>
    </div>
  );
}
export default function ScrollStory() {
  const ref = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });
  const index = useTransform(scrollYProgress, [0, 1], [0, 4.999]);
  useMotionValueEvent(index, "change", (value) =>
    setActive(Math.min(4, Math.floor(value))),
  );
  return (
    <section ref={ref} id="disciplines" className="scroll-story">
      <div className="story-sticky container">
        <div key={active} className="story-desktop">
          <Chapter index={active} />
          <div
            className="story-progress"
            aria-label={`Discipline ${active + 1} of 5`}
          >
            {chapters.map((c, i) => (
              <span key={c.tag} className={i === active ? "active" : ""} />
            ))}
          </div>
        </div>
        <div className="story-mobile">
          {chapters.map((c, i) => (
            <Chapter key={c.tag} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
