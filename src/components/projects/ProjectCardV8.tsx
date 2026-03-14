import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { ProjectData } from "./projectsData";

gsap.registerPlugin(ScrollTrigger);

/**
 * V8: Spotlight cards with 3D tilt, animated gradient border, and detail overlay.
 * - Cards tilt toward mouse on hover (3D perspective)
 * - Spotlight gradient follows cursor inside card
 * - Animated glowing border on hover
 * - Click opens staggered detail overlay
 */

interface ProjectCardV8Props {
  project: ProjectData;
  index: number;
}

export function ProjectCardV8({ project, index }: ProjectCardV8Props) {
  const [isOpen, setIsOpen] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  // Scroll entrance
  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: card,
        start: "top 90%",
        end: "top 45%",
        scrub: 1,
        toggleActions: "play reverse play reverse",
      },
    });

    tl.fromTo(
      card,
      { y: 80, opacity: 0, scale: 0.92 },
      { y: 0, opacity: 1, scale: 1, duration: 1, ease: "power3.out" },
    );

    return () => { tl.kill(); };
  }, [index]);

  // 3D tilt + spotlight follow
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    const glow = glowRef.current;
    if (!card || !glow) return;

    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    // 3D tilt
    const tiltX = (y - 0.5) * -8;
    const tiltY = (x - 0.5) * 8;
    gsap.to(card, {
      rotateX: tiltX,
      rotateY: tiltY,
      duration: 0.4,
      ease: "power2.out",
    });

  }, []);

  const handleMouseLeave = useCallback(() => {
    const card = cardRef.current;
    const glow = glowRef.current;
    if (!card) return;
    gsap.to(card, { rotateX: 0, rotateY: 0, duration: 0.5, ease: "power2.out" });
  }, []);

  return (
    <>
      <div
        ref={cardRef}
        data-project-item={index}
        onClick={() => setIsOpen(true)}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="group relative h-full cursor-pointer overflow-hidden rounded-2xl will-change-transform"
        style={{ perspective: "1000px", transformStyle: "preserve-3d" }}
      >
        {/* Card body */}
        <div className="relative flex h-full flex-col overflow-hidden rounded-2xl bg-card">

          {/* Image */}
          <div className="relative overflow-hidden">
            <img
              src={project.thumbnail}
              alt={project.name}
              loading="lazy"
              className="aspect-[16/10] w-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-110"
            />


            {/* Number — glows on hover */}
            <span className="absolute right-5 top-5 font-heading text-4xl font-black text-white/[0.06] transition-all duration-500 group-hover:text-primary/25 group-hover:drop-shadow-[0_0_8px_var(--primary)]">
              {String(index + 1).padStart(2, "0")}
            </span>
          </div>

          {/* Info */}
          <div className="relative z-20 flex flex-1 flex-col gap-3 px-5 pb-5 pt-2 -mt-8">
            {/* Role */}
            <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-primary">
              {project.role}
            </span>

            {/* Name */}
            <h3 className="font-heading text-xl font-bold text-foreground transition-colors duration-300 group-hover:text-primary lg:text-2xl">
              {project.name}
            </h3>

            {/* Description */}
            <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
              {project.description}
            </p>

            {/* Skills */}
            <div className="mt-auto flex flex-wrap items-center gap-1.5 pt-2">
              {project.skills.slice(0, 3).map((skill) => (
                <span
                  key={skill}
                  className="rounded-full border border-primary/15 bg-primary/[0.05] px-2.5 py-0.5 text-[11px] font-medium text-primary"
                >
                  {skill}
                </span>
              ))}
              {project.skills.length > 3 && (
                <span className="rounded-full border border-border/30 px-2.5 py-0.5 text-[11px] font-medium text-primary">
                  +{project.skills.length - 3} more
                </span>
              )}
            </div>

            {/* CTA — gradient animated border */}
            <button className="group/btn relative mt-3 overflow-hidden rounded-full py-3 text-sm font-semibold uppercase tracking-[0.1em] text-primary">
              <span className="absolute inset-0 rounded-full border-2 border-primary/20 transition-all duration-300 group-hover/btn:border-primary group-hover/btn:shadow-[0_0_20px_var(--primary),inset_0_0_20px_var(--primary)/10]" />
              <span className="relative flex items-center justify-center gap-2">
                View Details
                <svg className="h-3.5 w-3.5 -rotate-45 transition-transform duration-300 group-hover/btn:rotate-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M17 7H7M17 7v10" />
                </svg>
              </span>
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && <ProjectOverlayV8 project={project} onClose={() => setIsOpen(false)} />}
      </AnimatePresence>
    </>
  );
}

/* ── Overlay ── */

function ProjectOverlayV8({ project, onClose }: { project: ProjectData; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 lg:p-10"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-background/90" />

      <motion.div
        initial={{ y: 60, opacity: 0, scale: 0.95 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 30, opacity: 0, scale: 0.97 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] as const }}
        onClick={(e) => e.stopPropagation()}
        className="relative z-10 grid max-h-[90vh] w-full max-w-6xl grid-cols-1 overflow-y-auto rounded-3xl border border-border/30 bg-card shadow-2xl lg:grid-cols-[1.2fr_1fr] lg:items-center lg:overflow-hidden"
      >
        {/* Image */}
        <motion.div
          initial={{ x: -40, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] as const }}
          className="overflow-y-auto p-6 lg:p-8"
          style={{ maxHeight: "90vh" }}
        >
          <img
            src={project.thumbnail}
            alt={project.name}
            className="h-[300px] w-full rounded-xl object-cover object-top  lg:h-auto"
          />
        </motion.div>

        {/* Info */}
        <div className="flex flex-col gap-5 overflow-y-auto p-6 lg:p-10">
          <motion.button
            initial={{ opacity: 0, rotate: -90 }}
            animate={{ opacity: 1, rotate: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            onClick={onClose}
            className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full border border-border/40 text-muted-foreground transition-all duration-300 hover:border-primary hover:bg-primary hover:text-primary-foreground hover:rotate-90"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </motion.button>

          <motion.span initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.2, duration: 0.4 }} className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
            {project.role}
          </motion.span>

          <motion.h2 initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.25, duration: 0.4 }} className="font-heading text-3xl font-bold text-foreground lg:text-4xl">
            {project.name}
          </motion.h2>

          <motion.p initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.3, duration: 0.4 }} className="text-base leading-relaxed text-muted-foreground">
            {project.description}
          </motion.p>

          <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.35, duration: 0.4 }} className="flex flex-wrap gap-2">
            {project.skills.map((skill) => (
              <span key={skill} className="rounded-full border border-primary/20 bg-primary/[0.06] px-4 py-1.5 text-sm font-medium text-primary">
                {skill}
              </span>
            ))}
          </motion.div>

          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4, duration: 0.4 }} className="mt-auto">
            {project.projectUrl ? (
              <a
                href={project.projectUrl}
                target="_blank"
                rel="noopener noreferrer"
                data-cursor-scale
                className="flex items-center justify-center gap-3 rounded-full border-2 border-primary/40 py-4 text-sm font-semibold uppercase tracking-[0.15em] text-primary transition-all duration-300 hover:border-primary hover:bg-primary hover:text-primary-foreground hover:shadow-[0_0_30px_var(--primary)]"
              >
                View Project
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            ) : (
              <div className="flex items-center justify-center rounded-full border-2 border-border/20 py-4 text-sm font-semibold uppercase tracking-[0.15em] text-muted-foreground/40">
                No Link Available
              </div>
            )}
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}
