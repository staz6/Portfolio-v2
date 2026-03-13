import type { ProjectData } from "./projectsData";

/**
 * V4: Stacked card — used with GSAP ScrollTrigger pin.
 * Each card is full-width, designed to be pinned and overlapped by the next.
 * Large image left, info right. Clean and immersive.
 */

interface ProjectCardV4Props {
  project: ProjectData;
  index: number;
  total: number;
}

export function ProjectCardV4({ project, index, total }: ProjectCardV4Props) {
  return (
    <div
      data-project-item={index}
      className="relative mx-auto grid h-[80vh] w-full max-w-7xl grid-cols-1 items-center gap-8 rounded-3xl border border-border/20 bg-card p-6 shadow-2xl shadow-black/10 lg:grid-cols-[1.4fr_1fr] lg:gap-12 lg:p-10"
    >
      {/* Image */}
      <div className="overflow-hidden rounded-2xl">
        <img
          src={project.thumbnail}
          alt={project.name}
          className="aspect-[16/10] w-full object-cover object-top"
        />
      </div>

      {/* Info */}
      <div className="flex flex-col gap-5">
        {/* Counter */}
        <div className="flex items-center gap-3">
          <span className="font-heading text-sm font-bold text-primary">
            {String(index + 1).padStart(2, "0")}
          </span>
          <span className="h-px flex-1 bg-border/40" />
          <span className="text-xs text-muted-foreground">
            {String(total).padStart(2, "0")}
          </span>
        </div>

        {/* Name */}
        <h3 className="font-heading text-3xl font-bold leading-tight text-foreground lg:text-4xl xl:text-5xl">
          {project.projectUrl ? (
            <a
              href={project.projectUrl}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor-scale
              className="transition-colors duration-300 hover:text-primary"
            >
              {project.name}
            </a>
          ) : (
            project.name
          )}
        </h3>

        {/* Role */}
        <span className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
          {project.role}
        </span>

        {/* Description */}
        <p className="text-sm leading-relaxed text-muted-foreground lg:text-base">
          {project.description}
        </p>

        {/* All skills */}
        <div className="flex flex-wrap gap-2">
          {project.skills.map((skill) => (
            <span
              key={skill}
              className="rounded-full border border-primary/20 bg-primary/[0.06] px-3 py-1 text-xs font-medium text-primary"
            >
              {skill}
            </span>
          ))}
        </div>

        {/* View link */}
        {project.projectUrl && (
          <a
            href={project.projectUrl}
            target="_blank"
            rel="noopener noreferrer"
            data-cursor-scale
            className="group/link mt-2 inline-flex w-fit items-center gap-3 text-sm font-semibold uppercase tracking-[0.15em] text-foreground transition-colors duration-300 hover:text-primary"
          >
            View Project
            <span className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-border/40 transition-all duration-300 group-hover/link:border-primary group-hover/link:bg-primary group-hover/link:text-primary-foreground group-hover/link:shadow-[0_0_25px_var(--primary)]">
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
        )}
      </div>
    </div>
  );
}
