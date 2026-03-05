const LINES = [
  "I'm a full-stack developer based in Karachi, Pakistan, with over 3 years of experience building modern web applications.",
  "I specialize in React, Next.js, and Node.js ecosystems, with a passion for creating interfaces that are both visually compelling and technically robust.",
  "I believe great software is built at the intersection of clean code, thoughtful design, and relentless attention to detail.",
];

export function AboutDescription() {
  return (
    <div data-about-bio className="flex flex-col gap-4">
      {LINES.map((line, i) => (
        <div key={i} className="overflow-hidden">
          <p
            data-about-line
            className="text-base leading-relaxed text-muted-foreground md:text-lg"
          >
            {line}
          </p>
        </div>
      ))}
    </div>
  );
}
