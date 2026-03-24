import { Code, Palette, Zap, Server, Cloud, Smartphone } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface HighlightItem {
  text: string;
  bgColor?: string;
}

const ICON_MAP: Record<string, LucideIcon> = {
  "Full Stack Development": Code,
  "UI/UX Design": Palette,
  "Performance Optimization": Zap,
  "API Architecture": Server,
  "Cloud & DevOps": Cloud,
  "Responsive Design": Smartphone,
};

const DEFAULT_HIGHLIGHTS: HighlightItem[] = [
  { text: "Full Stack Development" },
  { text: "UI/UX Design" },
  { text: "Performance Optimization" },
  { text: "API Architecture" },
  { text: "Cloud & DevOps" },
  { text: "Responsive Design" },
];

export function AboutHighlights({ highlights }: { highlights?: HighlightItem[] }) {
  const data = highlights?.length ? highlights : DEFAULT_HIGHLIGHTS;

  return (
    <div className="flex flex-wrap gap-3">
      {data.map(({ text }) => {
        const Icon = ICON_MAP[text] || Code;
        return (
          <div
            key={text}
            data-about-pill
            className="inline-flex items-center gap-2.5 rounded-full border border-primary/15 bg-primary/[0.06] px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:border-primary/30 hover:bg-primary/10"
          >
            <Icon className="h-4 w-4 text-primary" />
            <span>{text}</span>
          </div>
        );
      })}
    </div>
  );
}
