"use client";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { MeshTransmissionMaterial } from "@react-three/drei";
import * as THREE from "three";
export default function HeroObject() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state, dt) => {
    if (!ref.current) return;
    const p = Math.min(scrollY / innerHeight, 1);
    ref.current.rotation.y = THREE.MathUtils.lerp(
      ref.current.rotation.y,
      state.pointer.x * 0.4 + state.clock.elapsedTime * 0.08,
      Math.min(dt * 3, 1),
    );
    ref.current.rotation.x = THREE.MathUtils.lerp(
      ref.current.rotation.x,
      -0.35 - state.pointer.y * 0.3,
      Math.min(dt * 3, 1),
    );
    ref.current.scale.setScalar(1.35 - p * 0.5);
    const material = ref.current.material as THREE.Material;
    material.opacity = 1 - p;
  });
  return (
    <mesh ref={ref} position={[0, 0.05, -1]} rotation={[-0.35, 0, 0]}>
      <torusKnotGeometry args={[1.25, 0.29, 160, 20, 2, 3]} />
      <MeshTransmissionMaterial
        color="#91aaff"
        thickness={0.65}
        roughness={0.2}
        transmission={0.85}
        metalness={0.3}
        chromaticAberration={0.06}
        samples={4}
        resolution={256}
        transparent
      />
    </mesh>
  );
}
