import { useState, useEffect, Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";
import type { ExperienceProps } from "@/sanity/lib/mappers";

function BgOrb() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => { if (ref.current) ref.current.rotation.y = clock.elapsedTime * 0.15; });
  return <mesh ref={ref}><icosahedronGeometry args={[1.2, 16]} /><MeshDistortMaterial color="#60A5FA" emissive="#A78BFA" emissiveIntensity={0.3} roughness={0.3} metalness={0.7} distort={0.1} speed={1} transparent opacity={0.45} /></mesh>;
}

function BgStars() {
  const pos = new Float32Array(80 * 3);
  for (let i = 0; i < 80; i++) { pos[i*3]=(Math.random()-0.5)*16; pos[i*3+1]=(Math.random()-0.5)*10; pos[i*3+2]=(Math.random()-0.5)*6-3; }
  return <points><bufferGeometry><bufferAttribute attach="attributes-position" args={[pos, 3]} /></bufferGeometry><pointsMaterial size={0.02} color="#A78BFA" transparent opacity={0.3} sizeAttenuation /></points>;
}

export function Carousel3D({ experiences }: { experiences: ExperienceProps[] }) {
  const [active, setActive] = useState(0);
  const total = experiences.length;
  const angle = 360 / total;
  const next = () => setActive((a) => (a + 1) % total);
  const prev = () => setActive((a) => (a - 1 + total) % total);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "ArrowRight") next(); if (e.key === "ArrowLeft") prev(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="relative pb-24">
      <div className="absolute inset-0 z-0 h-[520px] lg:h-[580px]">
        <Canvas camera={{ position: [0, 0, 5], fov: 45 }} dpr={[1, 1.25]}>
          <Suspense fallback={null}>
            <ambientLight intensity={0.3} />
            <pointLight position={[0, 2, 4]} intensity={0.4} color="#A78BFA" />
            <BgStars /><BgOrb />
          </Suspense>
        </Canvas>
      </div>

      <div className="relative z-10 flex h-[520px] items-center justify-center lg:h-[580px]" style={{ perspective: "1000px" }}>
        <div className="relative h-72 w-64 lg:h-80 lg:w-72" style={{ transformStyle: "preserve-3d", transform: `rotateY(${-active * angle}deg)`, transition: "transform 0.7s cubic-bezier(0.76, 0, 0.24, 1)" }}>
          {experiences.map((exp, i) => (
            <div key={exp.companyName} onClick={() => setActive(i)} className="absolute inset-0 cursor-pointer" style={{ transform: `rotateY(${i * angle}deg) translateZ(${total <= 3 ? 240 : 280}px)`, backfaceVisibility: "hidden" }}>
              <div className={`h-full overflow-y-auto rounded-2xl border p-5 backdrop-blur-xl transition-all duration-500 ${active === i ? "border-primary/40 bg-card/85 shadow-[0_0_40px_rgba(167,139,250,0.1)]" : "border-border/10 bg-card/30"}`}>
                <div className="flex items-center justify-between">
                  <span className="font-heading text-2xl font-black text-primary/20">{String(i + 1).padStart(2, "0")}</span>
                  <span className="text-xs font-semibold tracking-widest text-primary">{exp.year}</span>
                </div>
                <h3 className="mt-2 font-heading text-lg font-bold text-foreground">{exp.companyName}</h3>
                <p className="text-xs uppercase tracking-widest text-muted-foreground">{exp.position}</p>
                <p className="mt-1 text-[10px] text-muted-foreground/50">{exp.startDate} — {exp.endDate ?? "Present"}</p>
                <div className="mt-3 space-y-1.5">
                  {exp.highlights.slice(0, 3).map((h, j) => <p key={j} className="text-xs leading-relaxed text-foreground/60">{h.length > 80 ? h.slice(0, 80) + "..." : h}</p>)}
                </div>
                {exp.isCurrent && <div className="mt-2 flex items-center gap-1"><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" /><span className="text-[10px] text-primary">Current</span></div>}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="relative z-10 flex items-center justify-center gap-4">
        <button onClick={prev} className="flex h-10 w-10 items-center justify-center rounded-full border border-border/20 text-muted-foreground hover:border-primary/40 hover:text-foreground"><svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg></button>
        <div className="flex items-center gap-2">{experiences.map((_, i) => <button key={i} onClick={() => setActive(i)} className={`h-2 rounded-full transition-all duration-500 ${active === i ? "w-8 bg-primary" : "w-2 bg-muted-foreground/20"}`} />)}</div>
        <button onClick={next} className="flex h-10 w-10 items-center justify-center rounded-full border border-border/20 text-muted-foreground hover:border-primary/40 hover:text-foreground"><svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg></button>
      </div>
    </div>
  );
}
