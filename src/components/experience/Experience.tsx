import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ExperienceHeading } from "./ExperienceHeading";
import { useExperienceAnimations } from "./useExperienceAnimations";
import type { ExperienceProps as ExperienceItemProps } from "@/sanity/lib/mappers";

gsap.registerPlugin(ScrollTrigger);

interface ExperienceSectionProps {
  experiences?: ExperienceItemProps[];
}

export function Experience({ experiences = [] }: ExperienceSectionProps) {
  const sectionRef = useExperienceAnimations();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const stackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const stack = stackRef.current;
    if (!wrapper || !stack) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const panels = stack.querySelectorAll<HTMLElement>("[data-exp-panel]");
    const count = panels.length;
    if (!count) return;

    // Collect sub-elements for split animation
    const bgs = stack.querySelectorAll<HTMLElement>("[data-exp-bg]");
    const lefts = stack.querySelectorAll<HTMLElement>("[data-exp-left]");
    const rights = stack.querySelectorAll<HTMLElement>("[data-exp-right]");

    // Hide all panels except first
    panels.forEach((panel, i) => {
      if (i > 0) gsap.set(panel, { visibility: "hidden", force3D: true });
    });

    // 2x viewport per panel — enough room to see animations play
    const perPanel = window.innerHeight * 1.5;
    const totalDistance = count * perPanel;

    // Snap to the START of each panel (where hold phase begins)
    // Each panel occupies 1/count of total progress
    const snapPoints = Array.from({ length: count }, (_, i) => i / count);

    const trigger = ScrollTrigger.create({
      trigger: wrapper,
      start: "top top",
      end: () => `+=${totalDistance}`,
      pin: stack,
      scrub: 1,
      snap: {
        snapTo: snapPoints,
        duration: { min: 0.8, max: 1.4 },
        delay: 0.1,
        ease: "power3.inOut",
      },
      onUpdate: (self) => {
        const totalP = self.progress * count;
        const activeIndex = Math.min(Math.floor(totalP), count - 1);
        const localP = totalP - activeIndex;

        const easeOut = (t: number) => 1 - (1 - t) * (1 - t) * (1 - t);
        const easeIn = (t: number) => t * t * t;

        panels.forEach((panel, i) => {
          const bg = bgs[i];
          const left = lefts[i];
          const right = rights[i];

          if (i === activeIndex) {
            // Hold: 0–0.55 | Exit: 0.55–0.72 | Gone: 0.72–1.0

            if (localP <= 0.55) {
              // Long hold — content is readable, subtle bg drift
              const bgScale = 1 + localP * 0.03;
              gsap.set(panel, { visibility: "visible", zIndex: 2, force3D: true });
              if (left) gsap.set(left, { opacity: 1, x: 0, y: 0, scale: 1, force3D: true });
              if (right) gsap.set(right, { opacity: 1, x: 0, y: 0, scale: 1, force3D: true });
              if (bg) gsap.set(bg, { scale: bgScale, opacity: 1, rotate: 0, force3D: true });
            } else if (localP <= 0.72 && i < count - 1) {
              // Exit — dramatic split, content flies apart
              const exitP = easeIn((localP - 0.55) / 0.17);
              gsap.set(panel, { visibility: "visible", zIndex: 2, force3D: true });
              if (left) gsap.set(left, {
                opacity: 1 - exitP, x: -100 * exitP, y: -50 * exitP,
                scale: 1 - exitP * 0.08, force3D: true,
              });
              if (right) gsap.set(right, {
                opacity: 1 - exitP, x: 70 * exitP, y: 30 * exitP,
                scale: 1 - exitP * 0.04, force3D: true,
              });
              if (bg) gsap.set(bg, {
                scale: 1.02 + exitP * 0.15, opacity: 1 - exitP,
                rotate: exitP * -1.5, force3D: true,
              });
            } else if (i < count - 1) {
              // Fully gone
              gsap.set(panel, { visibility: "hidden", zIndex: 0, force3D: true });
            } else {
              // Last panel stays
              gsap.set(panel, { visibility: "visible", zIndex: 2, force3D: true });
              if (left) gsap.set(left, { opacity: 1, x: 0, y: 0, scale: 1, force3D: true });
              if (right) gsap.set(right, { opacity: 1, x: 0, y: 0, scale: 1, force3D: true });
              if (bg) gsap.set(bg, { scale: 1, opacity: 1, rotate: 0, force3D: true });
            }

          } else if (i === activeIndex + 1) {
            // Enter: 0.72–0.95 (starts immediately after exit ends)
            const enterRaw = localP > 0.72 ? Math.min((localP - 0.72) / 0.23, 1) : 0;
            const enterP = easeOut(enterRaw);

            gsap.set(panel, {
              visibility: enterRaw > 0 ? "visible" : "hidden",
              zIndex: enterRaw > 0 ? 2 : 0,
              force3D: true,
            });
            if (left) gsap.set(left, {
              opacity: enterP, x: 60 * (1 - enterP), y: 30 * (1 - enterP),
              scale: 0.95 + 0.05 * enterP, force3D: true,
            });
            if (right) gsap.set(right, {
              opacity: enterP, x: -50 * (1 - enterP), y: -20 * (1 - enterP),
              scale: 0.92 + 0.08 * enterP, force3D: true,
            });
            if (bg) gsap.set(bg, {
              scale: 0.92 + 0.08 * enterP, opacity: enterP,
              rotate: 2 * (1 - enterP), force3D: true,
            });

          } else {
            gsap.set(panel, { visibility: "hidden", zIndex: 0, force3D: true });
          }
        });
      },
    });

    return () => trigger.kill();
  }, [experiences]);

  return (
    <section
      ref={sectionRef}
      id="experience"
      className="relative overflow-hidden bg-background"
    >
      {/* Heading */}
      <div className="relative z-10 mx-auto max-w-7xl px-6 pt-24 lg:px-10 lg:pt-40">
        <ExperienceHeading />
      </div>

      {/* Experience panels — stacked, single pin */}
      <div ref={wrapperRef} className="relative z-10 mt-10">
        <div ref={stackRef} className="relative min-h-screen">
          {experiences.map((exp, i) => (
            <div
              key={exp.companyName}
              data-exp-panel
              data-exp-item={i}
              className="absolute inset-0 flex min-h-screen items-center overflow-hidden"
            >
            {/* Giant background company name */}
            <div
              data-exp-bg
              className="pointer-events-none absolute inset-0 flex items-center justify-center will-change-transform select-none"
            >
              <span className="whitespace-nowrap font-heading text-[18vw] font-black uppercase leading-none text-foreground/[0.03] md:text-[14vw]">
                {exp.companyName}
              </span>
            </div>

            {/* Content — split layout */}
            <div
              data-exp-content
              className="relative z-10 mx-auto flex w-full max-w-7xl flex-col gap-10 px-6 will-change-transform lg:flex-row lg:items-start lg:gap-20 lg:px-10"
            >
              {/* Left — company info */}
              <div data-exp-left className="flex flex-col gap-5 will-change-transform lg:w-2/5">
                <div className="flex items-center gap-4">
                  <span className="font-heading text-5xl font-black text-primary/20 lg:text-6xl">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="h-px flex-1 bg-primary/20" />
                  <span className="font-heading text-sm font-semibold tracking-widest text-primary">
                    {exp.year}
                  </span>
                </div>

                <h3 className="font-heading text-5xl font-bold text-foreground md:text-6xl lg:text-7xl">
                  {exp.companyName}
                </h3>

                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-base font-medium uppercase tracking-widest text-muted-foreground">
                    {exp.position}
                  </span>
                  {exp.isCurrent && (
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
                      Current
                    </span>
                  )}
                </div>

                <p className="text-sm tracking-wider text-muted-foreground/60">
                  {exp.startDate} — {exp.endDate ?? "Present"}
                </p>

                {i < experiences.length - 1 && (
                  <div className="mt-6 flex items-center gap-3">
                    <div className="h-px w-8 bg-gradient-to-r from-primary/40 to-transparent" />
                    <span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground/40">
                      Scroll for next
                    </span>
                  </div>
                )}
              </div>

              {/* Right — highlights card */}
              <div data-exp-right className="will-change-transform lg:w-3/5">
                <div className="rounded-2xl border border-border/20 bg-card/80 p-6 lg:p-10">
                  <p className="mb-6 text-xs font-semibold uppercase tracking-[0.3em] text-primary">
                    Key Contributions
                  </p>

                  <div className="space-y-5">
                    {exp.highlights.map((h, j) => (
                      <div key={j} className="flex items-start gap-4">
                        <div className="mt-1 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full border border-primary/20 bg-primary/10">
                          <span className="font-heading text-xs font-bold text-primary">
                            {String(j + 1).padStart(2, "0")}
                          </span>
                        </div>
                        <p className="text-base leading-relaxed text-foreground/80 lg:text-lg">
                          {h}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
          ))}
        </div>
      </div>
    </section>
  );
}
