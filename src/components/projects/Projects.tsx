import { useState, useCallback, useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ProjectsHeading } from "./ProjectsHeading";
import { ProjectCard } from "./ProjectCard";
import { ProjectCardV2 } from "./ProjectCardV2";
import { ProjectItem } from "./ProjectItem";
import { ProjectCardV4 } from "./ProjectCardV4";
import { ProjectCardV6 } from "./ProjectCardV6";
import { ProjectCardV7 } from "./ProjectCardV7";
import { ProjectCardV8 } from "./ProjectCardV8";
import { useProjectsAnimations } from "./useProjectsAnimations";
import type { ProjectData } from "./projectsData";

gsap.registerPlugin(ScrollTrigger);

type Version = "v1" | "v2" | "original" | "v4" | "v6" | "v7" | "v8";

const VERSIONS: { key: Version; label: string }[] = [
  { key: "v1", label: "Grid" },
  { key: "v2", label: "Split" },
  { key: "original", label: "Classic" },
  { key: "v4", label: "Stack" },
  { key: "v6", label: "Bento" },
  { key: "v7", label: "Showcase" },
  { key: "v8", label: "Spotlight" },
];

interface ProjectsProps {
  projects?: ProjectData[];
}

export function Projects({ projects = [] }: ProjectsProps) {
  const sectionRef = useProjectsAnimations();
  const [version, setVersion] = useState<Version>("v1");
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const isTouchRef = useRef(
    typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches
  );

  const handleHoverStart = useCallback((index: number) => {
    if (isTouchRef.current) return;
    setExpandedIndex(index);
  }, []);

  const handleHoverEnd = useCallback(() => {
    if (isTouchRef.current) return;
    setExpandedIndex(null);
  }, []);

  const handleTap = useCallback((index: number) => {
    if (!isTouchRef.current) return;
    setExpandedIndex((prev) => (prev === index ? null : index));
  }, []);

  return (
    <section
      ref={sectionRef}
      id="projects"
      className="relative overflow-hidden bg-background"
    >
      {/* Glow blobs */}
      <div className="pointer-events-none absolute -left-1/4 top-0 h-[50%] w-[50%] rounded-full bg-primary/[0.06] blur-[60px] lg:blur-[120px]" />
      <div className="pointer-events-none absolute -right-1/4 bottom-1/4 h-[45%] w-[45%] rounded-full bg-primary/[0.05] blur-[50px] lg:blur-[100px]" />

      {/* Heading + Version switcher */}
      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-10">
        <ProjectsHeading />

        <div className="flex flex-wrap items-center gap-2 pb-10">
          {VERSIONS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => { setVersion(key); setExpandedIndex(null); }}
              data-cursor-scale
              className={`rounded-full border px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.15em] transition-all duration-300 ${
                version === key
                  ? "border-primary bg-primary text-primary-foreground shadow-[0_0_20px_var(--primary)]"
                  : "border-border/40 text-muted-foreground hover:border-primary/40 hover:text-foreground"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Projects */}
      <div className="relative z-10">
        {version === "v1" && (
          <div className="mx-auto max-w-7xl px-6 pb-24 lg:px-10">
            <div data-project-list className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:gap-8">
              {projects.map((p, i) => (
                <ProjectCard key={p.slug.current} project={p} index={i} />
              ))}
            </div>
          </div>
        )}

        {version === "v2" && (
          <div className="mx-auto max-w-7xl px-6 pb-24 lg:px-10">
            <div data-project-list>
              {projects.map((p, i) => (
                <ProjectCardV2 key={p.slug.current} project={p} index={i} />
              ))}
            </div>
          </div>
        )}

        {version === "original" && (
          <div className="mx-auto max-w-7xl px-6 pb-24 lg:px-10">
            <div data-project-list className="border-t border-border/40">
              {projects.map((p, i) => (
                <ProjectItem
                  key={p.slug.current}
                  project={p}
                  index={i}
                  isExpanded={expandedIndex === i}
                  onHoverStart={handleHoverStart}
                  onHoverEnd={handleHoverEnd}
                  onTap={handleTap}
                />
              ))}
            </div>
          </div>
        )}

        {version === "v4" && (
          <StackedCards projects={projects} />
        )}

        {version === "v7" && (
          <div className="mx-auto max-w-7xl px-6 pb-24 lg:px-10">
            <div data-project-list className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-7">
              {projects.map((p, i) => (
                <ProjectCardV7 key={p.slug.current} project={p} index={i} />
              ))}
            </div>
          </div>
        )}

        {version === "v8" && (
          <div className="mx-auto max-w-7xl px-6 pb-24 lg:px-10">
            <div data-project-list className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-7">
              {projects.map((p, i) => (
                <ProjectCardV8 key={p.slug.current} project={p} index={i} />
              ))}
            </div>
          </div>
        )}

        {version === "v6" && (
          <div className="mx-auto max-w-7xl px-6 pb-24 lg:px-10">
            <div data-project-list className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:gap-6">
              {projects.map((p, i) => (
                <ProjectCardV6 key={p.slug.current} project={p} index={i} />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function StackedCards({ projects }: { projects: ProjectData[] }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const cards = container.querySelectorAll<HTMLElement>("[data-project-item]");
    const triggers: ScrollTrigger[] = [];

    cards.forEach((card, i) => {
      if (i === cards.length - 1) return;

      const trigger = ScrollTrigger.create({
        trigger: card,
        start: "top 10%",
        end: "bottom -10%",
        pin: true,
        pinSpacing: true,
        onUpdate: (self) => {
          const scale = 1 - self.progress * 0.05;
          const brightness = 1 - self.progress * 0.3;
          gsap.set(card, {
            scale,
            filter: `brightness(${brightness})`,
          });
        },
      });
      triggers.push(trigger);
    });

    return () => triggers.forEach((t) => t.kill());
  }, [projects]);

  return (
    <div ref={containerRef} className="px-6 pb-24 lg:px-10">
      <div data-project-list className="flex flex-col gap-8">
        {projects.map((p, i) => (
          <ProjectCardV4
            key={p.slug.current}
            project={p}
            index={i}
            total={projects.length}
          />
        ))}
      </div>
    </div>
  );
}
