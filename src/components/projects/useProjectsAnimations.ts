import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const REDUCED_MOTION = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function useProjectsAnimations() {
  const sectionRef = useRef<HTMLElement>(null);

  // ── 1. Heading entrance (fires once) ──────────────────────────
  useEffect(() => {
    const section = sectionRef.current;
    if (!section || REDUCED_MOTION()) return;

    const tl = gsap.timeline({
      paused: true,
      defaults: { ease: "power4.out", duration: 0.8 },
    });

    tl.from(section.querySelector("[data-projects-label]"), {
      y: 20, opacity: 0, duration: 0.5,
    });

    tl.from(section.querySelectorAll("[data-projects-char]"), {
      y: "110%", duration: 1, ease: "power4.out", stagger: 0.15,
    }, "-=0.3");

    const trigger = ScrollTrigger.create({
      trigger: section,
      start: "top 75%",
      once: true,
      onEnter: () => tl.play(),
    });

    return () => { trigger.kill(); tl.kill(); };
  }, []);

  // ── 2. Cards staggered entrance — each card animates in individually ──
  useEffect(() => {
    const section = sectionRef.current;
    if (!section || REDUCED_MOTION()) return;

    const items = section.querySelectorAll("[data-project-item]");
    if (!items.length) return;

    // Initial state: cards are invisible and shifted down + slightly scaled
    gsap.set(items, { y: 100, opacity: 0, scale: 0.95 });

    // Each card triggers its own entrance when it enters the viewport
    items.forEach((item, i) => {
      ScrollTrigger.create({
        trigger: item,
        start: "top 85%",
        once: true,
        onEnter: () => {
          gsap.to(item, {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 1,
            delay: (i % 2) * 0.15, // stagger left/right columns
            ease: "power3.out",
          });
        },
      });
    });

    return () => ScrollTrigger.getAll().forEach((t) => t.kill());
  }, []);

  // ── 3. Heading parallax drift ─────────────────────────────────
  useEffect(() => {
    const section = sectionRef.current;
    if (!section || REDUCED_MOTION()) return;

    const chars = section.querySelectorAll("[data-projects-char]");
    if (!chars.length) return;

    const trigger = ScrollTrigger.create({
      trigger: section,
      start: "top bottom",
      end: "bottom top",
      scrub: 2,
      onUpdate: (self) => {
        gsap.set(chars, { x: (self.progress - 0.5) * -30 });
      },
    });

    return () => trigger.kill();
  }, []);

  return sectionRef;
}
