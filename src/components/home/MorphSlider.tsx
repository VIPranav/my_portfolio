"use client";

import { useEffect, useRef } from "react";
import { Renderer, Triangle, Program, Mesh, Texture } from "ogl";
import type { MotionValue } from "framer-motion";
import "./MorphSlider.css";

type Item = { image: string; caption: string };

export function getMorphPosition(progress: number, count: number) {
  const position = Math.max(0, Math.min(progress, 1)) * count;
  const current = Math.min(count - 1, Math.floor(position));
  const next = Math.min(current + 1, count - 1);
  const blend =
    current === next ? 0 : Math.max(0, (position - current - 0.55) / 0.45);
  return { current, next, blend, active: blend >= 0.5 ? next : current };
}

const vertexShader = `
attribute vec2 position;
attribute vec2 uv;
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const fragmentShader = `
precision highp float;

uniform sampler2D tCurrent;
uniform sampler2D tNext;
uniform vec2 uResolution;
uniform vec2 uCurrentSize;
uniform vec2 uNextSize;
uniform float uProgress;
uniform float uDir;
uniform int uMode;
uniform float uIntensity;
uniform float uScale;
uniform float uAberration;
uniform float uDrift;
uniform float uTime;
uniform float uReduce;
uniform vec2 uPointer;
uniform vec3 uOverlay;

varying vec2 vUv;

const float PI = 3.14159265359;

float hash11(float p) {
  p = fract(p * 0.1031);
  p *= p + 33.33;
  p *= p + p;
  return fract(p);
}

float hash21(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  float a = hash21(i);
  float b = hash21(i + vec2(1.0, 0.0));
  float c = hash21(i + vec2(0.0, 1.0));
  float d = hash21(i + vec2(1.0, 1.0));
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 5; i++) {
    v += a * noise(p);
    p *= 2.0;
    a *= 0.5;
  }
  return v;
}

mat2 rot(float a) {
  float s = sin(a);
  float c = cos(a);
  return mat2(c, -s, s, c);
}

vec2 coverUV(vec2 uv, vec2 res, vec2 img) {
  float rA = res.x / max(res.y, 1.0);
  float iA = img.x / max(img.y, 1.0);
  vec2 s = vec2(1.0);
  float ratio = rA / max(iA, 0.0001);
  if (ratio > 1.0) {
    s.y = 1.0 / ratio;
  } else {
    s.x = ratio;
  }
  return (uv - 0.5) * s + 0.5;
}

void main() {
  float p = clamp(uProgress, 0.0, 1.0);
  float env = sin(p * PI);

  vec2 uv = vUv;

  uv += vec2(sin(uTime * 0.25 + uv.y * 4.0), cos(uTime * 0.22 + uv.x * 4.0)) * uDrift * 0.008;
  uv = (uv - 0.5) * (1.0 - uDrift * 0.02 * sin(uTime * 0.4)) + 0.5;

  vec2 uvC = uv;
  vec2 uvN = uv;
  float m = smoothstep(0.0, 1.0, p);

  if (uReduce < 0.5) {
    if (uMode == 3) {
      vec2 c = uv - 0.5;
      float r = length(c);
      float ang = env * uIntensity * 3.5 * (1.0 - r);
      uvC = rot(ang) * c + 0.5;
      uvN = rot(-ang) * c + 0.5;
      m = smoothstep(0.0, 1.0, p);
    } else if (uMode == 1) {
      float d = distance(uv, uPointer);
      float ring = p * 1.6;
      float wave = sin((d - ring) * 30.0) * env;
      vec2 dir = normalize(uv - uPointer + 1e-4);
      vec2 disp = dir * wave * uIntensity * 0.25;
      uvC = uv + disp;
      uvN = uv + disp * 0.6;
      m = 1.0 - smoothstep(ring - 0.03, ring + 0.03, d);
    } else if (uMode == 2) {
      float slices = 14.0;
      float row = floor(uv.y * slices);
      float rnd = hash11(row);
      vec2 disp = vec2((rnd - 0.5) * env * uIntensity * 0.6, 0.0);
      uvC = uv + disp;
      uvN = uv + disp;
      float localX = uDir > 0.0 ? uv.x : 1.0 - uv.x;
      float th = p * 1.5 - 0.25 + (rnd - 0.5) * 0.25;
      m = 1.0 - smoothstep(th - 0.06, th + 0.06, localX);
    } else {
      float nn = fbm(uv * uScale + uTime * 0.03);
      float warp = fbm(uv * uScale * 1.7 - uTime * 0.02);
      vec2 g = vec2(nn, warp) - 0.5;
      uvC = uv + g * uIntensity * 0.5 * p;
      uvN = uv - g * uIntensity * 0.5 * (1.0 - p);
      m = smoothstep(nn - 0.15, nn + 0.15, p);
    }
  }

  vec2 sC = coverUV(uvC, uResolution, uCurrentSize);
  vec2 sN = coverUV(uvN, uResolution, uNextSize);

  float ca = uReduce < 0.5 ? uAberration * env * 0.03 : 0.0;

  vec3 colC = vec3(
    texture2D(tCurrent, sC + vec2(ca, 0.0)).r,
    texture2D(tCurrent, sC).g,
    texture2D(tCurrent, sC - vec2(ca, 0.0)).b
  );
  vec3 colN = vec3(
    texture2D(tNext, sN + vec2(ca, 0.0)).r,
    texture2D(tNext, sN).g,
    texture2D(tNext, sN - vec2(ca, 0.0)).b
  );

  m = p <= 0.0 ? 0.0 : (p >= 1.0 ? 1.0 : m);
  vec3 col = mix(colC, colN, m);

  float vig = (1.0 - smoothstep(0.25, 1.25, length(uv - 0.5)));
  col = mix(col, uOverlay, (1.0 - vig) * 0.28);

  gl_FragColor = vec4(col, 1.0);
}
`;

/** React Bits morph shaders adapted for reversible, scroll-driven transitions. */
export default function MorphSlider({
  items,
  progress,
  active,
}: {
  items: Item[];
  progress: MotionValue<number>;
  active: number;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const container = containerRef.current;
    if (!container || !items.length) return;
    let renderer: Renderer;
    try {
      renderer = new Renderer({
        webgl: 1,
        alpha: false,
        antialias: true,
        dpr: Math.min(devicePixelRatio || 1, 2),
      });
    } catch {
      return;
    }
    const gl = renderer.gl;
    const canvas = gl.canvas as HTMLCanvasElement;
    canvas.className = "morph-slider-canvas";
    canvas.setAttribute("aria-hidden", "true");
    container.appendChild(canvas);
    const textures = items.map(
      () =>
        new Texture(gl, {
          generateMipmaps: false,
          minFilter: gl.LINEAR,
          magFilter: gl.LINEAR,
          wrapS: gl.CLAMP_TO_EDGE,
          wrapT: gl.CLAMP_TO_EDGE,
        }),
    );
    const sizes = items.map(() => [1, 1]);
    const loaded = items.map(() => false);
    const media = matchMedia("(prefers-reduced-motion: reduce)");
    const geometry = new Triangle(gl);
    const program = new Program(gl, {
      vertex: vertexShader,
      fragment: fragmentShader,
      uniforms: {
        tCurrent: { value: textures[0] },
        tNext: { value: textures[0] },
        uResolution: { value: [1, 1] },
        uCurrentSize: { value: [1, 1] },
        uNextSize: { value: [1, 1] },
        uProgress: { value: 0 },
        uDir: { value: 1 },
        uMode: { value: 0 },
        uIntensity: { value: 0.55 },
        uScale: { value: 2.4 },
        uAberration: { value: 0.35 },
        uDrift: { value: media.matches ? 0 : 0.4 },
        uTime: { value: 0 },
        uReduce: { value: media.matches ? 1 : 0 },
        uPointer: { value: [0.5, 0.5] },
        uOverlay: { value: [0, 0, 0] },
      },
    });
    const mesh = new Mesh(gl, { geometry, program });
    let disposed = false;
    let lost = false;
    let visible = false;
    let raf = 0;
    const render = (time: number) => {
      if (disposed || lost) return;
      const { current, next, blend } = getMorphPosition(
        progress.get(),
        items.length,
      );
      const ready = loaded[current] && loaded[next];
      container.dataset.ready = String(ready);
      if (!ready) return;
      const u = program.uniforms;
      u.tCurrent.value = textures[current];
      u.tNext.value = textures[next];
      u.uCurrentSize.value = sizes[current];
      u.uNextSize.value = sizes[next];
      u.uProgress.value = blend;
      u.uTime.value = media.matches ? 0 : time * 0.001;
      renderer.render({ scene: mesh });
    };
    const tick = (time: number) => {
      raf = 0;
      if (!visible || document.hidden || disposed || lost) return;
      render(time);
      if (!media.matches) raf = requestAnimationFrame(tick);
    };
    const wake = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
      if (visible && !document.hidden && !disposed && !lost)
        raf = requestAnimationFrame(tick);
    };
    const images = items.map((item, index) => {
      const image = new Image();
      image.onload = () => {
        if (disposed || lost) return;
        textures[index].image = image;
        textures[index].needsUpdate = true;
        sizes[index] = [image.naturalWidth, image.naturalHeight];
        loaded[index] = true;
        wake();
      };
      image.crossOrigin = "anonymous";
      image.src = item.image;
      return image;
    });
    const resize = () => {
      if (disposed || lost) return;
      const rect = container.getBoundingClientRect();
      renderer.setSize(Math.max(rect.width, 1), Math.max(rect.height, 1));
      program.uniforms.uResolution.value = [
        gl.drawingBufferWidth,
        gl.drawingBufferHeight,
      ];
      wake();
    };
    const observer = new ResizeObserver(resize);
    observer.observe(container);
    const intersection = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      wake();
    });
    intersection.observe(container);
    const unsubscribe = progress.on("change", wake);
    const onMotion = () => {
      program.uniforms.uReduce.value = media.matches ? 1 : 0;
      program.uniforms.uDrift.value = media.matches ? 0 : 0.4;
      wake();
    };
    const onLost = (event: Event) => {
      event.preventDefault();
      lost = true;
      delete container.dataset.ready;
      if (raf) cancelAnimationFrame(raf);
    };
    canvas.addEventListener("webglcontextlost", onLost);
    media.addEventListener("change", onMotion);
    document.addEventListener("visibilitychange", wake);
    resize();
    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      unsubscribe();
      observer.disconnect();
      intersection.disconnect();
      media.removeEventListener("change", onMotion);
      document.removeEventListener("visibilitychange", wake);
      canvas.removeEventListener("webglcontextlost", onLost);
      images.forEach((image) => {
        image.onload = null;
      });
      if (!lost) {
        textures.forEach((texture) => gl.deleteTexture(texture.texture));
        geometry.remove();
        program.remove();
        gl.getExtension("WEBGL_lose_context")?.loseContext();
      }
      canvas.remove();
      delete container.dataset.ready;
    };
  }, [items, progress]);
  return (
    <div
      ref={containerRef}
      className="morph-slider"
      role="img"
      aria-label={items[active]?.caption}
      style={{ backgroundImage: `url("${items[active]?.image}")` }}
    />
  );
}
