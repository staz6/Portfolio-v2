import { useState } from "react";

const VERSIONS = [
  { id: "timeline", label: "3D Timeline" },
  { id: "orbital", label: "Orbital System" },
  { id: "carousel", label: "3D Carousel" },
  { id: "cinematic", label: "Cinematic Scroll" },
] as const;

export type VersionId = (typeof VERSIONS)[number]["id"];

interface VersionSwitcherProps {
  active: VersionId;
  onChange: (id: VersionId) => void;
}

export function VersionSwitcher({ active, onChange }: VersionSwitcherProps) {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <div className="fixed right-3 top-1/2 z-50 -translate-y-1/2 lg:right-5">
      <div className="flex flex-col items-center gap-1.5 rounded-full border border-border/20 bg-card/80 px-1 py-2 backdrop-blur-md">
        {VERSIONS.map((v, i) => {
          const isActive = active === v.id;
          const isHovered = hovered === v.id;
          return (
            <div key={v.id} className="relative">
              <button
                onClick={() => onChange(v.id)}
                onMouseEnter={() => setHovered(v.id)}
                onMouseLeave={() => setHovered(null)}
                className={`flex h-8 w-8 items-center justify-center rounded-full text-[9px] font-bold transition-all duration-300 ${
                  isActive ? "bg-primary text-primary-foreground shadow-[0_0_10px_rgba(167,139,250,0.4)]" : "text-muted-foreground hover:bg-primary/10 hover:text-foreground"
                }`}
              >
                {String(i + 1).padStart(2, "0")}
              </button>
              {(isHovered || isActive) && (
                <span className={`absolute right-full top-1/2 mr-2 -translate-y-1/2 whitespace-nowrap rounded px-2 py-0.5 text-[9px] font-medium ${
                  isActive ? "bg-primary text-primary-foreground" : "bg-card text-foreground border border-border/20"
                }`}>
                  {v.label}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
