"use client";

import dynamic from "next/dynamic";

const MoltenMetal = dynamic(() => import("./MoltenMetal"), { ssr: false });

export default function SiteBackground() {
  return (
    <div className="site-background" aria-hidden="true">
      <MoltenMetal
        color1="#16265a"
        color2="#7186c2"
        color3="#b7d5f5"
        speed={0.35}
        scale={4}
        detail={3}
        glow={1.4}
        coreSize={0.1}
        swirl={1}
        fold={-0.2}
        blackPoint={0.06}
        brightness={1.05}
        colorMode="molten"
        grain
        grainIntensity={0.025}
        mouseInteraction
        mouseStrength={0.3}
        opacity={0.65}
      />
    </div>
  );
}
