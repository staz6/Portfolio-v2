export function ReviewsHeading() {
  const words = ["What", "They", "Say"];

  return (
    <div className="flex flex-col gap-6">
      <div data-reviews-label className="flex items-center gap-4">
        <span className="font-heading text-sm font-semibold tracking-widest text-primary">
          04
        </span>
        <span className="h-px w-12 bg-primary/40" />
        <span className="text-sm font-medium uppercase tracking-widest text-muted-foreground">
          Reviews
        </span>
      </div>

      <h2 className="font-heading text-5xl font-bold leading-[0.95] tracking-tight md:text-6xl lg:text-8xl">
        {words.map((word, i) => (
          <span key={i} className="mr-[0.3em] inline-block overflow-hidden last:mr-0">
            <span
              className={`inline-block will-change-transform ${i === words.length - 1 ? "text-primary" : ""}`}
              data-reviews-char
            >
              {word}
            </span>
          </span>
        ))}
      </h2>
    </div>
  );
}
