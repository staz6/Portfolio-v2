import { useRef } from "react";
import gsap from "gsap";
import { useAfterPreloader } from "@/hooks/useAfterPreloader";
import type { HeroStat } from "@/sanity/lib/mappers";

const DEFAULT_STATS: HeroStat[] = [
  { value: 3, suffix: "+", label: "Years Experience" },
  { value: 50, suffix: "+", label: "Projects Completed" },
  { value: 30, suffix: "+", label: "Happy Clients" },
];

export function HeroStats({ stats }: { stats?: HeroStat[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const data = stats?.length ? stats : DEFAULT_STATS;

  useAfterPreloader(() => {
    const container = containerRef.current;
    if (!container) return;

    container.querySelectorAll("[data-hero-stat-number]").forEach((el) => {
      const target = parseInt(el.getAttribute("data-target") || "0", 10);
      const obj = { value: 0 };
      gsap.to(obj, {
        value: target,
        duration: 2,
        ease: "power2.out",
        onUpdate: () => {
          el.textContent = Math.round(obj.value).toString();
        },
      });
    });
  }, 2500);

  return (
    <div ref={containerRef} className="flex gap-2 md:gap-6">
      {data.map((stat) => (
        <div
          key={stat.label}
          data-hero-stat
          className="flex flex-1 flex-col rounded-xl border border-primary/10 bg-primary/[0.04] px-3 py-3 backdrop-blur-sm md:px-5 md:py-4"
        >
          <div className="flex items-baseline gap-0.5">
            <span
              data-hero-stat-number
              data-target={stat.value}
              className="font-heading text-2xl font-bold text-primary sm:text-3xl md:text-5xl"
            >
              0
            </span>
            <span className="font-heading text-lg font-bold text-primary sm:text-xl md:text-3xl">
              {stat.suffix}
            </span>
          </div>
          <span className="mt-1 text-[10px] font-medium uppercase tracking-wider text-muted-foreground sm:text-xs md:text-sm md:tracking-widest">
            {stat.label}
          </span>
        </div>
      ))}
    </div>
  );
}
