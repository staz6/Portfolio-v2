import { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import type { ExperienceProps as ExperienceItemProps } from "@/sanity/lib/mappers";

export function CurrentCinematic({ experiences }: { experiences: ExperienceItemProps[] }) {
  const [active, setActive] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const slidesRef = useRef<HTMLDivElement>(null);
  const animating = useRef(false);
  const total = experiences.length;

  const goTo = useCallback(
    (index: number) => {
      if (index < 0 || index >= total || index === active || animating.current) return;
      animating.current = true;

      const slides = slidesRef.current;
      if (!slides) return;

      const goingDown = index > active;
      const currentSlide = slides.children[active] as HTMLElement;
      const nextSlide = slides.children[index] as HTMLElement;

      // Prepare next slide
      gsap.set(nextSlide, {
        visibility: "visible",
        y: goingDown ? "100%" : "-100%",
        opacity: 1,
        zIndex: 2,
      });

      const tl = gsap.timeline({
        defaults: { duration: 0.7, ease: "power3.inOut", force3D: true },
        onComplete: () => {
          gsap.set(currentSlide, { visibility: "hidden", zIndex: 0 });
          setActive(index);
          animating.current = false;
        },
      });

      // Slide out current
      tl.to(currentSlide, {
        y: goingDown ? "-100%" : "100%",
        zIndex: 1,
      }, 0);

      // Slide in next
      tl.to(nextSlide, { y: "0%", zIndex: 2 }, 0);
    },
    [active, total],
  );

  // Wheel / touch navigation
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let touchStartY = 0;

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (animating.current) return;
      if (Math.abs(e.deltaY) < 30) return;
      if (e.deltaY > 0) goTo(active + 1);
      else goTo(active - 1);
    };

    const onTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };

    const onTouchEnd = (e: TouchEvent) => {
      if (animating.current) return;
      const diff = touchStartY - e.changedTouches[0].clientY;
      if (Math.abs(diff) < 50) return;
      if (diff > 0) goTo(active + 1);
      else goTo(active - 1);
    };

    container.addEventListener("wheel", onWheel, { passive: false });
    container.addEventListener("touchstart", onTouchStart, { passive: true });
    container.addEventListener("touchend", onTouchEnd, { passive: true });

    return () => {
      container.removeEventListener("wheel", onWheel);
      container.removeEventListener("touchstart", onTouchStart);
      container.removeEventListener("touchend", onTouchEnd);
    };
  }, [active, goTo]);

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") goTo(active + 1);
      else if (e.key === "ArrowUp") goTo(active - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, goTo]);

  // Init: show first slide, hide rest
  useEffect(() => {
    const slides = slidesRef.current;
    if (!slides) return;
    Array.from(slides.children).forEach((child, i) => {
      const el = child as HTMLElement;
      if (i === 0) {
        gsap.set(el, { visibility: "visible", y: "0%", zIndex: 2 });
      } else {
        gsap.set(el, { visibility: "hidden", y: "100%", zIndex: 0 });
      }
    });
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative mx-auto h-[85vh] max-w-7xl overflow-hidden rounded-3xl border border-border/10 bg-card/30"
    >
      {/* Slides */}
      <div ref={slidesRef} className="relative h-full w-full">
        {experiences.map((exp, i) => (
          <div
            key={exp.companyName}
            className="absolute inset-0 flex flex-col items-center justify-center px-6 lg:flex-row lg:items-center lg:gap-16 lg:px-16"
          >
            {/* Giant background text */}
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center select-none overflow-hidden">
              <span className="whitespace-nowrap font-heading text-[12vw] font-black uppercase leading-none text-foreground/[0.02]">
                {exp.companyName}
              </span>
            </div>

            {/* Left — company info */}
            <div className="relative z-10 mb-8 w-full lg:mb-0 lg:w-2/5">
              <div className="flex items-center gap-4">
                <span className="font-heading text-5xl font-black text-primary/20 lg:text-6xl">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="h-px flex-1 bg-primary/20" />
                <span className="font-heading text-sm font-semibold tracking-widest text-primary">
                  {exp.year}
                </span>
              </div>

              <h3 className="mt-4 font-heading text-4xl font-bold text-foreground lg:text-6xl">
                {exp.companyName}
              </h3>

              <div className="mt-4 flex flex-wrap items-center gap-3">
                <span className="text-sm font-medium uppercase tracking-widest text-muted-foreground lg:text-base">
                  {exp.position}
                </span>
                {exp.isCurrent && (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
                    Current
                  </span>
                )}
              </div>

              <p className="mt-2 text-sm tracking-wider text-muted-foreground/60">
                {exp.startDate} — {exp.endDate ?? "Present"}
              </p>
            </div>

            {/* Right — highlights */}
            <div className="relative z-10 w-full lg:w-3/5">
              <div className="rounded-2xl border border-border/20 bg-card/80 p-6 backdrop-blur-sm lg:p-10">
                <p className="mb-5 text-xs font-semibold uppercase tracking-[0.3em] text-primary">
                  Key Contributions
                </p>
                <div className="space-y-4 lg:space-y-5">
                  {exp.highlights.map((h, j) => (
                    <div key={j} className="flex items-start gap-4">
                      <div className="mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border border-primary/20 bg-primary/10 lg:h-7 lg:w-7">
                        <span className="font-heading text-[10px] font-bold text-primary lg:text-xs">
                          {String(j + 1).padStart(2, "0")}
                        </span>
                      </div>
                      <p className="text-sm leading-relaxed text-foreground/80 lg:text-lg">
                        {h}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Vertical navigation dots */}
      <div className="absolute right-4 top-1/2 z-30 flex -translate-y-1/2 flex-col gap-3 lg:right-6">
        {experiences.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className="group relative flex h-8 items-center justify-end"
          >
            {/* Label on hover */}
            <span className="mr-4 whitespace-nowrap rounded-full bg-card/90 px-3 py-1 text-xs font-medium text-foreground opacity-0 shadow-lg backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100">
              {experiences[i].companyName}
            </span>
            {/* Dot */}
            <div
              className={`h-2.5 w-2.5 rounded-full transition-all duration-500 ${
                active === i
                  ? "scale-125 bg-primary shadow-[0_0_10px_rgba(167,139,250,0.5)]"
                  : "bg-muted-foreground/30 hover:bg-muted-foreground/60"
              }`}
            />
          </button>
        ))}
      </div>

      {/* Bottom progress bar */}
      <div className="absolute bottom-0 left-0 right-0 z-30 h-0.5 bg-border/10">
        <div
          className="h-full bg-primary transition-all duration-700 ease-out"
          style={{ width: `${((active + 1) / total) * 100}%` }}
        />
      </div>

      {/* Counter */}
      <div className="absolute bottom-6 left-6 z-30 font-mono text-sm text-muted-foreground/50 lg:bottom-8 lg:left-10">
        <span className="text-lg font-bold text-primary">{String(active + 1).padStart(2, "0")}</span>
        <span className="mx-1">/</span>
        <span>{String(total).padStart(2, "0")}</span>
      </div>

      {/* Up/Down arrows */}
      <div className="absolute bottom-6 right-4 z-30 flex gap-2 lg:bottom-8 lg:right-6">
        <button
          onClick={() => goTo(active - 1)}
          disabled={active === 0}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-border/20 bg-card/50 text-foreground/60 backdrop-blur-sm transition-all hover:border-primary/30 hover:text-primary disabled:opacity-30"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 15l-6-6-6 6" />
          </svg>
        </button>
        <button
          onClick={() => goTo(active + 1)}
          disabled={active === total - 1}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-border/20 bg-card/50 text-foreground/60 backdrop-blur-sm transition-all hover:border-primary/30 hover:text-primary disabled:opacity-30"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 9l6 6 6-6" />
          </svg>
        </button>
      </div>
    </div>
  );
}
