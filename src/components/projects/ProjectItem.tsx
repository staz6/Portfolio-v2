import { useCallback } from "react";
import type { ProjectData } from "./projectsData";
import { ProjectDetailCard } from "./ProjectDetailCard";

interface ProjectItemProps {
  project: ProjectData;
  index: number;
  isExpanded: boolean;
  onHoverStart: (index: number) => void;
  onHoverEnd: () => void;
  onTap: (index: number) => void;
}

export function ProjectItem({
  project,
  index,
  isExpanded,
  onHoverStart,
  onHoverEnd,
  onTap,
}: ProjectItemProps) {
  const handleMouseEnter = useCallback(() => {
    onHoverStart(index);
  }, [index, onHoverStart]);

  const handleClick = useCallback(() => {
    onTap(index);
  }, [index, onTap]);

  return (
    <div
      data-project-item={index}
      data-cursor-scale
      onMouseEnter={handleMouseEnter}
      onMouseLeave={onHoverEnd}
      onClick={handleClick}
      className="group relative border-b border-border/40 transition-colors hover:border-primary/40"
    >
      {/* Row header */}
      <div className="flex items-center justify-between py-8 lg:py-12">
        {/* Left: number + title */}
        <div className="flex items-baseline gap-6 lg:gap-10">
          <span className="font-heading text-sm font-semibold text-muted-foreground transition-colors group-hover:text-primary lg:text-base">
            {String(index + 1).padStart(2, "0")}
          </span>
          <h3 className="font-heading text-2xl font-bold text-foreground transition-all duration-500 group-hover:translate-x-3 group-hover:text-primary md:text-4xl lg:text-6xl xl:text-7xl truncate max-w-[60vw] lg:max-w-[50vw]">
            {project.projectUrl ? (
              <a
                href={project.projectUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
              >
                {project.name}
              </a>
            ) : (
              <span>{project.name}</span>
            )}
          </h3>
        </div>

        {/* Right: role + arrow */}
        <div className="flex items-center gap-6">
          <span className="hidden text-sm font-medium uppercase tracking-widest text-muted-foreground transition-colors group-hover:text-foreground md:block">
            {project.role}
          </span>
          <div className="flex h-10 w-10 items-center justify-center rounded-full border border-border transition-all duration-300 group-hover:border-primary group-hover:bg-primary group-hover:text-primary-foreground lg:h-14 lg:w-14">
            <svg
              className={`h-4 w-4 transition-transform duration-300 lg:h-5 lg:w-5 ${isExpanded ? "rotate-90" : "-rotate-45 group-hover:rotate-0"}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M7 17L17 7M17 7H7M17 7v10"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Expanded detail panel — CSS grid-rows for GPU-friendly height animation */}
      <div
        className="grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
        style={{ gridTemplateRows: isExpanded ? "1fr" : "0fr" }}
      >
        <div
          className="overflow-hidden transition-opacity duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
          style={{ opacity: isExpanded ? 1 : 0 }}
        >
          <div className="pb-8 lg:pb-12">
            <ProjectDetailCard project={project} />
          </div>
        </div>
      </div>
    </div>
  );
}
