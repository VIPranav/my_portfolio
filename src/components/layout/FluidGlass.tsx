"use client";

import { useEffect, useId, useRef, useState, type CSSProperties } from "react";
import { createPortal } from "react-dom";
import "./FluidGlass.css";

type LensProps = {
  scale?: number;
  ior?: number;
  thickness?: number;
  chromaticAberration?: number;
  anisotropy?: number;
};

// DOM adaptation of the React Bits lens: sample the live page backdrop instead
// of the demo's private WebGL scene. Material values control the optical styling.
export default function FluidGlass({
  lensProps = {},
}: {
  lensProps?: LensProps;
}) {
  const {
    scale = 0.25,
    ior = 1.15,
    thickness = 5,
    chromaticAberration = 0.1,
    anisotropy = 0.01,
  } = lensProps;
  const lensRef = useRef<HTMLDivElement>(null);
  const filterId = `fluid-glass-${useId().replace(/:/g, "")}`;
  const [enabled, setEnabled] = useState(false);
  const [displacement, setDisplacement] = useState("");

  useEffect(() => {
    const media = matchMedia(
      "(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
    );
    const update = () => setEnabled(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    // A radial displacement map bends the backdrop at the lens rim.
    const canvas = document.createElement("canvas");
    const size = 128;
    canvas.width = canvas.height = size;
    const context = canvas.getContext("2d");
    if (!context) return;
    const pixels = context.createImageData(size, size);
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const dx = (x + 0.5 - size / 2) / (size / 2);
        const dy = (y + 0.5 - size / 2) / (size / 2);
        const r = Math.hypot(dx, dy);
        const bend = r < 1 ? Math.sin(r * Math.PI) : 0;
        const offset = (y * size + x) * 4;
        pixels.data[offset] = 128 + dx * bend * 110;
        pixels.data[offset + 1] = 128 + dy * bend * 110;
        pixels.data[offset + 2] = 128;
        pixels.data[offset + 3] = 255;
      }
    }
    context.putImageData(pixels, 0, 0);
    setDisplacement(canvas.toDataURL());
  }, [enabled]);

  useEffect(() => {
    if (!enabled) return;
    const lens = lensRef.current;
    if (!lens) return;
    let raf = 0;
    let lastTime = 0;
    let shown = false;
    let x = 0;
    let y = 0;
    let targetX = 0;
    let targetY = 0;
    const draw = (time: number) => {
      raf = 0;
      const delta = Math.min((time - lastTime) / 1000, 0.05);
      lastTime = time;
      const damping = 1 - Math.exp(-delta / 0.075);
      x += (targetX - x) * damping;
      y += (targetY - y) * damping;
      lens.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
      if (Math.abs(targetX - x) + Math.abs(targetY - y) > 0.1)
        raf = requestAnimationFrame(draw);
    };
    const hide = () => {
      shown = false;
      lens.style.opacity = "0";
      cancelAnimationFrame(raf);
      raf = 0;
    };
    const move = (event: PointerEvent) => {
      if (event.pointerType !== "mouse" || document.hidden) {
        hide();
        return;
      }
      targetX = event.clientX;
      targetY = event.clientY;
      if (!shown) {
        x = targetX;
        y = targetY;
        lens.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
        lens.style.opacity = "1";
        shown = true;
      }
      if (!raf) {
        lastTime = performance.now();
        raf = requestAnimationFrame(draw);
      }
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Tab") hide();
    };
    window.addEventListener("pointermove", move, { passive: true });
    document.documentElement.addEventListener("pointerleave", hide);
    window.addEventListener("blur", hide);
    document.addEventListener("visibilitychange", hide);
    document.addEventListener("keydown", onKey);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", move);
      document.documentElement.removeEventListener("pointerleave", hide);
      window.removeEventListener("blur", hide);
      document.removeEventListener("visibilitychange", hide);
      document.removeEventListener("keydown", onKey);
    };
  }, [enabled]);

  if (!enabled) return null;
  const diameter = Math.max(48, Math.min(160, scale * 400));
  return createPortal(
    <div className="fluid-glass-overlay" aria-hidden="true">
      <svg
        className="fluid-glass-filters"
        width="0"
        height="0"
        focusable="false"
      >
        <defs>
          <filter
            id={filterId}
            x="0"
            y="0"
            width="100%"
            height="100%"
            colorInterpolationFilters="sRGB"
          >
            <feImage
              href={displacement || undefined}
              x="0"
              y="0"
              width="100%"
              height="100%"
              preserveAspectRatio="none"
              result="lens-map"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="lens-map"
              scale={Math.max(0, (ior - 1) * thickness * 24)}
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>
      <div
        ref={lensRef}
        className="fluid-glass-lens"
        style={
          {
            width: diameter,
            height: diameter,
            "--glass-filter": displacement
              ? `url("#${filterId}")`
              : "blur(1px)",
            "--glass-fringe": `${Math.max(0, chromaticAberration) * 12}px`,
            "--glass-blur": `${Math.max(0, anisotropy) * 10}px`,
          } as CSSProperties
        }
      />
    </div>,
    document.body,
  );
}
