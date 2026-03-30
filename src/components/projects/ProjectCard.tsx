import { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { ProjectProps } from "@/sanity/lib/mappers";

gsap.registerPlugin(ScrollTrigger);

interface ProjectCardProps {
  project: ProjectProps;
  index: number;
}

export function ProjectCard({ project, index }: ProjectCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // Lock body scroll when overlay is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  // Scroll-linked entrance with reverse
  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const col = index % 3;
    const xFrom = col === 0 ? -40 : col === 2 ? 40 : 0;
    const yFrom = col === 1 ? 80 : 50;
    const rotateFrom = col === 0 ? -3 : col === 2 ? 3 : 0;

    const tl = gsap.timeline({
      defaults: { force3D: true },
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
      { x: xFrom, y: yFrom, opacity: 0, rotate: rotateFrom, scale: 0.9 },
      { x: 0, y: 0, opacity: 1, rotate: 0, scale: 1, ease: "power3.out" },
    );

    return () => { tl.kill(); };
  }, [index]);

  return (
    <>
      {/* Card */}
      <div
        ref={cardRef}
        data-project-item={index}
        onClick={() => setIsOpen(true)}
        className="group flex cursor-pointer flex-col overflow-hidden rounded-2xl border border-border/20 bg-card opacity-0 will-change-transform transition-[border-color] duration-300 hover:border-primary/30"
      >
        {/* Image */}
        <div className="relative overflow-hidden">
          <img
            src={project.thumbnail}
            alt={project.name}
            loading="lazy"
            width={800}
            height={500}
            className="aspect-[16/10] w-full object-cover object-top transition-transform duration-500 ease-out will-change-transform group-hover:scale-105"
          />
          <span className="absolute right-4 top-4 font-heading text-3xl font-black text-white/[0.08] transition-colors duration-300 group-hover:text-primary/20">
            {String(index + 1).padStart(2, "0")}
          </span>
        </div>

        {/* Info */}
        <div className="flex flex-1 flex-col gap-3 p-5">
          <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-primary">
            {project.role}
          </span>
          <h3 className="font-heading text-xl font-bold text-foreground transition-colors duration-300 group-hover:text-primary">
            {project.name}
          </h3>
          <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
            {project.description}
          </p>
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
          <button className="mt-3 flex w-full items-center justify-center gap-2 rounded-full border-2 border-primary/30 py-3 text-sm font-semibold uppercase tracking-[0.1em] text-primary transition-all duration-300 hover:border-primary hover:bg-primary hover:text-primary-foreground hover:shadow-[0_0_25px_var(--primary)]">
            View Details
            <svg className="h-3.5 w-3.5 -rotate-45" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M17 7H7M17 7v10" />
            </svg>
          </button>
        </div>
      </div>

      {/* Overlay — rendered via Portal to escape card's stacking context */}
      {typeof document !== "undefined" &&
        createPortal(
          <AnimatePresence>
            {isOpen && (
              <ProjectOverlay project={project} onClose={() => setIsOpen(false)} />
            )}
          </AnimatePresence>,
          document.body,
        )}
    </>
  );
}

/* ── Overlay with staggered content animation ──────────────── */

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

const panelVariants = {
  hidden: { y: 60, opacity: 0, scale: 0.95 },
  visible: {
    y: 0,
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const },
  },
  exit: {
    y: 30,
    opacity: 0,
    scale: 0.97,
    transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] as const },
  },
};

const imageVariants = {
  hidden: { x: -40, opacity: 0, scale: 0.95 },
  visible: {
    x: 0,
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] as const },
  },
};

const infoItemVariants = {
  hidden: { x: 30, opacity: 0 },
  visible: (i: number) => ({
    x: 0,
    opacity: 1,
    transition: { duration: 0.5, delay: 0.2 + i * 0.07, ease: [0.16, 1, 0.3, 1] as const },
  }),
};

function ProjectOverlay({
  project,
  onClose,
}: {
  project: ProjectProps;
  onClose: () => void;
}) {
  return (
    <motion.div
      variants={overlayVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 lg:p-10"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-background/90" />

      <motion.div
        variants={panelVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        onClick={(e) => e.stopPropagation()}
        className="relative z-10 grid max-h-[90vh] w-full max-w-6xl grid-cols-1 overflow-y-auto rounded-3xl border border-border/30 bg-card shadow-2xl lg:grid-cols-[1.2fr_1fr] lg:overflow-hidden"
      >
        {/* Image — fills full height of left column */}
        <motion.div
          variants={imageVariants}
          initial="hidden"
          animate="visible"
          className="relative h-[300px] overflow-hidden lg:h-full lg:min-h-[250px]"
        >
          <img
            src={project.thumbnail}
            alt={project.name}
            loading="lazy"
            width={800}
            height={500}
            className="absolute inset-0 h-full w-full object-cover object-top"
          />
        </motion.div>

        {/* Info — staggered reveal */}
        <div className="flex flex-col gap-5 overflow-y-auto p-6 lg:p-10">
          {/* Close */}
          <motion.button
            custom={0}
            variants={infoItemVariants}
            initial="hidden"
            animate="visible"
            onClick={onClose}
            className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full border border-border/30 bg-card/80 text-foreground/60 backdrop-blur-sm transition-all duration-300 hover:border-primary/50 hover:bg-primary/20 hover:text-foreground hover:rotate-90"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </motion.button>

          {/* Role */}
          <motion.span custom={1} variants={infoItemVariants} initial="hidden" animate="visible" className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
            {project.role}
          </motion.span>

          {/* Name */}
          <motion.h2 custom={2} variants={infoItemVariants} initial="hidden" animate="visible" className="font-heading text-3xl font-bold text-foreground lg:text-4xl">
            {project.name}
          </motion.h2>

          {/* Description */}
          <motion.p custom={3} variants={infoItemVariants} initial="hidden" animate="visible" className="text-base leading-relaxed text-muted-foreground">
            {project.description}
          </motion.p>

          {/* Skills */}
          <motion.div custom={4} variants={infoItemVariants} initial="hidden" animate="visible" className="flex flex-wrap gap-2">
            {project.skills.map((skill) => (
              <span
                key={skill}
                className="rounded-full border border-primary/20 bg-primary/[0.06] px-4 py-1.5 text-sm font-medium text-primary"
              >
                {skill}
              </span>
            ))}
          </motion.div>

          {/* CTA */}
          <motion.div custom={5} variants={infoItemVariants} initial="hidden" animate="visible" className="mt-auto">
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
