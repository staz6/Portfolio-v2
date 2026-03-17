import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const REDUCED_MOTION = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

interface HeadingAnimationOptions {
  /** The data-attribute prefix, e.g. "about" for data-about-label / data-about-char */
  prefix: string;
  /** Char stagger delay in seconds (default 0.12) */
  charStagger?: number;
  /** Char animation duration in seconds (default 1) */
  charDuration?: number;
}

/**
 * Reusable hook for section heading entrance + parallax drift.
 * Handles:
 * 1. Hide label + chars immediately (prevent SSR flash)
 * 2. Entrance animation on scroll (label fades in, chars slide up)
 * 3. Parallax horizontal drift on scroll (desktop only)
 *
 * Expects the section to have:
 * - `[data-{prefix}-label]` — section label (e.g. "01 — About")
 * - `[data-{prefix}-char]` — individual heading words wrapped in overflow-hidden spans
 */
export function useHeadingAnimation(
  sectionRef: React.RefObject<HTMLElement | null>,
  options: HeadingAnimationOptions,
) {
  const { prefix, charStagger = 0.12, charDuration = 1 } = options;

  // ── Heading entrance (fires once) ──────────────────────────────
  useEffect(() => {
    const section = sectionRef.current;
    if (!section || REDUCED_MOTION()) return;

    const label = section.querySelector(`[data-${prefix}-label]`);
    const chars = section.querySelectorAll(`[data-${prefix}-char]`);

    // Hide immediately to prevent flash before scroll animation
    if (label) gsap.set(label, { opacity: 0, y: 20 });
    if (chars.length) gsap.set(chars, { y: "110%" });

    const tl = gsap.timeline({
      paused: true,
      defaults: { ease: "power4.out", duration: 0.8 },
    });

    if (label) {
      tl.fromTo(label,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5 },
      );
    }

    if (chars.length) {
      tl.fromTo(chars,
        { y: "110%" },
        { y: "0%", duration: charDuration, ease: "power4.out", stagger: charStagger },
        "-=0.3",
      );
    }

    const trigger = ScrollTrigger.create({
      trigger: section,
      start: "top 75%",
      once: true,
      onEnter: () => tl.play(),
    });

    return () => { trigger.kill(); tl.kill(); };
  }, []);

  // ── Heading parallax drift (desktop only) ──────────────────────
  useEffect(() => {
    const section = sectionRef.current;
    if (!section || REDUCED_MOTION()) return;
    if (window.innerWidth < 1024) return;

    const chars = section.querySelectorAll(`[data-${prefix}-char]`);
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
}

export { REDUCED_MOTION };
