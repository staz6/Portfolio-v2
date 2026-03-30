import { useState, useRef, useMemo, useEffect, useCallback, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Html, Billboard, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";
import gsap from "gsap";
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
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const startA = (index / total) * Math.PI * 2;

  const checkOverflow = useCallback(() => {
    const el = scrollRef.current;
    if (el) setIsOverflowing(el.scrollHeight > el.clientHeight);
  }, []);

  useEffect(() => {
    if (isActive) {
      checkOverflow();
      // Recheck after Html component renders inside the canvas
      const t = setTimeout(checkOverflow, 200);
      return () => clearTimeout(t);
    }
  }, [isActive, checkOverflow]);

  // Prevent scroll from bubbling to the page when inside the card
  useEffect(() => {
    const el = scrollRef.current;
    if (!el || !isActive) return;
    const onWheel = (e: WheelEvent) => {
      const { scrollTop, scrollHeight, clientHeight } = el;
      const atTop = scrollTop === 0 && e.deltaY < 0;
      const atBottom = scrollTop + clientHeight >= scrollHeight - 1 && e.deltaY > 0;
      if (atTop || atBottom) e.preventDefault();
      e.stopPropagation();
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [isActive]);

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
              <div className="relative mt-2 border-t border-border/10 pt-2">
                <div ref={scrollRef} className={`max-h-36 space-y-1 overflow-y-auto pr-1 lg:max-h-44 ${isOverflowing ? "pb-10" : ""}`} style={{ scrollbarWidth: "none", WebkitOverflowScrolling: "touch" }}>
                  <p className="text-[9px] text-muted-foreground/50">{exp.startDate} — {exp.endDate ?? "Present"}</p>
                  {exp.highlights.map((h, j) => (
                    <div key={j} className="flex items-start gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full" style={{ background: "linear-gradient(135deg, #A78BFA, #60A5FA)" }} />
                      <p className="text-[11px] leading-relaxed text-foreground/55">{h}</p>
                    </div>
                  ))}
                </div>
                {/* Fade hint + scroll indicator */}
                {isOverflowing && (
                  <div className="pointer-events-none absolute bottom-0 left-0 right-0 flex h-10 items-end justify-center bg-gradient-to-t from-card/90 to-transparent">
                    <span className="mb-1 flex items-center gap-1 rounded-full border border-primary/30 bg-primary/10 px-2.5 py-0.5 text-[8px] font-medium tracking-wider text-primary shadow-[0_0_10px_rgba(167,139,250,0.3)]">
                      scroll ↓
                    </span>
                  </div>
                )}
              </div>
            )}
            {exp.isCurrent && <div className="mt-1.5 flex items-center gap-1"><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" /><span className="text-[9px] text-primary">Current</span></div>}
          </div>
        </Html>
      </Billboard>
    </group>
  );
}

/* ── Starfield — distant stars + closer particles ── */
function Starfield() {
  const { farPos, farSizes, nearPos } = useMemo(() => {
    // Far stars — tiny, spread wide
    const fp = new Float32Array(300 * 3);
    const fs = new Float32Array(300);
    for (let i = 0; i < 300; i++) {
      fp[i * 3] = (Math.random() - 0.5) * 30;
      fp[i * 3 + 1] = (Math.random() - 0.5) * 20;
      fp[i * 3 + 2] = (Math.random() - 0.5) * 20 - 5;
      fs[i] = Math.random() * 0.04 + 0.01;
    }
    // Near particles — slightly larger, closer
    const np = new Float32Array(80 * 3);
    for (let i = 0; i < 80; i++) {
      np[i * 3] = (Math.random() - 0.5) * 14;
      np[i * 3 + 1] = (Math.random() - 0.5) * 8;
      np[i * 3 + 2] = (Math.random() - 0.5) * 8;
    }
    return { farPos: fp, farSizes: fs, nearPos: np };
  }, []);

  const farRef = useRef<THREE.Points>(null);
  const nearRef = useRef<THREE.Points>(null);

  useFrame((_, d) => {
    if (farRef.current) farRef.current.rotation.y += d * 0.003;
    if (nearRef.current) nearRef.current.rotation.y += d * 0.01;
  });

  return (
    <>
      {/* Distant stars */}
      <points ref={farRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[farPos, 3]} />
          <bufferAttribute attach="attributes-size" args={[farSizes, 1]} />
        </bufferGeometry>
        <pointsMaterial size={0.03} color="#ffffff" transparent opacity={0.5} sizeAttenuation />
      </points>
      {/* Near floating particles */}
      <points ref={nearRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[nearPos, 3]} />
        </bufferGeometry>
        <pointsMaterial size={0.025} color="#A78BFA" transparent opacity={0.35} sizeAttenuation />
      </points>
    </>
  );
}

/* ── Nebula glow — soft colored sphere behind the scene ── */
function Nebula() {
  return (
    <group position={[0, 0, -6]}>
      <mesh>
        <sphereGeometry args={[5, 16, 16]} />
        <meshBasicMaterial color="#A78BFA" transparent opacity={0.015} side={THREE.BackSide} />
      </mesh>
      <mesh position={[3, 1, -2]}>
        <sphereGeometry args={[3, 16, 16]} />
        <meshBasicMaterial color="#60A5FA" transparent opacity={0.012} side={THREE.BackSide} />
      </mesh>
      <mesh position={[-3, -1, -1]}>
        <sphereGeometry args={[3.5, 16, 16]} />
        <meshBasicMaterial color="#818CF8" transparent opacity={0.01} side={THREE.BackSide} />
      </mesh>
    </group>
  );
}

/* ── Mobile card list fallback ── */
function MobileExperience({ experiences }: { experiences: ExperienceProps[] }) {
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;

    const cards = list.querySelectorAll<HTMLElement>("[data-mobile-card]");
    gsap.set(cards, { y: 50, opacity: 0 });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            observer.unobserve(entry.target);
            gsap.to(entry.target, {
              y: 0, opacity: 1, duration: 0.7,
              ease: "power3.out",
            });
          }
        });
      },
      { threshold: 0.15 },
    );

    cards.forEach((card) => observer.observe(card));
    return () => observer.disconnect();
  }, [experiences]);

  return (
    <div ref={listRef} className="space-y-6 px-6 pb-24">
      {experiences.map((exp, i) => (
        <div key={exp.companyName} data-mobile-card className="rounded-3xl border border-primary/20 bg-card/90 p-6 shadow-2xl backdrop-blur-xl">
          <div className="mb-4 flex items-center gap-4">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-blue-600 text-lg font-bold text-white">
              {String(i + 1).padStart(2, "0")}
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-foreground">{exp.companyName}</h3>
              <p className="text-sm font-medium text-primary">{exp.position}</p>
            </div>
            <span className="font-mono text-sm text-primary">{exp.year}</span>
          </div>

          <p className="mb-4 text-xs text-muted-foreground">{exp.startDate} — {exp.endDate ?? "Present"}</p>

          <div className="space-y-3">
            {exp.highlights.map((h, j) => (
              <div key={j} className="flex items-start gap-2.5">
                <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full" style={{ background: "linear-gradient(135deg, #A78BFA, #60A5FA)" }} />
                <p className="text-sm leading-relaxed text-foreground/70">{h}</p>
              </div>
            ))}
          </div>

          {exp.isCurrent && (
            <div className="mt-4 flex items-center gap-2">
              <span className="h-2 w-2 animate-pulse rounded-full bg-primary" />
              <span className="text-xs font-medium text-primary">Currently working here</span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export function OrbitalSystem({ experiences }: { experiences: ExperienceProps[] }) {
  const [active, setActive] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  if (isMobile) return <MobileExperience experiences={experiences} />;

  return (
    <div className="relative pb-24">
      <div className="relative h-[65vh] min-h-[500px] lg:h-[75vh] lg:min-h-[600px]" style={{ overflow: "visible" }}>
        <Canvas camera={{ position: [0, 1.8, 6.5], fov: 48 }} dpr={[1, 1.25]} style={{ overflow: "visible" }}>
          <Suspense fallback={null}>
            <ambientLight intensity={0.35} />
            <pointLight position={[0, 3, 5]} intensity={0.45} color="#A78BFA" />
            <pointLight position={[-3, -2, 3]} intensity={0.25} color="#60A5FA" />
            <Nebula />
            <Starfield />
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
