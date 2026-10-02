"use client";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
export default function HeroObject() {
  const ref = useRef<THREE.Group>(null);
  useFrame((state, dt) => {
    if (!ref.current) return;
    const p = Math.min(scrollY / innerHeight, 1);
    ref.current.rotation.y = THREE.MathUtils.lerp(
      ref.current.rotation.y,
      state.pointer.x * 0.4,
      Math.min(dt * 3, 1),
    );
    ref.current.rotation.x = THREE.MathUtils.lerp(
      ref.current.rotation.x,
      -0.35 - state.pointer.y * 0.3,
      Math.min(dt * 3, 1),
    );
    ref.current.scale.setScalar(1.35 - p * 0.5);
  });
  return (
    <group ref={ref} position={[0, 0.05, -1]} rotation={[-0.35, 0, 0]}>
      <group position={[0.45, -0.3, 0]} rotation={[Math.PI / 2, 0, -0.2]}>
        <mesh scale={[1, 1, 0.8]}>
          <cylinderGeometry args={[0.95, 0.95, 0.12, 64]} />
          <meshStandardMaterial color="#eceef1" roughness={0.6} />
        </mesh>
        {["#ee5874", "#f5cc52", "#47c9a1", "#58b4ee"].map((color, i) => (
          <mesh
            key={color}
            position={[Math.cos(i * 0.9) * 0.65, 0.09, Math.sin(i * 0.9) * 0.5]}
            scale={[1, 0.3, 1]}
          >
            <sphereGeometry args={[0.16, 20, 12]} />
            <meshStandardMaterial color={color} roughness={0.3} />
          </mesh>
        ))}
      </group>
      <group position={[-0.7, 0, 0.4]} rotation={[0, 0, -0.5]}>
        <mesh>
          <cylinderGeometry args={[0.1, 0.1, 2.2, 6]} />
          <meshStandardMaterial color="#f5cc52" />
        </mesh>
        <mesh position={[0, -1.25, 0]} rotation={[Math.PI, 0, 0]}>
          <coneGeometry args={[0.1, 0.3, 6]} />
          <meshStandardMaterial color="#e7c59c" />
        </mesh>
        <mesh position={[0, -1.4, 0]} rotation={[Math.PI, 0, 0]}>
          <coneGeometry args={[0.03, 0.1, 6]} />
          <meshStandardMaterial color="#26292d" />
        </mesh>
        <mesh position={[0, 1.2, 0]}>
          <cylinderGeometry args={[0.105, 0.105, 0.2, 16]} />
          <meshStandardMaterial color="#ee5874" />
        </mesh>
      </group>
      <group position={[0.5, 1.05, 0.3]}>
        {[-1, 1].map((side) => (
          <group key={side} position={[side * 0.45, 0, 0]}>
            {[-1, 1].map((direction) => (
              <mesh
                key={direction}
                position={[0, direction * 0.17, 0]}
                rotation={[0, 0, side * direction * 0.75]}
              >
                <boxGeometry args={[0.08, 0.5, 0.1]} />
                <meshStandardMaterial color="#47c9a1" />
              </mesh>
            ))}
          </group>
        ))}
        <mesh rotation={[0, 0, -0.3]}>
          <boxGeometry args={[0.07, 0.6, 0.1]} />
          <meshStandardMaterial color="#f5f5f7" />
        </mesh>
      </group>
    </group>
  );
}
