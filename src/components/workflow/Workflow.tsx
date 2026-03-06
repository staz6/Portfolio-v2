import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const STEPS = [
  {
    number: "01",
    title: "Discovery",
    description:
      "Understanding your vision, goals, and target audience to build a solid foundation.",
  },
  {
    number: "02",
    title: "Strategy",
    description:
      "Planning the architecture, user experience, and technical approach for scalability.",
  },
  {
    number: "03",
    title: "Build",
    description:
      "Crafting pixel-perfect designs and robust code with modern technologies.",
  },
  {
    number: "04",
    title: "Launch",
    description:
      "Testing, optimizing, and deploying your digital product to the world.",
  },
];

export function Workflow() {
  const sectionRef = useRef<HTMLElement>(null);

  // ── Heading entrance ──────────────────────────────────────────
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const tl = gsap.timeline({
      paused: true,
      defaults: { ease: "power4.out", duration: 0.8 },
    });

    tl.from(section.querySelector("[data-workflow-label]"), {
      y: 20, opacity: 0, duration: 0.5,
    });

    tl.from(section.querySelectorAll("[data-workflow-char]"), {
      y: "110%", duration: 1, ease: "power4.out", stagger: 0.12,
    }, "-=0.3");

    const trigger = ScrollTrigger.create({
      trigger: section,
      start: "top 70%",
      once: true,
      onEnter: () => tl.play(),
    });

    return () => { trigger.kill(); tl.kill(); };
  }, []);

  // ── Scroll-driven progress line + step reveal ─────────────────
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const grid = section.querySelector("[data-workflow-grid]") as HTMLElement;
    const progressH = section.querySelector("[data-workflow-progress-h]") as HTMLElement;
    const progressV = section.querySelector("[data-workflow-progress-v]") as HTMLElement;
    const steps = section.querySelectorAll<HTMLElement>("[data-workflow-step]");
    const dots = section.querySelectorAll<HTMLElement>("[data-workflow-dot]");
    if (!grid || !steps.length) return;

    // Start steps dimmed
    gsap.set(steps, { opacity: 0.2 });
    gsap.set(dots, { backgroundColor: "transparent" });

    const trigger = ScrollTrigger.create({
      trigger: grid,
      start: "top 75%",
      end: "bottom 50%",
      scrub: 0.5,
      onUpdate: (self) => {
        const progress = self.progress;

        // Grow the progress line (horizontal on desktop, vertical on mobile)
        if (progressH) gsap.set(progressH, { scaleX: progress });
        if (progressV) gsap.set(progressV, { scaleY: progress });

        // Light up steps as progress reaches them
        steps.forEach((step, i) => {
          const stepThreshold = i / (STEPS.length - 1);
          const isActive = progress >= stepThreshold - 0.05;
          gsap.to(step, {
            opacity: isActive ? 1 : 0.2,
            duration: 0.3,
            overwrite: true,
          });
          // Fill the dot
          if (dots[i]) {
            gsap.to(dots[i], {
              scale: isActive ? 1 : 0,
              duration: 0.3,
              overwrite: true,
            });
          }
        });
      },
    });

    return () => trigger.kill();
  }, []);

  const headingWords = ["How", "We", "Work"];

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-secondary py-24 lg:py-40"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        {/* Label */}
        <div data-workflow-label className="flex items-center gap-4">
          <span className="font-heading text-sm font-semibold tracking-widest text-primary">
            03
          </span>
          <span className="h-px w-12 bg-primary/40" />
          <span className="text-sm font-medium uppercase tracking-widest text-muted-foreground">
            Workflow
          </span>
        </div>

        {/* Heading */}
        <h2 className="mt-6 font-heading text-5xl font-bold leading-[0.95] tracking-tight md:text-6xl lg:text-8xl">
          {headingWords.map((word, i) => (
            <span key={i} className="inline-block overflow-hidden mr-[0.3em] last:mr-0">
              <span
                className="inline-block will-change-transform"
                data-workflow-char
              >
                {word}
              </span>
            </span>
          ))}
        </h2>

        {/* Steps grid with progress line */}
        <div data-workflow-grid className="relative mt-20 lg:mt-28">
          {/* Horizontal progress line (desktop) */}
          <div className="absolute left-0 right-0 top-[26px] hidden h-[2px] rounded-full bg-border/30 lg:block">
            <div
              data-workflow-progress-fill
              data-workflow-progress-h
              className="h-full w-full origin-left bg-foreground"
              style={{ transform: "scaleX(0)" }}
            />
          </div>

          {/* Vertical progress line (mobile/tablet) */}
          <div className="absolute bottom-0 left-[7px] top-[26px] w-[2px] rounded-full bg-border/30 lg:hidden">
            <div
              data-workflow-progress-fill
              data-workflow-progress-v
              className="h-full w-full origin-top bg-foreground"
              style={{ transform: "scaleY(0)" }}
            />
          </div>

          <div className="grid grid-cols-1 gap-10 pl-10 sm:grid-cols-2 sm:pl-0 lg:grid-cols-4 lg:gap-8">
            {STEPS.map((step, i) => (
              <div
                key={step.number}
                data-workflow-step
                className="relative pt-16 lg:pt-20"
              >
                {/* Circle dot on the progress line */}
                <div className="absolute left-0 top-[19px] flex h-4 w-4 items-center justify-center rounded-full border-2 border-foreground/30 bg-secondary sm:left-0 max-sm:-left-10">
                  <div
                    data-workflow-dot
                    className="h-2 w-2 rounded-full bg-foreground"
                    style={{ transform: "scale(0)" }}
                  />
                </div>

                {/* Ghost number */}
                <span className="font-heading text-6xl font-bold text-muted-foreground/15 lg:text-7xl">
                  {step.number}
                </span>

                {/* Title */}
                <h3 className="mt-2 font-heading text-xl font-bold text-foreground lg:text-2xl">
                  {step.title}
                </h3>

                {/* Description */}
                <p className="mt-3 max-w-[280px] text-sm leading-relaxed text-muted-foreground lg:text-base">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
