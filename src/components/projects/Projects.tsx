import { useState, useCallback, useRef } from "react";
import { ProjectsHeading } from "./ProjectsHeading";
import { ProjectItem } from "./ProjectItem";
import { useProjectsAnimations } from "./useProjectsAnimations";
import { useProjectsBgTransition } from "./useProjectsBgTransition";
import { PROJECTS } from "./projectsData";

export function Projects() {
  const sectionRef = useProjectsAnimations();
  useProjectsBgTransition(sectionRef);
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

      {/* Heading */}
      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-10">
        <ProjectsHeading />
      </div>

      {/* Project list */}
      <div className="relative z-10 mx-auto max-w-7xl px-6 pb-24 lg:px-10">
        <div data-project-list className="border-t border-border/40">
          {PROJECTS.map((project, i) => (
            <ProjectItem
              key={project.slug.current}
              project={project}
              index={i}
              isExpanded={expandedIndex === i}
              onHoverStart={handleHoverStart}
              onHoverEnd={handleHoverEnd}
              onTap={handleTap}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
