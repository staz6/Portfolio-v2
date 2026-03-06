import { useState, useCallback } from "react";
import { ProjectsHeading } from "./ProjectsHeading";
import { V1ProjectItem } from "./V1ProjectItem";
import { V1ImageModal } from "./V1ImageModal";
import { useProjectsV1Animations } from "./useProjectsV1Animations";
import { useProjectsBgTransition } from "./useProjectsBgTransition";
import { PROJECTS } from "./projectsData";

export function ProjectsV1() {
  const sectionRef = useProjectsV1Animations();
  useProjectsBgTransition(sectionRef);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const handleHoverStart = useCallback((index: number) => {
    setActiveIndex(index);
  }, []);

  const handleHoverEnd = useCallback(() => {
    setActiveIndex(null);
  }, []);

  return (
    <section
      ref={sectionRef}
      id="projects"
      className="noise-overlay projects-grid relative overflow-hidden bg-background"
    >
      {/* Glow blobs */}
      <div className="pointer-events-none absolute -left-1/4 top-0 h-[50%] w-[50%] rounded-full bg-primary/[0.06] blur-[120px]" />
      <div className="pointer-events-none absolute -right-1/4 bottom-1/4 h-[45%] w-[45%] rounded-full bg-primary/[0.05] blur-[100px]" />

      {/* Heading */}
      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-10">
        <ProjectsHeading />
      </div>

      {/* Project list */}
      <div className="relative z-10 mx-auto max-w-7xl px-6 pb-24 lg:px-10">
        <div data-v1-list className="border-t border-border/40">
          {PROJECTS.map((project, i) => (
            <V1ProjectItem
              key={project.slug.current}
              project={project}
              index={i}
              onHoverStart={handleHoverStart}
              onHoverEnd={handleHoverEnd}
            />
          ))}
        </div>
      </div>

      {/* Floating cursor-following image */}
      <V1ImageModal activeIndex={activeIndex} />
    </section>
  );
}
