import { useMagnetic } from "@/hooks/useMagnetic";
import type { ProjectData } from "./projectsData";

interface ProjectCardProps {
  project: ProjectData;
  index: number;
}

export function ProjectCard({ project, index }: ProjectCardProps) {
  const magneticRef = useMagnetic<HTMLDivElement>({ strength: 0.15 });

  return (
    <div
      ref={magneticRef}
      data-project-item={index}
      className="group relative overflow-hidden rounded-2xl border border-border/20 bg-card transition-[border-color,box-shadow] duration-500 hover:border-primary/40 hover:shadow-[0_0_40px_rgba(255,107,43,0.08)]"
    >
      {/* Image container */}
      <div className="relative aspect-[16/10] overflow-hidden">
        <img
          src={project.thumbnail}
          alt={project.name}
          loading="lazy"
          className="h-full w-full object-cover object-top transition-transform duration-700 ease-out will-change-transform group-hover:scale-110"
        />

        {/* Dark gradient overlay — always visible, intensifies on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent opacity-60 transition-opacity duration-500 group-hover:opacity-90" />

        {/* Number badge — top left */}
        <span className="absolute left-5 top-5 font-heading text-5xl font-black text-foreground/10 transition-colors duration-500 group-hover:text-primary/20">
          {String(index + 1).padStart(2, "0")}
        </span>

        {/* Arrow link — top right, slides in */}
        {project.projectUrl ? (
          <a
            href={project.projectUrl}
            target="_blank"
            rel="noopener noreferrer"
            data-cursor-scale
            onClick={(e) => e.stopPropagation()}
            className="absolute right-5 top-5 flex h-12 w-12 translate-x-4 items-center justify-center rounded-full border-2 border-primary/50 bg-primary text-primary-foreground opacity-0 transition-all duration-500 ease-out group-hover:translate-x-0 group-hover:opacity-100 hover:scale-110 hover:shadow-[0_0_25px_var(--primary)]"
          >
            <svg
              className="h-5 w-5 -rotate-45 transition-transform duration-300 group-hover:rotate-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M17 7H7M17 7v10" />
            </svg>
          </a>
        ) : null}

        {/* Description — slides up from bottom */}
        <div className="absolute bottom-0 left-0 right-0 translate-y-6 px-6 pb-6 opacity-0 transition-all duration-500 ease-out group-hover:translate-y-0 group-hover:opacity-100">
          <p className="line-clamp-3 text-sm leading-relaxed text-foreground/90">
            {project.description}
          </p>
        </div>
      </div>

      {/* Bottom info bar */}
      <div className="relative px-6 py-5">
        {/* Glow line at top */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/0 to-transparent transition-all duration-500 group-hover:via-primary/40" />

        {/* Name + Role */}
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <h3 className="truncate font-heading text-xl font-bold text-foreground transition-colors duration-300 group-hover:text-primary">
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
            <p className="mt-1 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
              {project.role}
            </p>
          </div>

          {/* Mobile arrow */}
          {project.projectUrl ? (
            <a
              href={project.projectUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-border transition-colors duration-300 group-hover:border-primary group-hover:text-primary lg:hidden"
            >
              <svg
                className="h-4 w-4 -rotate-45"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M17 7H7M17 7v10" />
              </svg>
            </a>
          ) : null}
        </div>

        {/* Tech stack pills */}
        <div className="mt-3 flex flex-wrap gap-1.5">
          {project.skills.map((skill) => (
            <span
              key={skill}
              className="rounded-full border border-primary/15 bg-primary/[0.05] px-2.5 py-1 text-[11px] font-medium text-primary transition-colors duration-300 group-hover:border-primary/30 group-hover:bg-primary/10"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
