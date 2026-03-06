export function ProjectsHeading() {
  const words = ["Selected", "Work"];

  return (
    <div className="flex flex-col gap-6 pb-16 pt-24 lg:pb-24 lg:pt-40">
      {/* Section label */}
      <div data-projects-label className="flex items-center gap-4">
        <span className="font-heading text-sm font-semibold tracking-widest text-primary">
          02
        </span>
        <span className="h-px w-12 bg-primary/40" />
        <span className="text-sm font-medium uppercase tracking-widest text-muted-foreground">
          Projects
        </span>
      </div>

      {/* Heading — word-level split for GSAP mask reveal */}
      <h2 className="font-heading text-5xl font-bold leading-[0.95] tracking-tight md:text-6xl lg:text-8xl">
        {words.map((word, i) => (
          <span key={i} className="inline-block overflow-hidden mr-[0.3em] last:mr-0">
            <span
              className={`inline-block will-change-transform ${i === words.length - 1 ? "text-primary" : ""}`}
              data-projects-char
            >
              {word}
            </span>
          </span>
        ))}
      </h2>
    </div>
  );
}
