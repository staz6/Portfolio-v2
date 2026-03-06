import { useCallback } from "react";
import type { ProjectData } from "./projectsData";

interface V1ProjectItemProps {
  project: ProjectData;
  index: number;
  onHoverStart: (index: number) => void;
  onHoverEnd: () => void;
}

export function V1ProjectItem({
  project,
  index,
  onHoverStart,
  onHoverEnd,
}: V1ProjectItemProps) {
  const handleMouseEnter = useCallback(() => {
    onHoverStart(index);
  }, [index, onHoverStart]);

  return (
    <a
      href={project.projectUrl}
      target="_blank"
      rel="noopener noreferrer"
      data-v1-item={index}
      data-cursor-scale
      onMouseEnter={handleMouseEnter}
      onMouseLeave={onHoverEnd}
      className="group relative flex items-center justify-between border-b border-border/40 py-8 transition-colors hover:border-primary/40 lg:py-12"
    >
      {/* Left: number + title */}
      <div className="flex items-baseline gap-6 lg:gap-10">
        <span className="font-heading text-sm font-semibold text-muted-foreground transition-colors group-hover:text-primary lg:text-base">
          {String(index + 1).padStart(2, "0")}
        </span>
        <h3 className="font-heading text-3xl font-bold text-foreground transition-all duration-500 group-hover:translate-x-3 group-hover:text-primary md:text-5xl lg:text-7xl xl:text-8xl">
          {project.name}
        </h3>
      </div>

      {/* Right: role + arrow */}
      <div className="flex items-center gap-6">
        <span className="hidden text-sm font-medium uppercase tracking-widest text-muted-foreground transition-colors group-hover:text-foreground md:block">
          {project.role}
        </span>
        <div className="flex h-10 w-10 items-center justify-center rounded-full border border-border transition-all duration-300 group-hover:border-primary group-hover:bg-primary group-hover:text-primary-foreground lg:h-14 lg:w-14">
          <svg
            className="h-4 w-4 transition-transform duration-300 group-hover:rotate-0 -rotate-45 lg:h-5 lg:w-5"
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
    </a>
  );
}
