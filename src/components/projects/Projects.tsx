import { ProjectsHeading } from "./ProjectsHeading";
import { ProjectCard } from "./ProjectCard";
import { useProjectsAnimations } from "./useProjectsAnimations";
import type { ProjectData } from "./projectsData";

interface ProjectsProps {
  projects?: ProjectData[];
}

export function Projects({ projects = [] }: ProjectsProps) {
  const sectionRef = useProjectsAnimations();

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

      {/* Projects grid */}
      <div className="relative z-10 mx-auto max-w-7xl px-6 pb-24 lg:px-10">
        <div data-project-list className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-7">
          {projects.map((p, i) => (
            <ProjectCard key={p.slug.current} project={p} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
