export function AboutHeading() {
  const words = ["Crafting", "Digital", "Experiences"];

  return (
    <div className="flex flex-col gap-6">
      {/* Section number label */}
      <div data-about-label className="flex items-center gap-4">
        <span className="font-heading text-sm font-semibold tracking-widest text-primary">
          01
        </span>
        <span className="h-px w-12 bg-primary/40" />
        <span className="text-sm font-medium uppercase tracking-widest text-muted-foreground">
          About
        </span>
      </div>

      {/* Main heading — word-level split for GSAP */}
      <h2 className="font-heading text-4xl font-bold leading-[0.95] tracking-tight md:text-5xl lg:text-6xl">
        {words.map((word, i) => (
          <span key={i} className="inline-block overflow-hidden mr-[0.3em] last:mr-0">
            <span
              className={`inline-block will-change-transform ${i === words.length - 1 ? "text-primary" : ""}`}
              data-about-char
            >
              {word}
            </span>
          </span>
        ))}
      </h2>
    </div>
  );
}
