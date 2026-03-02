import { ArrowUpRight } from "lucide-react";
import { useMagnetic } from "@/hooks/useMagnetic";

export function HeroCTA() {
  const magneticRef = useMagnetic<HTMLDivElement>({ strength: 0.35 });

  const handleClick = () => {
    document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div ref={magneticRef} data-hero-cta>
      <button
        onClick={handleClick}
        className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-primary px-8 py-4 text-sm font-medium uppercase tracking-wider text-primary-foreground transition-all duration-500 hover:gap-4"
        data-cursor-scale
      >
        <span className="absolute inset-0 -translate-x-full rounded-full bg-foreground transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:translate-x-0" />
        <span className="relative z-10 transition-colors duration-500 group-hover:text-background">
          Let's Talk
        </span>
        <ArrowUpRight className="relative z-10 h-4 w-4 transition-all duration-500 group-hover:rotate-45 group-hover:text-background" />
      </button>
    </div>
  );
}
