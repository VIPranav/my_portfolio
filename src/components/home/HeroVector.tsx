"use client";

import { useEffect, useId, useRef } from "react";

export default function HeroVector() {
  const rootRef = useRef<HTMLDivElement>(null);
  const tiltRef = useRef<HTMLDivElement>(null);
  const turnRef = useRef<HTMLDivElement>(null);
  const angleRef = useRef(0);
  const id = useId().replace(/:/g, "");

  useEffect(() => {
    const root = rootRef.current;
    const tilt = tiltRef.current;
    const hero = root?.closest(".hero");
    const orbit = root?.querySelector<SVGElement>(".fish-orbit");
    if (!root || !tilt || !hero || !orbit) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let x = 0;
    let y = 0;
    let visible = false;
    const sync = () => {
      orbit.style.animationPlayState =
        visible && !document.hidden && !reducedMotion.matches
          ? "running"
          : "paused";
    };
    const paint = () => {
      frame = 0;
      tilt.style.transform = `rotateX(${18 - y * 22}deg) rotateY(${x * 28}deg)`;
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(paint);
    };
    const move = (event: PointerEvent) => {
      if (reducedMotion.matches || event.pointerType === "touch") return;
      const bounds = hero.getBoundingClientRect();
      x = (event.clientX - bounds.left) / bounds.width - 0.5;
      y = (event.clientY - bounds.top) / bounds.height - 0.5;
      schedule();
    };
    const reset = () => {
      x = y = 0;
      schedule();
    };
    const preferenceChanged = () => {
      reset();
      sync();
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      sync();
    });
    observer.observe(hero);
    sync();
    document.addEventListener("visibilitychange", sync);
    reducedMotion.addEventListener("change", preferenceChanged);
    hero.addEventListener("pointermove", move as EventListener);
    hero.addEventListener("pointerleave", reset);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      document.removeEventListener("visibilitychange", sync);
      reducedMotion.removeEventListener("change", preferenceChanged);
      hero.removeEventListener("pointermove", move as EventListener);
      hero.removeEventListener("pointerleave", reset);
    };
  }, []);

  const rotate = () => {
    angleRef.current += 180;
    if (turnRef.current)
      turnRef.current.style.transform = `rotateZ(${angleRef.current}deg)`;
  };

  return (
    <div ref={rootRef} className="hero-vector">
      <div className="vector-stage" aria-hidden="true">
        <div ref={tiltRef} className="fish-tilt">
          <div ref={turnRef} className="fish-turn">
            <svg
              className="fish-orbit"
              viewBox="0 0 400 400"
              fill="none"
              focusable="false"
            >
              <defs>
                <linearGradient
                  id={`${id}-light`}
                  x1="110"
                  y1="70"
                  x2="300"
                  y2="290"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#ffffff" />
                  <stop offset="0.5" stopColor="#d8e9f5" />
                  <stop offset="1" stopColor="#779caf" />
                </linearGradient>
                <linearGradient
                  id={`${id}-dark`}
                  x1="110"
                  y1="70"
                  x2="300"
                  y2="290"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#66849b" />
                  <stop offset="0.45" stopColor="#253c54" />
                  <stop offset="1" stopColor="#0b1526" />
                </linearGradient>
              </defs>
              {["light", "dark"].map((tone, index) => (
                <g
                  key={tone}
                  transform={index ? "rotate(180 200 200)" : undefined}
                >
                  <path
                    d="M 275 245 C 308 204 316 145 282 102 C 251 63 197 59 170 85 C 143 111 151 147 175 165 C 196 181 228 179 247 199 C 260 212 263 230 257 246 L 284 278 L 278 253 L 310 257 Z"
                    fill={`url(#${id}-${tone})`}
                    stroke={index ? "#88a7bc" : "#f1f7ff"}
                    strokeWidth="1.5"
                  />
                  <path
                    d="M 227 163 Q 208 193 232 210 Q 233 180 247 181 M 284 126 Q 310 153 298 181"
                    fill={index ? "#57798e" : "#b1cddc"}
                    opacity="0.8"
                  />
                  <path
                    d="M 179 88 C 207 69 251 80 273 110 M 260 204 Q 280 225 273 241"
                    stroke={index ? "#9cbacc" : "#ffffff"}
                    strokeWidth="3"
                    strokeLinecap="round"
                    opacity="0.65"
                  />
                  <path
                    d="M 184 117 Q 178 139 193 151"
                    stroke={index ? "#9cbacc" : "#7898ad"}
                    strokeWidth="1.5"
                  />
                  <circle
                    cx="180"
                    cy="105"
                    r="7"
                    fill={index ? "#edf6ff" : "#162b40"}
                  />
                  <circle
                    cx="178"
                    cy="103"
                    r="2"
                    fill={index ? "#162b40" : "#ffffff"}
                  />
                </g>
              ))}
            </svg>
          </div>
        </div>
      </div>
      <button
        type="button"
        className="vector-control"
        onClick={rotate}
        aria-label="Rotate the yin-yang fish by 180 degrees"
      >
        Spin the fish <span aria-hidden="true">↻</span>
      </button>
    </div>
  );
}
