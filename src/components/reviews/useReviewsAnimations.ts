import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const REDUCED_MOTION = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function useReviewsAnimations() {
  const sectionRef = useRef<HTMLElement>(null);

  // ── 1. Heading entrance (fires once) ─────────────────────────
  useEffect(() => {
    const section = sectionRef.current;
    if (!section || REDUCED_MOTION()) return;

    const tl = gsap.timeline({
      paused: true,
      defaults: { ease: "power4.out", duration: 0.8 },
    });

    tl.from(section.querySelector("[data-reviews-label]"), {
      y: 20, opacity: 0, duration: 0.5,
    });

    tl.from(section.querySelectorAll("[data-reviews-char]"), {
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

  // ── 2. Content entrance + star pop-in (fires once) ───────────
  useEffect(() => {
    const section = sectionRef.current;
    if (!section || REDUCED_MOTION()) return;

    const rows = section.querySelectorAll("[data-reviews-row]");
    if (!rows.length) return;

    // Collect all stars for stagger animation
    const allStars: Element[] = [];
    section.querySelectorAll("[data-review-stars]").forEach((container) => {
      container.querySelectorAll("svg").forEach((star) => allStars.push(star));
    });

    gsap.set(rows, { y: 80, opacity: 0 });
    if (allStars.length) gsap.set(allStars, { scale: 0, opacity: 0 });

    const trigger = ScrollTrigger.create({
      trigger: section.querySelector("[data-reviews-content]"),
      start: "top 70%",
      once: true,
      onEnter: () => {
        gsap.to(rows, {
          y: 0, opacity: 1, duration: 1.2, stagger: 0.2, ease: "power4.out",
        });

        if (allStars.length) {
          gsap.to(allStars, {
            scale: 1, opacity: 1, duration: 0.4, stagger: 0.05,
            ease: "back.out(1.7)", delay: 0.6,
          });
        }
      },
    });

    return () => trigger.kill();
  }, []);

  // ── 3. Heading parallax drift ────────────────────────────────
  useEffect(() => {
    const section = sectionRef.current;
    if (!section || REDUCED_MOTION()) return;

    const chars = section.querySelectorAll("[data-reviews-char]");
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

  // ── 4. Avatar glow pulse (continuous breathing) ──────────────
  useEffect(() => {
    const section = sectionRef.current;
    if (!section || REDUCED_MOTION()) return;

    const avatars = section.querySelectorAll<HTMLElement>("[data-review-avatar]");
    if (!avatars.length) return;

    const tweens: gsap.core.Tween[] = [];

    avatars.forEach((avatar, i) => {
      tweens.push(
        gsap.to(avatar, {
          boxShadow: "0 0 20px var(--primary)",
          duration: 2,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
          delay: i * 0.3,
        }),
      );
    });

    return () => tweens.forEach((t) => t.kill());
  }, []);

  return sectionRef;
}
