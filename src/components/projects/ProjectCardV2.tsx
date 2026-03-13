import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { ProjectData } from "./projectsData";

gsap.registerPlugin(ScrollTrigger);

/**
 * Version 2: Full-width split layout with scroll-linked entrance animations.
 * Image slides in from one side, info elements stagger in from the other.
 * Animations reverse on scroll up for a lively, breathing feel.
 */

interface ProjectCardV2Props {
  project: ProjectData;
  index: number;
}

export function ProjectCardV2({ project, index }: ProjectCardV2Props) {
  const rowRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const imageWrapRef = useRef<HTMLDivElement>(null);
  const isEven = index % 2 === 0;

  // Scroll-linked entrance + reverse animations
  useEffect(() => {
    const row = rowRef.current;
    if (!row) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const imageWrap = row.querySelector("[data-v2-image]");
    const role = row.querySelector("[data-v2-role]");
    const name = row.querySelector("[data-v2-name]");
    const desc = row.querySelector("[data-v2-desc]");
    const skills = row.querySelector("[data-v2-skills]");
    const link = row.querySelector("[data-v2-link]");
    const number = row.querySelector("[data-v2-number]");

    const imageDirection = isEven ? -80 : 80;
    const infoDirection = isEven ? 60 : -60;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: row,
        start: "top 80%",
        end: "top 20%",
        scrub: 1,
        toggleActions: "play reverse play reverse",
      },
    });

    // Image slides in from left/right with rotation
    tl.fromTo(
      imageWrap,
      { x: imageDirection, opacity: 0, rotate: isEven ? -2 : 2, scale: 0.92 },
      { x: 0, opacity: 1, rotate: 0, scale: 1, duration: 1, ease: "power3.out" },
      0,
    );

    // Number fades in with scale
    tl.fromTo(
      number,
      { scale: 0.5, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.6, ease: "back.out(2)" },
      0.15,
    );

    // Info elements stagger in from opposite side
    const infoElements = [role, name, desc, skills, link].filter(Boolean);
    infoElements.forEach((el, i) => {
      tl.fromTo(
        el!,
        { x: infoDirection, opacity: 0, y: 15 },
        { x: 0, opacity: 1, y: 0, duration: 0.8, ease: "power3.out" },
        0.1 + i * 0.08,
      );
    });

    return () => {
      tl.kill();
    };
  }, [isEven]);

  // Parallax mouse follow on image
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const img = imageRef.current;
    if (!img) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    gsap.to(img, { x: x * 20, y: y * 20, scale: 1.05, duration: 0.6, ease: "power2.out" });
  };

  const handleMouseLeave = () => {
    const img = imageRef.current;
    if (!img) return;
    gsap.to(img, { x: 0, y: 0, scale: 1, duration: 0.6, ease: "power2.out" });
  };

  return (
    <div
      ref={rowRef}
      data-project-item={index}
      className={`group grid grid-cols-1 gap-8 border-b border-border/20 py-12 lg:grid-cols-2 lg:gap-16 lg:py-20`}
      style={!isEven ? { direction: "rtl" } : undefined}
    >
      {/* Image */}
      <div
        data-v2-image
        ref={imageWrapRef}
        className="relative aspect-[16/10] self-center overflow-hidden rounded-2xl"
        style={!isEven ? { direction: "ltr" } : undefined}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <img
          ref={imageRef}
          src={project.thumbnail}
          alt={project.name}
          loading="lazy"
          className="h-full w-full object-cover object-top will-change-transform"
        />

        {/* Gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

        {/* Number watermark */}
        <span
          data-v2-number
          className="absolute bottom-4 right-4 font-heading text-7xl font-black text-foreground/[0.06] transition-colors duration-500 group-hover:text-primary/15 lg:text-9xl"
        >
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>

      {/* Info */}
      <div
        className="flex flex-col justify-center gap-6"
        style={!isEven ? { direction: "ltr" } : undefined}
      >
        {/* Role tag */}
        <span data-v2-role className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
          {project.role}
        </span>

        {/* Name */}
        <h3 data-v2-name className="font-heading text-4xl font-bold leading-tight text-foreground transition-colors duration-300 group-hover:text-primary lg:text-5xl xl:text-6xl">
          {project.projectUrl ? (
            <a
              href={project.projectUrl}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor-scale
            >
              {project.name}
            </a>
          ) : (
            project.name
          )}
        </h3>

        {/* Description */}
        <p data-v2-desc className="text-base leading-relaxed text-muted-foreground lg:text-lg">
          {project.description}
        </p>

        {/* Tech stack */}
        <div data-v2-skills className="flex flex-wrap gap-2">
          {project.skills.map((skill) => (
            <span
              key={skill}
              className="rounded-full border border-primary/20 bg-primary/[0.06] px-4 py-1.5 text-xs font-medium text-primary"
            >
              {skill}
            </span>
          ))}
        </div>

        {/* View link */}
        {project.projectUrl ? (
          <a
            data-v2-link
            href={project.projectUrl}
            target="_blank"
            rel="noopener noreferrer"
            data-cursor-scale
            className="group/link mt-2 inline-flex w-fit items-center gap-3 text-sm font-semibold uppercase tracking-[0.15em] text-foreground transition-colors duration-300 hover:text-primary"
          >
            View Project
            <span className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-border/40 transition-all duration-300 group-hover/link:border-primary group-hover/link:bg-primary group-hover/link:text-primary-foreground group-hover/link:shadow-[0_0_25px_var(--primary)]">
              <svg
                className="h-4 w-4 -rotate-45 transition-transform duration-300 group-hover/link:rotate-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M17 7H7M17 7v10" />
              </svg>
            </span>
          </a>
        ) : null}
      </div>
    </div>
  );
}
