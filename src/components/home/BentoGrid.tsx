import { Code2, PenTool, Sparkles, Film, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";
export default function BentoGrid() {
  return (
    <section className="section bento-section">
      <div className="container">
        <div className="section-heading">
          <div>
            <p className="eyebrow">A CONNECTED TOOLKIT</p>
            <h2>
              Creative by instinct.
              <br />
              <span className="muted">Technical by curiosity.</span>
            </h2>
          </div>
          <Link className="text-link" href="/skills">
            All skills <ArrowUpRight size={16} />
          </Link>
        </div>
        <Reveal>
          <div className="bento-grid">
            <div className="bento bento-design">
              <PenTool size={28} />
              <h3>
                It starts with
                <br />a good eye.
              </h3>
              <p>
                Visual design, thoughtful interfaces,
                <br />
                and a clear point of view.
              </p>
              <div className="app-icons">
                <span>Ps</span>
                <span>Ca</span>
                <span>Fi</span>
              </div>
            </div>
            <div className="bento bento-code">
              <Code2 size={28} />
              <h3>Then, make it work.</h3>
              <p>Modern web tools. Connected systems.</p>
              <pre aria-label="Code illustration">
                <code>
                  <span>const</span> idea = await imagine();
                  <br />
                  <span>return</span> build(idea);
                </code>
              </pre>
              <p className="small">React · Next.js · TypeScript · Prisma</p>
            </div>
            <div className="bento">
              <Film size={26} />
              <h3>Beyond the still.</h3>
              <p>
                Video editing and an evolving
                <br />
                exploration of 3D.
              </p>
            </div>
            <div className="bento bento-ai">
              <Sparkles size={26} />
              <h3>Curiosity, amplified.</h3>
              <p>
                AI-assisted workflows.
                <br />
                Human judgment at every step.
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
