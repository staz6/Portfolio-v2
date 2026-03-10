interface HeroTitleProps {
  name?: string;
  role?: string;
}

function SplitText({
  text,
  className,
  charClassName,
  style,
  ...rest
}: {
  text: string;
  className?: string;
  charClassName?: string;
  style?: React.CSSProperties;
  [key: string]: unknown;
}) {
  return (
    <span className={className} style={style} {...rest}>
      {text.split("").map((char, i) => (
        <span key={i} className="inline-block overflow-hidden">
          <span
            className={`inline-block ${charClassName || ""}`}
            data-hero-char
          >
            {char === " " ? "\u00A0" : char}
          </span>
        </span>
      ))}
    </span>
  );
}

export function HeroTitle({
  name = "Aahad",
  role = "Developer",
}: HeroTitleProps) {
  return (
    <h1 className="font-heading font-bold uppercase leading-[0.85] tracking-tighter">
      <SplitText
        data-hero-name
        text={name}
        className="block will-change-transform text-[18vw] md:text-[14vw] lg:text-[11vw]"
        charClassName="hero-char-shine"
      />
      <SplitText
        data-hero-role
        text={role}
        className="block will-change-transform text-[11vw] md:text-[8vw] lg:text-[6.5vw]"
        style={{
          WebkitTextStroke: "1.5px currentColor",
          WebkitTextFillColor: "transparent",
          color: "var(--primary)",
        }}
      />
    </h1>
  );
}
