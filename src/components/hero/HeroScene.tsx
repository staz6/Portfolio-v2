import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import { useRef, useEffect, useState } from "react";
import * as THREE from "three";
import type { Theme } from "@/hooks/useTheme";
import { ParticleEmitter } from "./ParticleEmitter";
import { WireframeShape } from "./WireframeShape";
import { SkillNetwork } from "./SkillNetwork";

/* ── Scene layout constants ── */

const NETWORK_CENTER: [number, number, number] = [3.5, 0.5, -2];
const ICOSA_POS: [number, number, number] = [-3, -1, -1.5];
const ICOSA_SPEED: [number, number, number] = [0.004, 0.002, 0.003];
const OCTA_POS: [number, number, number] = [0.5, 1.5, -4];
const OCTA_SPEED: [number, number, number] = [0.002, 0.004, 0.002];

/* ── Main scene ── */

function Scene({ color }: { color: string }) {
  const groupRef = useRef<THREE.Group>(null);
  const mouse = useRef({ x: 0, y: 0 });
  const { invalidate } = useThree();

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.current.y = -(e.clientY / window.innerHeight - 0.5) * 2;
      invalidate();
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [invalidate]);

  useFrame(() => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y +=
      (mouse.current.x * 0.15 - groupRef.current.rotation.y) * 0.03;
    groupRef.current.rotation.x +=
      (mouse.current.y * 0.08 - groupRef.current.rotation.x) * 0.03;
    invalidate();
  });

  return (
    <group ref={groupRef}>
      <SkillNetwork center={NETWORK_CENTER} color={color} />

      <Float speed={2} rotationIntensity={0.3} floatIntensity={0.5}>
        <WireframeShape position={ICOSA_POS} scale={1.5} speed={ICOSA_SPEED} color={color}>
          <icosahedronGeometry args={[1, 0]} />
        </WireframeShape>
      </Float>
      <ParticleEmitter origin={ICOSA_POS} radius={1.8} color={color} />

      <Float speed={1.8} rotationIntensity={0.15} floatIntensity={0.3}>
        <WireframeShape position={OCTA_POS} scale={1} speed={OCTA_SPEED} color={color}>
          <octahedronGeometry args={[1, 0]} />
        </WireframeShape>
      </Float>
      <ParticleEmitter origin={OCTA_POS} radius={1.2} color={color} />
    </group>
  );
}

/* ── Exported wrapper ── */

const SCENE_COLORS: Record<Theme, string> = {
  orange: "#ff6b2b",
  "orange-light": "#c45a20",
  "mono-dark": "#b0b0b0",
  "mono-light": "#333333",
};

export function HeroScene() {
  const [color, setColor] = useState(SCENE_COLORS.orange);

  useEffect(() => {
    const updateFromTheme = () => {
      const theme = (document.documentElement.getAttribute("data-theme") ?? "orange") as Theme;
      setColor(SCENE_COLORS[theme] ?? SCENE_COLORS.orange);
    };
    updateFromTheme();

    const observer = new MutationObserver(updateFromTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div data-hero-scene className="pointer-events-none absolute inset-0">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 45 }}
        dpr={[1, 1.5]}
        frameloop="demand"
        gl={{ alpha: true, antialias: true }}
      >
        <Scene color={color} />
      </Canvas>
    </div>
  );
}
