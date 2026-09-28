"use client";
import dynamic from "next/dynamic";
import WarpText from "./WarpText";
import { useEffect, useState } from "react";
import { ButtonLink } from "@/components/ui/Button";
const Scene = dynamic(() => import("@/components/three/Scene"), {
  ssr: false,
  loading: () => <HeroPoster />,
});
export function HeroPoster() {
  return (
    <div className="hero-poster">
      <div className="poster-orbit" />
      <div className="poster-orbit orbit-two" />
    </div>
  );
}
export default function Hero() {
  const [enabled, setEnabled] = useState(false);
  useEffect(() => {
    const media = matchMedia("(prefers-reduced-motion: reduce)");
    const check = () => {
      const connection = navigator as Navigator & {
        connection?: { saveData?: boolean };
      };
      setEnabled(
        !media.matches &&
          navigator.hardwareConcurrency > 4 &&
          innerWidth >= 768 &&
          !connection.connection?.saveData,
      );
    };
    check();
    media.addEventListener("change", check);
    return () => media.removeEventListener("change", check);
  }, []);
  return (
    <section className="hero dark-section">
      <div className="hero-scene" aria-hidden="true">
        {enabled ? <Scene /> : <HeroPoster />}
      </div>
      <div className="hero-copy">
        <p className="eyebrow">
          <span className="status-dot" /> DESIGNER. DEVELOPER. ALWAYS CURIOUS.
        </p>
        <h1>
          <WarpText
            text={"Pranav VP.\nDesign that ships."}
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
