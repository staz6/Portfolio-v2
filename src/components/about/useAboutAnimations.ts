import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const REDUCED_MOTION = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Shared entrance + parallax animation logic for all About section variants.
 *
 * Returns a `sectionRef` to attach to the root `<section>`.
 * The `buildVariantSteps` callback lets each variant append its own
 * timeline steps (skill words, pills, etc.) after the shared ones.
 */
export function useAboutAnimations(
  buildVariantSteps?: (tl: gsap.core.Timeline, section: HTMLElement) => void,
) {
  const sectionRef = useRef<HTMLElement>(null);
  const entranceTl = useRef<gsap.core.Timeline | null>(null);

  // ── Entrance animation (fires once) ─────────────────────────────────
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    if (REDUCED_MOTION()) {
      gsap.set(
        section.querySelectorAll(
          "[data-about-label], [data-about-char], [data-about-line], [data-about-pill], [data-about-divider], [data-v2-skill-word], [data-v2-dot]",
        ),
        { opacity: 1, y: 0, x: 0, scale: 1, scaleX: 1 },
      );
      gsap.set(section.querySelector("[data-about-scene]"), { opacity: 1 });
      window.dispatchEvent(new Event("about-scene-enter"));
      return;
    }

    // Hide scene initially (scale handled inside Three.js)
    gsap.set(section.querySelector("[data-about-scene]"), { opacity: 0 });

    const tl = gsap.timeline({
      paused: true,
      defaults: { ease: "power4.out", duration: 0.8 },
    });
    entranceTl.current = tl;

    // 1. Section label
    tl.from(section.querySelector("[data-about-label]"), {
      y: 20, opacity: 0, duration: 0.5,
    });

    // 2. Heading words slide up
    tl.from(section.querySelectorAll("[data-about-char]"), {
      y: "110%", duration: 1, ease: "power4.out", stagger: 0.15,
    }, "-=0.3");

    // 3. 3D scene fade in + dispatch scale event to Three.js
    const sceneEl = section.querySelector("[data-about-scene]");
    if (sceneEl) {
      tl.to(sceneEl, {
        opacity: 1, duration: 1, ease: "power2.out",
        onStart: () => { window.dispatchEvent(new Event("about-scene-enter")); },
      }, "-=0.5");
    }

    // 4. Variant-specific steps (pills, skill words, etc.)
    buildVariantSteps?.(tl, section);

    // Trigger once at 75% viewport
    const trigger = ScrollTrigger.create({
      trigger: section,
      start: "top 75%",
      once: true,
      onEnter: () => tl.play(),
    });

    return () => {
      trigger.kill();
      entranceTl.current?.kill();
    };
  }, []);

  // ── Scroll parallax (heading horizontal drift) ──────────────────────
  useEffect(() => {
    const section = sectionRef.current;
    if (!section || REDUCED_MOTION()) return;

    const headingChars = section.querySelectorAll("[data-about-char]");
    if (!headingChars.length) return;

    const trigger = ScrollTrigger.create({
      trigger: section,
      start: "top bottom",
      end: "bottom top",
      scrub: 2,
      onUpdate: (self) => {
        gsap.set(headingChars, { x: (self.progress - 0.5) * -30 });
      },
    });

    return () => trigger.kill();
  }, []);

  return sectionRef;
}
