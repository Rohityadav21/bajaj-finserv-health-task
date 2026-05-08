"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Environment, PointMaterial, Points } from "@react-three/drei";
import { Suspense, useMemo, useRef } from "react";
import * as THREE from "three";
import { useTheme } from "@/components/layout/ThemeProvider";

function ParticleField({ theme }: { theme: "dark" | "light" }) {
  const count = 800;
  const mesh = useRef<THREE.Points>(null);
  const particleColor = theme === "dark" ? "#2563EB" : "#94A3B8";

  const particlesPosition = useMemo(() => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 28;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 28;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 28;
    }
    return positions;
  }, [count]);

  useFrame((state) => {
    if (mesh.current) {
      mesh.current.rotation.y = state.clock.elapsedTime * 0.018;
      mesh.current.rotation.x = state.clock.elapsedTime * 0.009;
    }
  });

  return (
    <Points ref={mesh} positions={particlesPosition} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color={particleColor}
        size={0.035}
        sizeAttenuation={true}
        depthWrite={false}
        blending={THREE.NormalBlending}
        opacity={theme === "dark" ? 0.35 : 0.28}
      />
    </Points>
  );
}

function FloatingObjects({ theme }: { theme: "dark" | "light" }) {
  const material = new THREE.MeshPhysicalMaterial({
    color: theme === "dark" ? "#0A0A0A" : "#F8FAFC",
    metalness: 0.1,
    roughness: theme === "dark" ? 0.05 : 0.2,
    transmission: theme === "dark" ? 0.92 : 0.72,
    thickness: theme === "dark" ? 2.5 : 1.4,
    envMapIntensity: theme === "dark" ? 2 : 1.1,
    clearcoat: 1,
    clearcoatRoughness: 0.05,
    emissive: theme === "dark" ? "#2563EB" : "#60A5FA",
    emissiveIntensity: theme === "dark" ? 0.03 : 0.015,
    transparent: true,
    opacity: theme === "dark" ? 0.85 : 0.74,
  });

  return (
    <>
      <Float speed={1.5} rotationIntensity={0.4} floatIntensity={0.8}>
        <mesh position={[3, 1, -2]} material={material}>
          <icosahedronGeometry args={[1.5, 1]} />
        </mesh>
      </Float>

      <Float speed={1} rotationIntensity={0.7} floatIntensity={0.5}>
        <mesh position={[-4, -1, -4]} material={material}>
          <torusGeometry args={[1.2, 0.25, 16, 48]} />
        </mesh>
      </Float>

      <Float speed={2} rotationIntensity={0.25} floatIntensity={1.2}>
        <mesh position={[0, -2, -6]} material={material}>
          <octahedronGeometry args={[2, 1]} />
        </mesh>
      </Float>
    </>
  );
}

export default function Scene() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div className="fixed inset-0 z-0 pointer-events-none bg-transparent">
      <Canvas className="pointer-events-none" camera={{ position: [0, 0, 10], fov: 45 }} dpr={[1, 1.5]}>
        <fog attach="fog" args={[isDark ? "#050505" : "#F5F7FA", 8, 25]} />
        <Suspense fallback={null}>
          <ambientLight intensity={isDark ? 1 : 1.6} color={isDark ? "#050505" : "#F8FAFC"} />
          <directionalLight position={[10, 10, 5]} intensity={isDark ? 1 : 0.75} color={isDark ? "#171717" : "#DCE3EA"} />
          <spotLight position={[-10, -10, -5]} intensity={isDark ? 1 : 0.55} color={isDark ? "#171717" : "#E2E8F0"} />
          <pointLight position={[0, 5, 2]} intensity={isDark ? 1 : 0.7} color="#2563EB" />

          <ParticleField theme={theme} />
          <FloatingObjects theme={theme} />

          <Environment preset={isDark ? "night" : "apartment"} />
        </Suspense>
      </Canvas>
    </div>
  );
}
