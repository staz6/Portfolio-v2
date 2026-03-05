import { useState } from "react";
import { About } from "./About";
import { AboutV2 } from "./AboutV2";
import { AboutV3 } from "./AboutV3";
import { AboutV4 } from "./AboutV4";

const VARIANTS = [
  { key: "v1", label: "V1 — Noise Sphere", component: About },
  { key: "v2", label: "V2 — Skill Words", component: AboutV2 },
  { key: "v3", label: "V3 — Original Sphere", component: AboutV3 },
  { key: "v4", label: "V4 — Spiky Crystal", component: AboutV4 },
] as const;

export function AboutSwitcher() {
  const [active, setActive] = useState("v1");
  const ActiveComponent = VARIANTS.find((v) => v.key === active)!.component;

  return (
    <>
      {/* Floating variant switcher */}
      <div className="fixed bottom-6 left-1/2 z-[80] -translate-x-1/2">
        <div className="flex items-center gap-1 rounded-full border border-primary/20 bg-background/90 px-2 py-1.5 shadow-2xl backdrop-blur-md">
          {VARIANTS.map((v) => (
            <button
              key={v.key}
              onClick={() => setActive(v.key)}
              className={`rounded-full px-4 py-2 text-xs font-medium transition-all ${
                active === v.key
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {v.label}
            </button>
          ))}
        </div>
      </div>

      <ActiveComponent />
    </>
  );
}
