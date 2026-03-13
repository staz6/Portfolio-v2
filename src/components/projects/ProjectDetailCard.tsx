import type { ProjectData } from "./projectsData";

export function ProjectDetailCard({ project }: { project: ProjectData }) {
  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr] lg:gap-12">
      {/* Image */}
      <div className="overflow-hidden rounded-xl">
        <img
          src={project.thumbnail}
          alt={project.name}
          className="h-[300px] w-full object-cover object-top lg:h-[400px]"
        />
      </div>

      {/* Info card */}
      <div className="flex flex-col rounded-2xl border border-border/30 bg-card/50 backdrop-blur-sm">
        {/* Description */}
        <div className="border-b border-border/20 px-6 py-5">
          <p className="text-base leading-relaxed text-foreground/70 lg:text-lg">
            {project.description}
          </p>
        </div>

        {/* Skills */}
        <div className="border-b border-border/20 px-6 py-4">
          <span className="mb-3 block text-[10px] font-semibold uppercase tracking-[0.3em] text-muted-foreground">
            Tech Stack
          </span>
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
        </div>

        {/* Link */}
        <div className="px-6 py-4">
          {project.projectUrl ? (
            <a
              href={project.projectUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              data-cursor-scale
              className="group/btn inline-flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.15em] text-foreground transition-colors duration-300 hover:text-primary"
            >
              View Project
              <span className="flex h-9 w-9 items-center justify-center rounded-full border border-border/40 transition-all duration-300 group-hover/btn:border-primary group-hover/btn:bg-primary group-hover/btn:text-primary-foreground">
                <svg
                  className="h-3.5 w-3.5 -rotate-45 transition-transform duration-300 group-hover/btn:rotate-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M17 7H7M17 7v10" />
                </svg>
              </span>
            </a>
          ) : (
            <span className="inline-flex cursor-not-allowed items-center gap-3 text-sm font-semibold uppercase tracking-[0.15em] text-muted-foreground/40">
              No Link Available
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
