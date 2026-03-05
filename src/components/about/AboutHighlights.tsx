import { Code, Palette, Zap, Server, Cloud, Smartphone } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface Highlight {
  text: string;
  icon: LucideIcon;
}

const HIGHLIGHTS: Highlight[] = [
  { text: "Full Stack Development", icon: Code },
  { text: "UI/UX Design", icon: Palette },
  { text: "Performance Optimization", icon: Zap },
  { text: "API Architecture", icon: Server },
  { text: "Cloud & DevOps", icon: Cloud },
  { text: "Responsive Design", icon: Smartphone },
];

export function AboutHighlights() {
  return (
    <div className="flex flex-wrap gap-3">
      {HIGHLIGHTS.map(({ text, icon: Icon }) => (
        <div
          key={text}
          data-about-pill
          className="inline-flex items-center gap-2.5 rounded-full border border-primary/15 bg-primary/[0.06] px-5 py-2.5 text-sm font-medium text-foreground backdrop-blur-sm transition-colors hover:border-primary/30 hover:bg-primary/10"
        >
          <Icon className="h-4 w-4 text-primary" />
          <span>{text}</span>
        </div>
      ))}
    </div>
  );
}
