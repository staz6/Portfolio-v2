const SERVICES = [
  "Web Development",
  "E-Commerce",
  "API Development",
  "UI/UX Design",
  "CMS Integration",
  "Mobile Apps",
  "Performance Optimization",
  "Cloud & DevOps",
];

function MarqueeItems() {
  return (
    <div className="flex shrink-0 items-center gap-8 pr-8">
      {SERVICES.map((tech, i) => (
        <span
          key={i}
          className="flex items-center gap-3 text-sm font-medium uppercase tracking-widest text-muted-foreground whitespace-nowrap"
        >
          <span>{tech}</span>
          <span className="h-1.5 w-1.5 rounded-full bg-primary/40" />
        </span>
      ))}
    </div>
  );
}

export function HeroMarquee() {
  return (
    <div
      data-hero-marquee
      className="marquee-fade overflow-hidden border-y border-border py-4"
    >
      <div
        className="flex w-max"
        style={{ animation: "marquee 30s linear infinite" }}
      >
        <MarqueeItems />
        <MarqueeItems />
      </div>
    </div>
  );
}
