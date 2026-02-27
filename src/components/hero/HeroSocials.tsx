import { Github, Linkedin, Mail } from "lucide-react";
import { useMagnetic } from "@/hooks/useMagnetic";

const SOCIAL_LINKS = [
  { icon: Github, href: "https://github.com", label: "GitHub" },
  { icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn" },
  { icon: Mail, href: "mailto:hello@aahad.dev", label: "Email" },
];

function MagneticSocialLink({
  icon: Icon,
  href,
  label,
}: {
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  label: string;
}) {
  const magneticRef = useMagnetic<HTMLAnchorElement>({ strength: 0.3 });

  return (
    <a
      ref={magneticRef}
      href={href}
      target={href.startsWith("mailto:") ? undefined : "_blank"}
      rel={href.startsWith("mailto:") ? undefined : "noopener noreferrer"}
      className="flex h-11 w-11 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors duration-300 hover:border-foreground hover:text-foreground"
      aria-label={label}
      data-cursor-scale
      data-hero-social
    >
      <Icon className="h-5 w-5" />
    </a>
  );
}

export function HeroSocials() {
  return (
    <div className="flex items-center gap-3">
      {SOCIAL_LINKS.map((link) => (
        <MagneticSocialLink key={link.label} {...link} />
      ))}
    </div>
  );
}
