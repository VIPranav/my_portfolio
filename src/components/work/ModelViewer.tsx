"use client";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
const ModelCanvas = dynamic(() => import("@/components/three/ModelCanvas"), {
  ssr: false,
  loading: () => <p>Loading model…</p>,
});
export default function ModelViewer({ url }: { url: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [interactive, setInteractive] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setVisible(true);
        observer.disconnect();
      }
    });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return (
    <div ref={ref} className="model-viewer">
      <p>3D study — drag to rotate after enabling the viewer.</p>
      <button
        className="button button-secondary"
        onClick={() => setInteractive((v) => !v)}
      >
        {interactive ? "Close 3D viewer" : "Explore 3D model"}
      </button>
      {visible && interactive && <ModelCanvas url={url} />}
    </div>
  );
}
