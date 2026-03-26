import { useState, useRef, useMemo, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Html, Billboard, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";
import type { ExperienceProps } from "@/sanity/lib/mappers";

function CentralOrb() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.y = clock.elapsedTime * 0.25;
      ref.current.rotation.x = Math.sin(clock.elapsedTime * 0.15) * 0.1;
    }
  });
  return (
    <group>
      <mesh ref={ref}>
        <icosahedronGeometry args={[0.7, 14]} />
        <MeshDistortMaterial color="#60A5FA" emissive="#A78BFA" emissiveIntensity={0.35} roughness={0.25} metalness={0.75} distort={0.12} speed={1.5} transparent opacity={0.85} />
      </mesh>
      <mesh><sphereGeometry args={[1, 32, 32]} /><meshBasicMaterial color="#60A5FA" transparent opacity={0.03} /></mesh>
    </group>
  );
}

function OrbitRing({ radius, opacity }: { radius: number; opacity: number }) {
  const geo = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    for (let j = 0; j <= 100; j++) { const a = (j / 100) * Math.PI * 2; pts.push(new THREE.Vector3(Math.cos(a) * radius, 0, Math.sin(a) * radius)); }
    return new THREE.BufferGeometry().setFromPoints(pts);
  }, [radius]);
  const mat = useMemo(() => new THREE.LineBasicMaterial({ color: "#A78BFA", transparent: true, opacity, linewidth: 1 }), [opacity]);
  return <primitive object={new THREE.Line(geo, mat)} />;
}

function OrbitCard({ exp, index, total, radius, speed, isActive, onSelect }: {
  exp: ExperienceProps; index: number; total: number; radius: number; speed: number; isActive: boolean; onSelect: () => void;
}) {
  const ref = useRef<THREE.Group>(null);
  const startA = (index / total) * Math.PI * 2;

  useFrame(({ clock, camera }) => {
    if (!ref.current) return;
    if (isActive) {
      ref.current.position.x += (0 - ref.current.position.x) * 0.05;
      ref.current.position.z += (2.5 - ref.current.position.z) * 0.05;
      ref.current.position.y += (0.3 - ref.current.position.y) * 0.05;
    } else {
      const a = startA + clock.elapsedTime * speed;
      ref.current.position.x += (Math.cos(a) * radius - ref.current.position.x) * 0.05;
      ref.current.position.z += (Math.sin(a) * radius - ref.current.position.z) * 0.05;
      ref.current.position.y += (0 - ref.current.position.y) * 0.05;
    }
    const baseScale = isActive ? 1 : 0.75;
    // Compensate for perspective scaling so orbiting cards stay readable at all depths
    const dist = ref.current.position.distanceTo(camera.position);
    const refDist = 6.5;
    const compensation = isActive ? 1 : Math.pow(dist / refDist, 0.6);
    const s = baseScale * compensation;
    ref.current.scale.setScalar(ref.current.scale.x + (s - ref.current.scale.x) * 0.06);
  });

  return (
    <group ref={ref}>
      <mesh><sphereGeometry args={[0.22, 16, 16]} /><meshBasicMaterial color={isActive ? "#A78BFA" : "#60A5FA"} transparent opacity={isActive ? 1 : 0.6} /></mesh>
      <Billboard>
        <Html transform distanceFactor={3.5} style={{ pointerEvents: "auto" }}>
          <div onClick={onSelect} className={`w-60 cursor-pointer select-none rounded-xl border p-4 backdrop-blur-lg transition-all duration-500 ${isActive ? "border-primary/50 bg-card/90 shadow-[0_0_35px_rgba(167,139,250,0.12)]" : "border-border/10 bg-card/25 hover:border-primary/20"}`}>
            <div className="flex items-center justify-between">
              <span className="font-heading text-lg font-black text-primary/25">{String(index + 1).padStart(2, "0")}</span>
              <span className="text-[10px] font-semibold tracking-widest text-primary">{exp.year}</span>
            </div>
            <h3 className="mt-1 font-heading text-sm font-bold text-foreground">{exp.companyName}</h3>
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground">{exp.position}</p>
            {isActive && (
              <div className="mt-2 space-y-1 border-t border-border/10 pt-2">
                <p className="text-[9px] text-muted-foreground/50">{exp.startDate} — {exp.endDate ?? "Present"}</p>
                {exp.highlights.slice(0, 3).map((h, j) => (
                  <p key={j} className="text-[11px] leading-relaxed text-foreground/55">{h.length > 85 ? h.slice(0, 85) + "..." : h}</p>
                ))}
                {exp.highlights.length > 3 && <p className="text-[9px] text-primary/60">+{exp.highlights.length - 3} more</p>}
              </div>
            )}
            {exp.isCurrent && <div className="mt-1.5 flex items-center gap-1"><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" /><span className="text-[9px] text-primary">Current</span></div>}
          </div>
        </Html>
      </Billboard>
    </group>
  );
}

function Dust() {
  const pos = useMemo(() => { const p = new Float32Array(100 * 3); for (let i = 0; i < 100; i++) { p[i*3]=(Math.random()-0.5)*14; p[i*3+1]=(Math.random()-0.5)*8; p[i*3+2]=(Math.random()-0.5)*6; } return p; }, []);
  const ref = useRef<THREE.Points>(null);
  useFrame((_, d) => { if (ref.current) ref.current.rotation.y += d * 0.008; });
  return <points ref={ref}><bufferGeometry><bufferAttribute attach="attributes-position" args={[pos, 3]} /></bufferGeometry><pointsMaterial size={0.02} color="#A78BFA" transparent opacity={0.3} sizeAttenuation /></points>;
}

export function OrbitalSystem({ experiences }: { experiences: ExperienceProps[] }) {
  const [active, setActive] = useState(0);
  return (
    <div className="relative pb-24">
      <div className="relative h-[600px] lg:h-[700px]" style={{ overflow: "visible" }}>
        <Canvas camera={{ position: [0, 1.8, 6.5], fov: 48 }} dpr={[1, 1.25]} style={{ overflow: "visible" }}>
          <Suspense fallback={null}>
            <ambientLight intensity={0.35} />
            <pointLight position={[0, 3, 5]} intensity={0.45} color="#A78BFA" />
            <pointLight position={[-3, -2, 3]} intensity={0.25} color="#60A5FA" />
            <Dust />
            <CentralOrb />
            {experiences.map((_, i) => <OrbitRing key={i} radius={1.8 + i * 0.8} opacity={0.2 + i * 0.05} />)}
            {experiences.map((exp, i) => (
              <OrbitCard key={exp.companyName} exp={exp} index={i} total={experiences.length}
                radius={1.8 + i * 0.8} speed={0.12 - i * 0.018} isActive={active === i} onSelect={() => setActive(i)} />
            ))}
          </Suspense>
        </Canvas>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-2 px-4">
        {experiences.map((exp, i) => (
          <button key={i} onClick={() => setActive(i)} className={`rounded-full px-3 py-1.5 text-xs font-medium transition-all duration-300 ${active === i ? "border border-primary/30 bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground"}`}>{exp.companyName}</button>
        ))}
      </div>
    </div>
  );
}
