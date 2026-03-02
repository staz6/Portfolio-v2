import { useRef, useEffect, useMemo, memo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const PARTICLE_COUNT = 30;

const particleVertexShader = `
  attribute float aOpacity;
  attribute float aSize;
  varying float vOpacity;
  void main() {
    vOpacity = aOpacity;
    vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = aSize * (200.0 / -mvPos.z);
    gl_Position = projectionMatrix * mvPos;
  }
`;

const particleFragmentShader = `
  varying float vOpacity;
  uniform vec3 uColor;
  void main() {
    float d = length(gl_PointCoord - vec2(0.5));
    if (d > 0.5) discard;
    float alpha = smoothstep(0.5, 0.0, d) * vOpacity;
    gl_FragColor = vec4(uColor, alpha);
  }
`;

export const ParticleEmitter = memo(function ParticleEmitter({
  origin,
  radius,
  color,
}: {
  origin: [number, number, number];
  radius: number;
  color: string;
}) {
  const pointsRef = useRef<THREE.Points>(null);
  const originRef = useRef(origin);

  const particles = useMemo(() => {
    const o = originRef.current;
    const pos = new Float32Array(PARTICLE_COUNT * 3);
    const opacity = new Float32Array(PARTICLE_COUNT);
    const size = new Float32Array(PARTICLE_COUNT);
    const vel: THREE.Vector3[] = [];
    const life: number[] = [];
    const maxLife: number[] = [];

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      pos[i * 3] = o[0];
      pos[i * 3 + 1] = o[1];
      pos[i * 3 + 2] = o[2];
      opacity[i] = 0;
      size[i] = Math.random() * 1.5 + 0.5;
      vel.push(new THREE.Vector3());
      life.push(0);
      maxLife.push(0);
    }

    return { pos, opacity, size, vel, life, maxLife };
  }, []); // stable — origin is a module-level constant

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: { uColor: { value: new THREE.Color(color) } },
        vertexShader: particleVertexShader,
        fragmentShader: particleFragmentShader,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    [], // create once — color updates via uniform below
  );

  useEffect(() => {
    material.uniforms.uColor.value.set(color);
  }, [color, material]);

  useFrame((_, delta) => {
    if (!pointsRef.current) return;

    const geom = pointsRef.current.geometry;
    const posAttr = geom.getAttribute("position") as THREE.BufferAttribute;
    const opaAttr = geom.getAttribute("aOpacity") as THREE.BufferAttribute;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.life[i] -= delta;

      if (particles.life[i] <= 0) {
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        const r = radius * (0.8 + Math.random() * 0.4);

        const x = origin[0] + r * Math.sin(phi) * Math.cos(theta);
        const y = origin[1] + r * Math.sin(phi) * Math.sin(theta);
        const z = origin[2] + r * Math.cos(phi);

        particles.pos[i * 3] = x;
        particles.pos[i * 3 + 1] = y;
        particles.pos[i * 3 + 2] = z;

        particles.vel[i]
          .set(x - origin[0], y - origin[1], z - origin[2])
          .normalize()
          .multiplyScalar(0.4 + Math.random() * 0.6);

        particles.maxLife[i] = 1 + Math.random() * 2;
        particles.life[i] = particles.maxLife[i];
      }

      particles.pos[i * 3] += particles.vel[i].x * delta;
      particles.pos[i * 3 + 1] += particles.vel[i].y * delta;
      particles.pos[i * 3 + 2] += particles.vel[i].z * delta;

      particles.vel[i].multiplyScalar(0.995);

      const t = Math.max(0, particles.life[i] / particles.maxLife[i]);
      particles.opacity[i] = t * 0.25;
    }

    posAttr.array.set(particles.pos);
    opaAttr.array.set(particles.opacity);
    posAttr.needsUpdate = true;
    opaAttr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[particles.pos, 3]}
          count={PARTICLE_COUNT}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-aOpacity"
          args={[particles.opacity, 1]}
          count={PARTICLE_COUNT}
          itemSize={1}
        />
        <bufferAttribute
          attach="attributes-aSize"
          args={[particles.size, 1]}
          count={PARTICLE_COUNT}
          itemSize={1}
        />
      </bufferGeometry>
      <primitive object={material} attach="material" />
    </points>
  );
});
