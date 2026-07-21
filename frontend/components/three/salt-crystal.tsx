'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Float, MeshDistortMaterial } from '@react-three/drei';
import { useRef } from 'react';
import * as THREE from 'three';

function Crystal() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y += delta * 0.25;
    meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.15;
  });

  return (
    <Float speed={1.5} rotationIntensity={0.4} floatIntensity={0.8}>
      <mesh ref={meshRef} castShadow receiveShadow>
        <icosahedronGeometry args={[1.4, 1]} />
        <MeshDistortMaterial
          color="#f6a6a0"
          emissive="#c0433a"
          emissiveIntensity={0.18}
          roughness={0.15}
          metalness={0.35}
          distort={0.32}
          speed={1.8}
          clearcoat={1}
          clearcoatRoughness={0.2}
        />
      </mesh>
    </Float>
  );
}

function InnerCrystals() {
  const group = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (group.current) group.current.rotation.y -= delta * 0.15;
  });
  return (
    <group ref={group}>
      {[
        [2.4, 0.6, -1],
        [-2.6, -0.4, 0.5],
        [1.8, -1.6, 1.2],
        [-2, 1.4, -0.8],
      ].map((p, i) => (
        <mesh key={i} position={p as [number, number, number]}>
          <octahedronGeometry args={[0.35, 0]} />
          <meshStandardMaterial
            color="#f8b8b3"
            emissive="#a8362f"
            emissiveIntensity={0.3}
            roughness={0.2}
            metalness={0.4}
          />
        </mesh>
      ))}
    </group>
  );
}

export function SaltCrystal() {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 45 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
    >
      <ambientLight intensity={0.4} />
      <spotLight
        position={[5, 5, 5]}
        angle={0.3}
        penumbra={1}
        intensity={2}
        castShadow
      />
      <pointLight position={[-5, -3, -5]} color="#ff7e5f" intensity={1.5} />
      <Crystal />
      <InnerCrystals />
      <Environment preset="sunset" />
    </Canvas>
  );
}
