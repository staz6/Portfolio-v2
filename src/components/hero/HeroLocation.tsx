import { Globe } from "lucide-react";
import { useMagnetic } from "@/hooks/useMagnetic";

export function HeroLocation() {
  const magneticRef = useMagnetic<HTMLDivElement>({ strength: 0.25 });

  return (
    <div ref={magneticRef} data-hero-location>
      <div className="inline-flex items-center gap-4 rounded-full bg-foreground py-2 pl-7 pr-2">
        <span className="font-heading text-sm font-medium leading-snug text-background md:text-base">
          Located in
          <br />
          Karachi, Pakistan
        </span>
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-background/20">
          <Globe className="h-5 w-5 text-background" />
        </div>
      </div>
    </div>
  );
}
