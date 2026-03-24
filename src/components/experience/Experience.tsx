import { useEffect, useRef, useState } from "react";
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
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 1024);
  }, []);

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

      {/* Mobile: stacked cards | Desktop: cinematic scroll */}
      <div className="relative z-10 mt-10">
        {isMobile ? (
          <MobileExperience experiences={experiences} />
        ) : (
          <DesktopCinematic experiences={experiences} />
        )}
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MOBILE: Simple stacked cards with scroll-triggered entrance
   ═══════════════════════════════════════════════════════════════ */

function MobileExperience({ experiences }: { experiences: ExperienceItemProps[] }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const cards = container.querySelectorAll<HTMLElement>("[data-exp-mobile-card]");
    gsap.set(cards, { y: 40, opacity: 0 });

    const batch = ScrollTrigger.batch(cards, {
      start: "top 85%",
      once: true,
      onEnter: (batch) => {
        gsap.to(batch, {
          y: 0, opacity: 1, duration: 0.8, stagger: 0.15,
          ease: "power3.out", force3D: true,
        });
      },
    });

    return () => {
      if (Array.isArray(batch)) batch.forEach((t) => t.kill());
    };
  }, [experiences]);

  return (
    <div ref={containerRef} className="mx-auto max-w-7xl space-y-6 px-6 pb-24">
      {experiences.map((exp, i) => (
        <div
          key={exp.companyName}
          data-exp-mobile-card
          data-exp-item={i}
          className="overflow-hidden rounded-2xl border border-border/20 bg-card"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border/10 px-5 py-4">
            <div className="flex items-center gap-3">
              <span className="font-heading text-2xl font-black text-primary/30">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <h3 className="font-heading text-lg font-bold text-foreground">
                  {exp.companyName}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {exp.position}
                </p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs font-semibold tracking-widest text-primary">
                {exp.year}
              </span>
              {exp.isCurrent && (
                <div className="mt-1 flex items-center justify-end gap-1">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
                  <span className="text-[10px] font-medium text-primary">Current</span>
                </div>
              )}
            </div>
          </div>

          {/* Date */}
          <div className="px-5 pt-3">
            <p className="text-xs tracking-wider text-muted-foreground/60">
              {exp.startDate} — {exp.endDate ?? "Present"}
            </p>
          </div>

          {/* Highlights */}
          <div className="space-y-3 px-5 pb-5 pt-3">
            {exp.highlights.map((h, j) => (
              <div key={j} className="flex items-start gap-3">
                <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary/50" />
                <p className="text-sm leading-relaxed text-foreground/70">
                  {h}
                </p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   DESKTOP: Cinematic scroll-through with pinned panels
   ═══════════════════════════════════════════════════════════════ */

function DesktopCinematic({ experiences }: { experiences: ExperienceItemProps[] }) {
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

    const bgs = stack.querySelectorAll<HTMLElement>("[data-exp-bg]");
    const lefts = stack.querySelectorAll<HTMLElement>("[data-exp-left]");
    const rights = stack.querySelectorAll<HTMLElement>("[data-exp-right]");

    panels.forEach((panel, i) => {
      if (i > 0) gsap.set(panel, { visibility: "hidden", force3D: true });
    });

    const perPanel = window.innerHeight * 1.5;
    const totalDistance = count * perPanel;
    const snapPoints = Array.from({ length: count }, (_, i) => i / count);

    const easeOut = (t: number) => 1 - (1 - t) * (1 - t) * (1 - t);
    const easeIn = (t: number) => t * t * t;

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

        panels.forEach((panel, i) => {
          const bg = bgs[i];
          const left = lefts[i];
          const right = rights[i];

          if (i === activeIndex) {
            if (localP <= 0.55) {
              const bgScale = 1 + localP * 0.03;
              gsap.set(panel, { visibility: "visible", zIndex: 2, force3D: true });
              if (left) gsap.set(left, { opacity: 1, x: 0, y: 0, scale: 1, force3D: true });
              if (right) gsap.set(right, { opacity: 1, x: 0, y: 0, scale: 1, force3D: true });
              if (bg) gsap.set(bg, { scale: bgScale, opacity: 1, rotate: 0, force3D: true });
            } else if (localP <= 0.72 && i < count - 1) {
              const exitP = easeIn((localP - 0.55) / 0.17);
              gsap.set(panel, { visibility: "visible", zIndex: 2, force3D: true });
              if (left) gsap.set(left, { opacity: 1 - exitP, x: -100 * exitP, y: -50 * exitP, scale: 1 - exitP * 0.08, force3D: true });
              if (right) gsap.set(right, { opacity: 1 - exitP, x: 70 * exitP, y: 30 * exitP, scale: 1 - exitP * 0.04, force3D: true });
              if (bg) gsap.set(bg, { scale: 1.02 + exitP * 0.15, opacity: 1 - exitP, rotate: exitP * -1.5, force3D: true });
            } else if (i < count - 1) {
              gsap.set(panel, { visibility: "hidden", zIndex: 0, force3D: true });
            } else {
              gsap.set(panel, { visibility: "visible", zIndex: 2, force3D: true });
              if (left) gsap.set(left, { opacity: 1, x: 0, y: 0, scale: 1, force3D: true });
              if (right) gsap.set(right, { opacity: 1, x: 0, y: 0, scale: 1, force3D: true });
              if (bg) gsap.set(bg, { scale: 1, opacity: 1, rotate: 0, force3D: true });
            }
          } else if (i === activeIndex + 1) {
            const enterRaw = localP > 0.72 ? Math.min((localP - 0.72) / 0.23, 1) : 0;
            const enterP = easeOut(enterRaw);
            gsap.set(panel, { visibility: enterRaw > 0 ? "visible" : "hidden", zIndex: enterRaw > 0 ? 2 : 0, force3D: true });
            if (left) gsap.set(left, { opacity: enterP, x: 60 * (1 - enterP), y: 30 * (1 - enterP), scale: 0.95 + 0.05 * enterP, force3D: true });
            if (right) gsap.set(right, { opacity: enterP, x: -50 * (1 - enterP), y: -20 * (1 - enterP), scale: 0.92 + 0.08 * enterP, force3D: true });
            if (bg) gsap.set(bg, { scale: 0.92 + 0.08 * enterP, opacity: enterP, rotate: 2 * (1 - enterP), force3D: true });
          } else {
            gsap.set(panel, { visibility: "hidden", zIndex: 0, force3D: true });
          }
        });
      },
    });

    return () => trigger.kill();
  }, [experiences]);

  return (
    <div ref={wrapperRef}>
      <div ref={stackRef} className="relative min-h-screen">
        {experiences.map((exp, i) => (
          <div
            key={exp.companyName}
            data-exp-panel
            data-exp-item={i}
            className="absolute inset-0 flex min-h-screen items-center overflow-hidden bg-background"
          >
            {/* Giant background company name */}
            <div data-exp-bg className="pointer-events-none absolute inset-0 flex items-center justify-center select-none">
              <span className="whitespace-nowrap font-heading text-[14vw] font-black uppercase leading-none text-foreground/[0.03]">
                {exp.companyName}
              </span>
            </div>

            {/* Content — split layout */}
            <div data-exp-content className="relative z-10 mx-auto flex w-full max-w-7xl flex-row items-start gap-20 px-10">
              {/* Left — company info */}
              <div data-exp-left className="flex flex-col gap-5 w-2/5">
                <div className="flex items-center gap-4">
                  <span className="font-heading text-6xl font-black text-primary/20">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="h-px flex-1 bg-primary/20" />
                  <span className="font-heading text-sm font-semibold tracking-widest text-primary">
                    {exp.year}
                  </span>
                </div>

                <h3 className="font-heading text-7xl font-bold text-foreground">
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
              <div data-exp-right className="w-3/5">
                <div className="rounded-2xl border border-border/20 bg-card/80 p-10">
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
                        <p className="text-lg leading-relaxed text-foreground/80">
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
  );
}
