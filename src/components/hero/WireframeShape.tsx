import { useRef, memo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export const WireframeShape = memo(function WireframeShape({
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
      <meshBasicMaterial wireframe color={color} transparent opacity={0.12} />
    </mesh>
  );
});
