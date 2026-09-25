"use client";
import { useEffect } from "react";
import Lenis from "lenis";
export default function SmoothScroll() {
  useEffect(() => {
    const media = matchMedia("(prefers-reduced-motion: reduce)");
    let lenis: Lenis | undefined;
    const update = () => {
      lenis?.destroy();
      lenis = undefined;
      if (!media.matches && matchMedia("(pointer: fine)").matches)
        lenis = new Lenis({ autoRaf: true, anchors: true, duration: 1.05 });
    };
    update();
    media.addEventListener("change", update);
    return () => {
      media.removeEventListener("change", update);
      lenis?.destroy();
    };
  }, []);
  return null;
}
