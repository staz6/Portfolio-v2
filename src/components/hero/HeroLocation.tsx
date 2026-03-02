import { Globe } from "lucide-react";
import { useMagnetic } from "@/hooks/useMagnetic";

export function HeroLocation() {
  const magneticRef = useMagnetic<HTMLDivElement>({ strength: 0.25 });

  return (
    <div ref={magneticRef} data-hero-location>
      <div className="inline-flex items-center gap-4 rounded-full border border-primary/20 bg-primary/10 py-2 pl-7 pr-2 shadow-[0_0_25px_rgba(255,107,43,0.12)] backdrop-blur-md">
        <span className="font-heading text-sm font-medium leading-snug text-foreground md:text-base">
          Located in
          <br />
          Karachi, Pakistan
        </span>
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/20">
          <Globe className="h-5 w-5 text-primary" />
        </div>
      </div>
    </div>
  );
}
