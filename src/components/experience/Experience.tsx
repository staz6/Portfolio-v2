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

    // Show first panel, hide rest
    panels.forEach((panel, i) => {
      if (i === 0) {
        gsap.set(panel, { visibility: "visible", zIndex: 2 });
        gsap.set(lefts[i], { opacity: 1, x: 0, y: 0, scale: 1 });
        gsap.set(rights[i], { opacity: 1, x: 0, y: 0, scale: 1 });
        gsap.set(bgs[i], { opacity: 1, scale: 1, rotation: 0 });
      } else {
        gsap.set(panel, { visibility: "hidden", zIndex: 0 });
      }
    });

    let currentIndex = 0;
    let animating = false;

    // Animate from one panel to another
    function goToPanel(index: number) {
      if (index < 0 || index >= count || index === currentIndex) return;
      animating = true;

      const goingDown = index > currentIndex;
      const fromPanel = panels[currentIndex];
      const fromBg = bgs[currentIndex] as HTMLElement | undefined;
      const fromLeft = lefts[currentIndex] as HTMLElement | undefined;
      const fromRight = rights[currentIndex] as HTMLElement | undefined;

      const toPanel = panels[index];
      const toBg = bgs[index] as HTMLElement | undefined;
      const toLeft = lefts[index] as HTMLElement | undefined;
      const toRight = rights[index] as HTMLElement | undefined;

      const tl = gsap.timeline({
        defaults: { duration: 0.7, ease: "power3.inOut", force3D: true },
        onComplete: () => {
          // Hide old panel fully
          gsap.set(fromPanel, { visibility: "hidden", zIndex: 0 });
          currentIndex = index;
          animating = false;
        },
      });

      // Show incoming panel behind outgoing
      gsap.set(toPanel, { visibility: "visible", zIndex: 1 });

      // Set incoming panel starting state
      const enterX = goingDown ? 60 : -60;
      if (toLeft) gsap.set(toLeft, { opacity: 0, x: enterX, y: goingDown ? 30 : -30, scale: 0.95 });
      if (toRight) gsap.set(toRight, { opacity: 0, x: -enterX * 0.8, y: goingDown ? -20 : 20, scale: 0.92 });
      if (toBg) gsap.set(toBg, { opacity: 0, scale: 0.92, rotation: goingDown ? 2 : -2 });

      // Exit current panel
      const exitX = goingDown ? -100 : 100;
      if (fromLeft) tl.to(fromLeft, { opacity: 0, x: exitX, y: goingDown ? -50 : 50, scale: 0.92 }, 0);
      if (fromRight) tl.to(fromRight, { opacity: 0, x: -exitX * 0.7, y: goingDown ? 30 : -30, scale: 0.96 }, 0);
      if (fromBg) tl.to(fromBg, { opacity: 0, scale: 1.15, rotation: goingDown ? -1.5 : 1.5 }, 0);

      // Enter new panel (slightly delayed for overlap)
      tl.set(toPanel, { zIndex: 2 }, 0.15);
      if (toLeft) tl.to(toLeft, { opacity: 1, x: 0, y: 0, scale: 1 }, 0.15);
      if (toRight) tl.to(toRight, { opacity: 1, x: 0, y: 0, scale: 1 }, 0.15);
      if (toBg) tl.to(toBg, { opacity: 1, scale: 1, rotation: 0 }, 0.15);
    }

    // Prevent scroll from moving during panel animation
    const preventScroll = ScrollTrigger.observe({
      preventDefault: true,
      type: "wheel,touch,scroll",
      allowClicks: true,
      onEnable: (self) => { (self as any)._savedScroll = window.scrollY; },
      onChangeY: (self) => { window.scrollTo(0, (self as any)._savedScroll); },
    });
    preventScroll.disable();

    // Observer detects scroll/swipe intent — one gesture = one panel
    // Declared before trigger so onEnter/onLeave can reference it
    let trigger: ScrollTrigger;

    const intentObserver = ScrollTrigger.observe({
      type: "wheel,touch",
      debounce: false,
      tolerance: 50,
      onUp: () => {
        if (animating) return;
        if (currentIndex > 0) {
          preventScroll.enable();
          goToPanel(currentIndex - 1);
          setTimeout(() => preventScroll.disable(), 800);
        } else {
          // First panel — exit upward to projects
          intentObserver.disable();
          window.scrollTo(0, trigger.start - 1);
        }
      },
      onDown: () => {
        if (animating) return;
        if (currentIndex < count - 1) {
          preventScroll.enable();
          goToPanel(currentIndex + 1);
          setTimeout(() => preventScroll.disable(), 800);
        } else {
          // Last panel — exit downward to reviews
          intentObserver.disable();
          window.scrollTo(0, trigger.end + 1);
        }
      },
    });
    // Start disabled — ScrollTrigger onEnter enables it
    intentObserver.disable();

    // Pin the section with ScrollTrigger (creates scroll space, no scrub)
    // anticipatePin helps Safari re-engage the pin smoothly
    // Helper to reset panels to a specific index
    function resetToPanel(idx: number) {
      currentIndex = idx;
      animating = false;
      panels.forEach((panel, i) => {
        const isTarget = i === idx;
        panel.style.visibility = isTarget ? "visible" : "hidden";
        panel.style.zIndex = isTarget ? "2" : "0";
        if (isTarget) {
          lefts[i].style.opacity = "1";
          lefts[i].style.transform = "translate3d(0,0,0) scale(1)";
          rights[i].style.opacity = "1";
          rights[i].style.transform = "translate3d(0,0,0) scale(1)";
          bgs[i].style.opacity = "1";
          bgs[i].style.transform = "scale(1) rotate(0deg)";
        }
      });
    }

    trigger = ScrollTrigger.create({
      trigger: wrapper,
      pin: stack,
      start: "top top",
      end: () => `+=${count * window.innerHeight}`,
      onEnter: () => { resetToPanel(0); intentObserver.enable(); },
      onEnterBack: () => { resetToPanel(count - 1); intentObserver.enable(); },
      onLeave: () => intentObserver.disable(),
      onLeaveBack: () => intentObserver.disable(),
    });

    return () => {
      trigger.kill();
      intentObserver.disable();
      preventScroll.disable();
    };
  }, [experiences]);

  return (
    <div ref={wrapperRef} className="overflow-hidden">
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
