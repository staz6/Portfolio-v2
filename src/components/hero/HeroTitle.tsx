interface HeroTitleProps {
  name?: string;
  role?: string;
}

function SplitText({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  return (
    <span className={className}>
      {text.split("").map((char, i) => (
        <span key={i} className="inline-block overflow-hidden">
          <span className="inline-block will-change-transform" data-hero-char>
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
        text={name}
        className="block text-[18vw] md:text-[14vw] lg:text-[11vw]"
      />
      <SplitText
        text={role}
        className="block text-[11vw] text-muted-foreground md:text-[8vw] lg:text-[6.5vw]"
      />
    </h1>
  );
}
