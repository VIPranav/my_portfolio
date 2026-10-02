"use client";

import WarpText from "@/components/home/WarpText";

type PageWarpTitleProps = {
  text: string;
  className?: string;
};

export default function PageWarpTitle({
  text,
  className = "",
}: PageWarpTitleProps) {
  return (
    <h1 className={`page-title page-warp-title ${className}`.trim()}>
      <WarpText
        text={text}
        color="#f8f5ff"
        warpStrength={0.08}
        warpScale={1.7}
        speed={0.55}
        pointerInfluence={0.42}
        pointerStrength={0.38}
        refraction={0.018}
        ripple
        fontSize="clamp(2.8rem, 6.8vw, 6.4rem)"
        fontWeight={600}
        letterSpacing="-0.055em"
        lineHeight={1.05}
        className="page-warp-text"
      />
    </h1>
  );
}
