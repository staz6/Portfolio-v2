import { Github, Linkedin } from "lucide-react";
import { useMagnetic } from "@/hooks/useMagnetic";
import type { HeroSocial } from "@/sanity/lib/mappers";

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  github: Github,
  linkedin: Linkedin,
};

const DEFAULT_SOCIALS: HeroSocial[] = [
  { icon: "github", href: "https://github.com", label: "GitHub" },
  { icon: "linkedin", href: "https://linkedin.com", label: "LinkedIn" },
];

function MagneticSocialLink({
  icon,
  href,
  label,
}: HeroSocial) {
  const magneticRef = useMagnetic<HTMLAnchorElement>({ strength: 0.3 });
  const Icon = ICON_MAP[icon] || Github;

  return (
    <a
      ref={magneticRef}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex h-11 w-11 items-center justify-center rounded-full border border-border text-muted-foreground transition-all duration-300 hover:border-primary hover:bg-primary/10 hover:text-primary hover:shadow-[0_0_15px_rgba(255,107,43,0.2)]"
      aria-label={label}
      data-cursor-scale
      data-hero-social
    >
      <Icon className="h-5 w-5" />
    </a>
  );
}

export function HeroSocials({ socials }: { socials?: HeroSocial[] }) {
  const data = socials?.length ? socials : DEFAULT_SOCIALS;

  return (
    <div className="flex items-center gap-3">
      {data.map((link) => (
        <MagneticSocialLink key={link.label} {...link} />
      ))}
    </div>
  );
}
