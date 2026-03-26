import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { ExperienceProps } from "@/sanity/lib/mappers";

gsap.registerPlugin(ScrollTrigger);

export function Timeline3D({ experiences }: { experiences: ExperienceProps[] }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const items = container.querySelectorAll<HTMLElement>("[data-tl-item]");
    const line = container.querySelector<HTMLElement>("[data-tl-line]");
    const dots = container.querySelectorAll<HTMLElement>("[data-tl-dot]");

    if (line) {
      ScrollTrigger.create({
        trigger: container,
        start: "top 80%",
        end: "bottom 30%",
        scrub: 1,
        onUpdate: (self) => {
          line.style.transform = `scaleY(${self.progress})`;
        },
      });
    }

    items.forEach((item, i) => {
      const isLeft = i % 2 === 0;

      gsap.set(item, {
        opacity: 0,
        y: 60,
        x: isLeft ? -40 : 40,
        scale: 0.95,
        force3D: true,
      });

      ScrollTrigger.create({
        trigger: item,
        start: "top 85%",
        end: "top 20%",
        toggleActions: "play reverse play reverse",
        onEnter: () => {
          gsap.to(item, {
            opacity: 1, y: 0, x: 0, scale: 1,
            duration: 0.8, ease: "power3.out",
          });
        },
        onLeaveBack: () => {
          gsap.to(item, {
            opacity: 0, y: 60, x: isLeft ? -40 : 40, scale: 0.95,
            duration: 0.5, ease: "power2.in",
          });
        },
      });
    });

    dots.forEach((dot) => {
      gsap.set(dot, { scale: 0, opacity: 0 });

      ScrollTrigger.create({
        trigger: dot,
        start: "top 85%",
        end: "top 20%",
        toggleActions: "play reverse play reverse",
        onEnter: () => gsap.to(dot, { scale: 1, opacity: 1, duration: 0.4, ease: "back.out(2)" }),
        onLeaveBack: () => gsap.to(dot, { scale: 0, opacity: 0, duration: 0.3 }),
        onLeave: () => gsap.to(dot, { scale: 0.5, opacity: 0.3, duration: 0.3 }),
        onEnterBack: () => gsap.to(dot, { scale: 1, opacity: 1, duration: 0.3, ease: "back.out(2)" }),
      });
    });

    return () => ScrollTrigger.getAll().forEach((t) => t.kill());
  }, [experiences]);

  return (
    <div ref={containerRef} className="relative mx-auto max-w-5xl px-6 pb-24">
      {/* Vertical glowing line */}
      <div className="absolute left-6 top-0 bottom-0 w-px lg:left-1/2 lg:-translate-x-1/2">
        <div className="h-full w-0.5 bg-gradient-to-b from-transparent via-primary/20 to-transparent" />
        <div
          data-tl-line
          className="absolute inset-0 w-0.5 origin-top bg-gradient-to-b from-primary via-primary/50 to-transparent"
          style={{ transform: "scaleY(0)" }}
        />
      </div>

      <div className="flex flex-col gap-28">
        {experiences.map((exp, i) => {
          const isLeft = i % 2 === 0;

          return (
            <div key={exp.companyName} className="relative">
              {/* Glow dot on timeline */}
              <div
                data-tl-dot
                className="absolute left-6 top-10 z-20 -translate-x-1/2 lg:left-1/2"
              >
                <div className="h-3 w-3 rounded-full bg-primary shadow-[0_0_12px_rgba(167,139,250,0.6)]" />
              </div>

              {/* Card */}
              <div
                data-tl-item
                className={`ml-14 lg:ml-0 lg:w-[calc(50%-2.5rem)] ${isLeft ? "lg:mr-auto lg:pr-10" : "lg:ml-auto lg:pl-10"}`}
              >
                <div className="group relative">
                  {/* Year badge */}
                  <div className="absolute -top-4 right-8 z-10 rounded-full border border-primary/30 bg-background px-4 py-1 font-mono text-sm text-primary shadow-lg">
                    {exp.year}
                  </div>

                  {/* Main card */}
                  <div className="rounded-3xl border border-primary/20 bg-card/90 p-8 shadow-2xl backdrop-blur-xl transition-all duration-500 hover:-translate-y-2 hover:border-primary/40 hover:shadow-primary/20">
                    {/* Header */}
                    <div className="mb-6 flex items-center gap-4">
                      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-blue-600 text-xl font-bold text-white">
                        {String(i + 1).padStart(2, "0")}
                      </div>
                      <div>
                        <h3 className="text-2xl font-semibold text-foreground">{exp.companyName}</h3>
                        <p className="font-medium text-primary">{exp.position}</p>
                      </div>
                    </div>

                    {/* Date */}
                    <p className="mb-6 text-sm text-muted-foreground">
                      {exp.startDate} — {exp.endDate ?? "Present"}
                    </p>

                    {/* Highlights */}
                    <ul className="space-y-5">
                      {exp.highlights.map((h, j) => (
                        <li key={j} className="flex gap-4 text-[15px] text-foreground/70">
                          <span className="mt-1 flex-shrink-0 font-mono text-sm text-primary">
                            {String(j + 1).padStart(2, "0")}
                          </span>
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>

                    {/* Current badge */}
                    {exp.isCurrent && (
                      <div className="mt-5 flex items-center gap-2">
                        <span className="h-2 w-2 animate-pulse rounded-full bg-primary" />
                        <span className="text-xs font-medium text-primary">Currently working here</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
