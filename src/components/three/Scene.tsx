"use client";
import { Canvas } from "@react-three/fiber";
import { PerformanceMonitor } from "@react-three/drei";
import { Component, type ReactNode, useState } from "react";
import HeroObject from "./HeroObject";
import { HeroPoster } from "@/components/home/Hero";
class SceneBoundary extends Component<
  { children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? <HeroPoster /> : this.props.children;
  }
}
export default function Scene() {
  const [dpr, setDpr] = useState(1.5);
  return (
    <SceneBoundary>
      <Canvas
        dpr={dpr}
        camera={{ position: [0, 0, 7.5], fov: 38 }}
        gl={{ antialias: false, alpha: true }}
        fallback={<HeroPoster />}
      >
        <PerformanceMonitor onDecline={() => setDpr(1)} />
        <ambientLight intensity={1.4} />
        <directionalLight position={[3, 4, 5]} intensity={3} color="#ffffff" />
        <pointLight position={[-4, 0, 2]} intensity={12} color="#58b4ee" />
        <HeroObject />
      </Canvas>
    </SceneBoundary>
  );
}
