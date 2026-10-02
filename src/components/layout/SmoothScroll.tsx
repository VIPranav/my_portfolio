"use client";
import { useEffect } from "react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
export default function SmoothScroll() {
  useEffect(() => {
    const media = matchMedia("(prefers-reduced-motion: reduce)");
    const pointer = matchMedia("(pointer: fine)");
    let lenis: Lenis | undefined;
    const update = () => {
      lenis?.destroy();
      lenis = undefined;
      if (!media.matches && pointer.matches)
        lenis = new Lenis({
          autoRaf: true,
          anchors: { offset: -64 },
          lerp: 0.14,
          syncTouch: false,
          prevent: (node) => node.tagName === "DIALOG",
        });
    };
    update();
    media.addEventListener("change", update);
    pointer.addEventListener("change", update);
    return () => {
      media.removeEventListener("change", update);
      pointer.removeEventListener("change", update);
      lenis?.destroy();
    };
  }, []);
  return null;
}
