import { useEffect, useRef } from "react";
import gsap from "gsap";

interface Stat {
  value: number;
  suffix: string;
  label: string;
}

const STATS: Stat[] = [
  { value: 3, suffix: "+", label: "Years Experience" },
  { value: 50, suffix: "+", label: "Projects Completed" },
  { value: 30, suffix: "+", label: "Happy Clients" },
];

export function HeroStats() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const numberEls = container.querySelectorAll("[data-hero-stat-number]");
    const tweens: gsap.core.Tween[] = [];

    numberEls.forEach((el) => {
      const target = parseInt(el.getAttribute("data-target") || "0", 10);
      const obj = { value: 0 };
      const tween = gsap.to(obj, {
        value: target,
        duration: 2,
        delay: 1.5,
        ease: "power2.out",
        onUpdate: () => {
          el.textContent = Math.round(obj.value).toString();
        },
      });
      tweens.push(tween);
    });

    return () => {
      tweens.forEach((t) => t.kill());
    };
  }, []);

  return (
    <div ref={containerRef} className="flex gap-8 md:gap-12">
      {STATS.map((stat) => (
        <div key={stat.label} data-hero-stat className="flex flex-col">
          <div className="flex items-baseline gap-0.5">
            <span
              data-hero-stat-number
              data-target={stat.value}
              className="font-heading text-4xl font-bold text-foreground md:text-5xl"
            >
              0
            </span>
            <span className="font-heading text-2xl font-bold text-primary md:text-3xl">
              {stat.suffix}
            </span>
          </div>
          <span className="mt-1 text-xs font-medium uppercase tracking-widest text-muted-foreground md:text-sm">
            {stat.label}
          </span>
        </div>
      ))}
    </div>
  );
}
