import { useRef, useEffect, useState, useMemo, memo } from "react";
import { useFrame } from "@react-three/fiber";
import { Float, Html } from "@react-three/drei";
import * as THREE from "three";

/* ── Data ── */

const SKILLS_PER_SET = 8;

const ALL_SKILLS = [
  { name: "React", slug: "react" },
  { name: "Next.js", slug: "nextdotjs" },
  { name: "Node.js", slug: "nodedotjs" },
  { name: "TypeScript", slug: "typescript" },
  { name: "Python", slug: "python" },
  { name: "Three.js", slug: "threedotjs" },
  { name: "GraphQL", slug: "graphql" },
  { name: "Figma", slug: "figma" },
  { name: "MongoDB", slug: "mongodb" },
  { name: "PostgreSQL", slug: "postgresql" },
  { name: "Docker", slug: "docker" },
  { name: "Tailwind CSS", slug: "tailwindcss" },
  { name: "Redis", slug: "redis" },
  { name: "Git", slug: "git" },
  { name: "Express", slug: "express" },
  { name: "Prisma", slug: "prisma" },
  { name: "Firebase", slug: "firebase" },
  { name: "Astro", slug: "astro" },
  { name: "Sass", slug: "sass" },
  { name: "Redux", slug: "redux" },
  { name: "Jest", slug: "jest" },
  { name: "Vercel", slug: "vercel" },
  { name: "Supabase", slug: "supabase" },
  { name: "Linux", slug: "linux" },
];

const SET_COUNT = ALL_SKILLS.length / SKILLS_PER_SET;

const NODE_POSITIONS: [number, number, number][] = [
  [0, 1.3, 0],
  [1.2, 0.5, 0.2],
  [-1.0, 0.7, 0.4],
  [0.9, -0.5, -0.2],
  [-1.1, -0.2, 0.1],
  [0.1, -1.2, 0.1],
  [0.6, 0.1, 0.9],
  [-0.4, 0.1, -0.7],
];

const EDGES: [number, number][] = [
  [0, 1], [0, 3], [0, 6],
  [1, 2], [1, 3], [1, 6],
  [2, 3], [2, 4], [2, 5], [2, 7],
  [4, 7], [5, 7],
];

/* ── Skill node ── */

const SkillNode = memo(function SkillNode({
  position,
  skill,
  color,
  index,
  transitionDelay = 0,
}: {
  position: [number, number, number];
  skill: { name: string; slug: string };
  color: string;
  index: number;
  transitionDelay?: number;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const basePos = useMemo(() => new THREE.Vector3(...position), [position]);
  const phase = index * 0.8;
  const speed = 0.5 + index * 0.1;
  const iconColor = color.replace("#", "");

  const [currentSkill, setCurrentSkill] = useState(skill);
  const [visible, setVisible] = useState(true);
  const prevSlug = useRef(skill.slug);

  useEffect(() => {
    if (skill.slug === prevSlug.current) return;
    prevSlug.current = skill.slug;

    const fadeOut = setTimeout(() => setVisible(false), transitionDelay);
    const swap = setTimeout(() => {
      setCurrentSkill(skill);
      setVisible(true);
    }, transitionDelay + 400);

    return () => {
      clearTimeout(fadeOut);
      clearTimeout(swap);
    };
  }, [skill, transitionDelay]);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    groupRef.current.position.set(
      basePos.x + Math.sin(t * speed + phase) * 0.08,
      basePos.y + Math.sin(t * speed * 1.3 + phase) * 0.12,
      basePos.z + Math.cos(t * speed * 0.7 + phase) * 0.06,
    );
    groupRef.current.scale.setScalar(1 + Math.sin(t * 2 + phase) * 0.08);
  });

  return (
    <group ref={groupRef} position={position}>
      <mesh>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshBasicMaterial color={color} transparent opacity={0.25} />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.22, 16, 16]} />
        <meshBasicMaterial color={color} transparent opacity={0.06} />
      </mesh>
      <Html
        transform
        sprite
        distanceFactor={10}
        zIndexRange={[0, 0]}
        style={{ pointerEvents: "none" }}
      >
        <div
          style={{
            width: 30,
            height: 30,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "50%",
            background: `${color}0A`,
            border: `1px solid ${color}15`,
            transition: "opacity 0.4s ease",
            opacity: visible ? 1 : 0,
          }}
        >
          <img
            src={`https://cdn.simpleicons.org/${currentSkill.slug}/${iconColor}`}
            alt={currentSkill.name}
            width={16}
            height={16}
            style={{ opacity: 0.85 }}
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
        </div>
      </Html>
    </group>
  );
});

/* ── Traveling pulse ── */

const TravelingPulse = memo(function TravelingPulse({
  start,
  end,
  speed,
  delay,
  color,
}: {
  start: THREE.Vector3;
  end: THREE.Vector3;
  speed: number;
  delay: number;
  color: string;
}) {
  const ref = useRef<THREE.Mesh>(null);
  const matRef = useRef<THREE.MeshBasicMaterial>(null);

  useFrame((state) => {
    if (!ref.current || !matRef.current) return;
    const t = (state.clock.elapsedTime * speed + delay) % 1;
    ref.current.position.lerpVectors(start, end, t);
    matRef.current.opacity = Math.sin(t * Math.PI) * 0.5;
  });

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.025, 8, 8]} />
      <meshBasicMaterial
        ref={matRef}
        color={color}
        transparent
        opacity={0.5}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
});

/* ── Skill network ── */

export function SkillNetwork({
  center,
  color,
}: {
  center: [number, number, number];
  color: string;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const [setIndex, setSetIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setSetIndex((prev) => (prev + 1) % SET_COUNT);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const currentSkills = useMemo(
    () => ALL_SKILLS.slice(setIndex * SKILLS_PER_SET, (setIndex + 1) * SKILLS_PER_SET),
    [setIndex],
  );

  useFrame((state) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y = state.clock.elapsedTime * 0.08;
    groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.04) * 0.1;
  });

  const nodeVectors = useMemo(
    () => NODE_POSITIONS.map((p) => new THREE.Vector3(...p)),
    [],
  );

  const connectionLines = useMemo(() => {
    return EDGES.map(([a, b]) => {
      const positions = new Float32Array([...NODE_POSITIONS[a], ...NODE_POSITIONS[b]]);
      return { positions, a, b };
    });
  }, []);

  return (
    <Float speed={1.2} rotationIntensity={0.05} floatIntensity={0.3}>
      <group ref={groupRef} position={center} scale={1.5}>
        {connectionLines.map((conn, i) => (
          <line key={`line-${i}`}>
            <bufferGeometry>
              <bufferAttribute
                attach="attributes-position"
                args={[conn.positions, 3]}
                count={2}
                itemSize={3}
              />
            </bufferGeometry>
            <lineBasicMaterial color={color} transparent opacity={0.35} />
          </line>
        ))}

        {EDGES.map(([a, b], i) => (
          <TravelingPulse
            key={`pulse-${i}`}
            start={nodeVectors[a]}
            end={nodeVectors[b]}
            speed={0.25 + (i % 4) * 0.08}
            delay={i * 0.4}
            color={color}
          />
        ))}

        {currentSkills.map((skill, i) => (
          <SkillNode
            key={`node-${i}`}
            position={NODE_POSITIONS[i]}
            skill={skill}
            color={color}
            index={i}
            transitionDelay={i * 100}
          />
        ))}
      </group>
    </Float>
  );
}
