import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { ProjectData } from "./projectsData";

gsap.registerPlugin(ScrollTrigger);

/**
 * V6: Bento Grid with scroll-linked 3D entrance + reverse.
 * Cards rotate in from different angles based on position.
 * Reverses on scroll up for lively breathing effect.
 */

interface ProjectCardV6Props {
  project: ProjectData;
  index: number;
}

export function ProjectCardV6({ project, index }: ProjectCardV6Props) {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Alternate entrance directions based on grid position
    const col = index % 2; // 0 = left col, 1 = right col
    const xFrom = col === 0 ? -60 : 60;
    const rotateFrom = col === 0 ? -4 : 4;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: card,
        start: "top 90%",
        end: "top 40%",
        scrub: 1,
        toggleActions: "play reverse play reverse",
      },
    });

    tl.fromTo(
      card,
      { x: xFrom, y: 60, opacity: 0, rotate: rotateFrom, scale: 0.88 },
      { x: 0, y: 0, opacity: 1, rotate: 0, scale: 1, duration: 1, ease: "power3.out" },
    );

    return () => { tl.kill(); };
  }, [index]);

  return (
    <div
      ref={cardRef}
      data-project-item={index}
      className="group relative aspect-[16/10] overflow-hidden rounded-2xl border border-border/20 will-change-transform"
    >
      {/* Full bleed image */}
      <img
        src={project.thumbnail}
        alt={project.name}
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-110"
      />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/10 transition-opacity duration-500 group-hover:from-black/90 group-hover:via-black/50" />

      {/* Number — top right */}
      <span className="absolute right-4 top-4 font-heading text-4xl font-black text-white/[0.08] transition-colors duration-300 group-hover:text-primary/20">
        {String(index + 1).padStart(2, "0")}
      </span>

      {/* Arrow — slides in on hover */}
      {project.projectUrl && (
        <a
          href={project.projectUrl}
          target="_blank"
          rel="noopener noreferrer"
          data-cursor-scale
          onClick={(e) => e.stopPropagation()}
          className="absolute right-4 top-14 flex h-10 w-10 translate-y-2 items-center justify-center rounded-full border-2 border-primary/60 bg-primary text-primary-foreground opacity-0 transition-all duration-400 group-hover:translate-y-0 group-hover:opacity-100 hover:scale-110 hover:shadow-[0_0_20px_var(--primary)]"
        >
          <svg
            className="h-4 w-4 -rotate-45"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M17 7H7M17 7v10" />
          </svg>
        </a>
      )}

      {/* Info overlay — bottom */}
      <div className="absolute inset-x-0 bottom-0 flex flex-col gap-2 p-5">
        {/* Role */}
        <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-primary">
          {project.role}
        </span>

        {/* Name */}
        <h3 className="font-heading text-xl font-bold leading-tight text-white transition-colors duration-300 group-hover:text-primary lg:text-2xl">
          {project.projectUrl ? (
            <a href={project.projectUrl} target="_blank" rel="noopener noreferrer" data-cursor-scale>
              {project.name}
            </a>
          ) : (
            project.name
          )}
        </h3>

        {/* Skills — slide up on hover */}
        <div className="flex flex-wrap gap-1.5 translate-y-2 opacity-0 transition-all duration-400 group-hover:translate-y-0 group-hover:opacity-100">
          {project.skills.map((skill) => (
            <span
              key={skill}
              className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-medium text-white/80"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
