interface HeroTitleProps {
  name?: string;
}

function SplitReveal({
  text,
  className,
  charClassName,
  baseDelay = 0,
  style,
}: {
  text: string;
  className?: string;
  charClassName?: string;
  baseDelay?: number;
  style?: React.CSSProperties;
}) {
  return (
    <span className={`block ${className || ""}`} style={style}>
      {text.split("").map((char, i) => (
        <span key={i} className="inline-block overflow-hidden">
          <span
            className={`hero-text-reveal inline-block ${charClassName || ""}`}
            style={{ animationDelay: `${baseDelay + i * 0.04}s` }}
          >
            {char === " " ? "\u00A0" : char}
          </span>
        </span>
      ))}
    </span>
  );
}

export function HeroTitle({ name = "Aahad" }: HeroTitleProps) {
  const parts = name.split(" ");
  const firstName = parts[0];
  const role = "Developer";

  return (
    <h1 className="font-heading font-bold uppercase leading-[0.85] tracking-tighter">
      <SplitReveal
        text={firstName}
        className="text-[18vw] md:text-[14vw] lg:text-[11vw]"
        charClassName="hero-char-shine"
        baseDelay={0}
      />
      <SplitReveal
        text={role}
        className="text-[11vw] md:text-[8vw] lg:text-[6.5vw]"
        baseDelay={firstName.length * 0.04 + 0.08}
        style={{
          WebkitTextStroke: "1.5px currentColor",
          WebkitTextFillColor: "transparent",
          color: "var(--primary)",
        }}
      />
    </h1>
  );
}
