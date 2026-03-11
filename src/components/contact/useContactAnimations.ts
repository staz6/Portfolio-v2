import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const REDUCED_MOTION = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function useContactAnimations() {
  const sectionRef = useRef<HTMLElement>(null);

  // ── 1. Heading entrance ──────────────────────────────────────
  useEffect(() => {
    const section = sectionRef.current;
    if (!section || REDUCED_MOTION()) return;

    const tl = gsap.timeline({
      paused: true,
      defaults: { ease: "power4.out", duration: 0.8 },
    });

    tl.from(section.querySelector("[data-contact-label]"), {
      y: 20, opacity: 0, duration: 0.5,
    });

    tl.from(section.querySelectorAll("[data-contact-char]"), {
      y: "110%", duration: 1.2, ease: "power4.out", stagger: 0.15,
    }, "-=0.3");

    const trigger = ScrollTrigger.create({
      trigger: section,
      start: "top 75%",
      once: true,
      onEnter: () => tl.play(),
    });

    return () => { trigger.kill(); tl.kill(); };
  }, []);

  // ── 2. Content staggered entrance ────────────────────────────
  useEffect(() => {
    const section = sectionRef.current;
    if (!section || REDUCED_MOTION()) return;

    const items = section.querySelectorAll("[data-contact-reveal]");
    if (!items.length) return;

    gsap.set(items, { y: 80, opacity: 0 });

    const trigger = ScrollTrigger.create({
      trigger: section.querySelector("[data-contact-content]"),
      start: "top 80%",
      once: true,
      onEnter: () => {
        gsap.to(items, {
          y: 0,
          opacity: 1,
          duration: 1.2,
          stagger: 0.2,
          ease: "power4.out",
        });
      },
    });

    return () => trigger.kill();
  }, []);

  // ── 3. Rotating badge accelerate on scroll ───────────────────
  useEffect(() => {
    const section = sectionRef.current;
    if (!section || REDUCED_MOTION()) return;

    const badge = section.querySelector("[data-contact-badge]");
    if (!badge) return;

    const trigger = ScrollTrigger.create({
      trigger: section,
      start: "top bottom",
      end: "bottom top",
      scrub: 3,
      onUpdate: (self) => {
        gsap.set(badge, { rotation: self.progress * 360 });
      },
    });

    return () => trigger.kill();
  }, []);

  // ── 4. Heading parallax drift ────────────────────────────────
  useEffect(() => {
    const section = sectionRef.current;
    if (!section || REDUCED_MOTION()) return;

    const chars = section.querySelectorAll("[data-contact-char]");
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
