import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const REDUCED_MOTION = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function useExperienceAnimations() {
  const sectionRef = useRef<HTMLElement>(null);

  // ── 1. Heading entrance (fires once) ─────────────────────────
  useEffect(() => {
    const section = sectionRef.current;
    if (!section || REDUCED_MOTION()) return;

    const tl = gsap.timeline({
      paused: true,
      defaults: { ease: "power4.out", duration: 0.8 },
    });

    tl.from(section.querySelector("[data-experience-label]"), {
      y: 20, opacity: 0, duration: 0.5,
    });

    tl.from(section.querySelectorAll("[data-experience-char]"), {
      y: "110%", duration: 1, ease: "power4.out", stagger: 0.12,
    }, "-=0.3");

    const trigger = ScrollTrigger.create({
      trigger: section,
      start: "top 75%",
      once: true,
      onEnter: () => tl.play(),
    });

    return () => { trigger.kill(); tl.kill(); };
  }, []);

  // ── 2. List items staggered entrance (single trigger, like projects) ──
  useEffect(() => {
    const section = sectionRef.current;
    if (!section || REDUCED_MOTION()) return;

    const items = section.querySelectorAll("[data-exp-item]");
    if (!items.length) return;

    gsap.set(items, { y: 80, opacity: 0 });

    const trigger = ScrollTrigger.create({
      trigger: section.querySelector("[data-exp-list]"),
      start: "top 70%",
      once: true,
      onEnter: () => {
        gsap.to(items, {
          y: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.12,
          ease: "power4.out",
        });
      },
    });

    return () => trigger.kill();
  }, []);

  // ── 3. Heading parallax drift ───────────────────────────────
  useEffect(() => {
    const section = sectionRef.current;
    if (!section || REDUCED_MOTION()) return;

    const chars = section.querySelectorAll("[data-experience-char]");
    if (!chars.length) return;

    const trigger = ScrollTrigger.create({
      trigger: section,
      start: "top bottom",
      end: "bottom top",
      scrub: 2,
      onUpdate: (self) => {
        gsap.set(chars, { x: self.progress * -30 });
      },
    });

    return () => trigger.kill();
  }, []);

  return sectionRef;
}
