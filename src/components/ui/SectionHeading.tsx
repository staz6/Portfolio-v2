interface SectionHeadingProps {
  /** Section number displayed in the label (e.g. "01") */
  number: string;
  /** Section label text (e.g. "About") */
  label: string;
  /** Heading words — last word gets primary color */
  words: string[];
  /** Data attribute prefix for GSAP targeting (e.g. "about" → data-about-label, data-about-char) */
  prefix: string;
  /** Optional h2 className override (default: large heading sizes) */
  headingClassName?: string;
  /** Optional wrapper className for extra spacing */
  className?: string;
}

export function SectionHeading({
  number,
  label,
  words,
  prefix,
  headingClassName = "font-heading text-5xl font-bold leading-[0.95] tracking-tight md:text-6xl lg:text-8xl",
  className,
}: SectionHeadingProps) {
  return (
    <div className={`flex flex-col gap-6 ${className || ""}`}>
      <div {...{ [`data-${prefix}-label`]: true }} className="flex items-center gap-4">
        <span className="font-heading text-sm font-semibold tracking-widest text-primary">
          {number}
        </span>
        <span className="h-px w-12 bg-primary/40" />
        <span className="text-sm font-medium uppercase tracking-widest text-muted-foreground">
          {label}
        </span>
      </div>

      <h2 className={headingClassName}>
        {words.map((word, i) => (
          <span key={i} className="mr-[0.3em] inline-block overflow-hidden last:mr-0">
            <span
              className={`inline-block will-change-transform ${i === words.length - 1 ? "text-primary" : ""}`}
              {...{ [`data-${prefix}-char`]: true }}
            >
              {word}
            </span>
          </span>
        ))}
      </h2>
    </div>
  );
}
