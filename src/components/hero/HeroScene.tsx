import { Canvas, useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import { useRef, useEffect, useState } from "react";
import * as THREE from "three";

function WireframeShape({
  position,
  scale,
  speed = [0.003, 0.005, 0.001],
  color,
  children,
}: {
  position: [number, number, number];
  scale: number;
  speed?: [number, number, number];
  color: string;
  children: React.ReactNode;
}) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (!ref.current) return;
    ref.current.rotation.x += speed[0];
    ref.current.rotation.y += speed[1];
    ref.current.rotation.z += speed[2];
  });

  return (
    <mesh ref={ref} position={position} scale={scale}>
      {children}
      <meshBasicMaterial
        wireframe
        color={color}
        transparent
        opacity={0.12}
      />
    </mesh>
  );
}

function Scene({ color }: { color: string }) {
  const groupRef = useRef<THREE.Group>(null);
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.current.y = -(e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  useFrame(() => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y +=
      (mouse.current.x * 0.15 - groupRef.current.rotation.y) * 0.03;
    groupRef.current.rotation.x +=
      (mouse.current.y * 0.08 - groupRef.current.rotation.x) * 0.03;
  });

  return (
    <group ref={groupRef}>
      {/* Large torus — right side */}
      <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.4}>
        <WireframeShape
          position={[3.5, 0.5, -2]}
          scale={2}
          color={color}
        >
          <torusGeometry args={[1, 0.4, 16, 32]} />
        </WireframeShape>
      </Float>

      {/* Icosahedron — left side */}
      <Float speed={2} rotationIntensity={0.3} floatIntensity={0.5}>
        <WireframeShape
          position={[-3, -1, -1.5]}
          scale={1.5}
          speed={[0.004, 0.002, 0.003]}
          color={color}
        >
          <icosahedronGeometry args={[1, 0]} />
        </WireframeShape>
      </Float>

      {/* Octahedron — center back */}
      <Float speed={1.8} rotationIntensity={0.15} floatIntensity={0.3}>
        <WireframeShape
          position={[0.5, 1.5, -4]}
          scale={1}
          speed={[0.002, 0.004, 0.002]}
          color={color}
        >
          <octahedronGeometry args={[1, 0]} />
        </WireframeShape>
      </Float>
    </group>
  );
}

export function HeroScene() {
  const [color, setColor] = useState("#ffffff");

  useEffect(() => {
    const update = () => {
      const isDark = document.documentElement.classList.contains("dark");
      setColor(isDark ? "#ffffff" : "#111111");
    };
    update();

    const observer = new MutationObserver(update);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

  return (
    <div data-hero-scene className="pointer-events-none absolute inset-0">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 45 }}
        dpr={[1, 1.5]}
        gl={{ alpha: true, antialias: true }}
      >
        <Scene color={color} />
      </Canvas>
    </div>
  );
}
