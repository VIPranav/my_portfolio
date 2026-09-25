"use client";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF, Center } from "@react-three/drei";
import { Component, Suspense, type ReactNode } from "react";
import { useReducedMotion } from "framer-motion";
function Model({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  return (
    <Center>
      <primitive object={scene} />
    </Center>
  );
}
class Boundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? (
      <p>This model could not be loaded.</p>
    ) : (
      this.props.children
    );
  }
}
export default function ModelCanvas({ url }: { url: string }) {
  const reduced = useReducedMotion();
  return (
    <Boundary>
      <div
        className="model-canvas"
        role="img"
        aria-label="Interactive 3D project model. Drag to rotate."
      >
        <Canvas
          dpr={[1, 1.5]}
          camera={{ position: [0, 0, 5] }}
          fallback={<p>WebGL is unavailable.</p>}
        >
          <ambientLight intensity={2} />
          <directionalLight position={[3, 4, 5]} intensity={4} />
          <Suspense fallback={null}>
            <Model url={url} />
          </Suspense>
          <OrbitControls enableZoom={false} autoRotate={!reduced} />
        </Canvas>
      </div>
    </Boundary>
  );
}
