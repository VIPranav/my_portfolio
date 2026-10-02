"use client";
import HeroVector from "./HeroVector";
import WarpText from "./WarpText";
import { ButtonLink } from "@/components/ui/Button";
export function HeroPoster() {
  return (
    <div className="hero-poster">
      <div className="poster-orbit" />
      <div className="poster-orbit orbit-two" />
    </div>
  );
}
export default function Hero() {
  return (
    <section className="hero dark-section">
      <div className="hero-scene">
        <HeroVector />
      </div>
      <div className="hero-copy">
        <p className="eyebrow">
          <span className="status-dot" /> DESIGNER. DEVELOPER. ALWAYS CURIOUS.
        </p>
        <h1>
          <WarpText
            text={"Pranav VP.\nBetween Design & Code"}
            color="#f8f5ff"
            warpStrength={0.08}
            warpScale={1.7}
            speed={0.55}
            pointerInfluence={0.42}
            pointerStrength={0.38}
            refraction={0.018}
            ripple
            fontSize="clamp(3rem, 10vw, 9rem)"
            fontWeight={800}
            style={{ height: "320px" }}
          />
        </h1>
        <p>
          I connect the creative with the technical.
          <br />
          Turning good ideas into things that work.
        </p>
        <div className="button-row">
          <ButtonLink href="/work">
            Explore my work <span aria-hidden="true">↗</span>
          </ButtonLink>
          <ButtonLink href="/contact" className="button-ghost">
            Let’s talk <span aria-hidden="true">↗</span>
          </ButtonLink>
        </div>
      </div>
      <div className="hero-foot">
        <span>DESIGN WITH INTENTION. BUILD WITH CARE.</span>
        <a href="#disciplines" aria-label="Explore creative disciplines">
          Scroll to explore ↓
        </a>
      </div>
    </section>
  );
}
