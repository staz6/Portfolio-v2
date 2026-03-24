import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useHeadingAnimation, REDUCED_MOTION } from "@/hooks/useHeadingAnimation";

gsap.registerPlugin(ScrollTrigger);

/**
 * About section animations. Uses shared heading animation + section-specific
 * scene entrance and optional variant steps (pills, skill words, etc.).
 */
export function useAboutAnimations(
  buildVariantSteps?: (tl: gsap.core.Timeline, section: HTMLElement) => void,
) {
  const sectionRef = useRef<HTMLElement>(null);
  const entranceTl = useRef<gsap.core.Timeline | null>(null);

  // Shared heading entrance + parallax
  useHeadingAnimation(sectionRef, { prefix: "about", charStagger: 0.15 });

  // ── Scene + variant entrance (fires once) ──
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    if (REDUCED_MOTION()) {
      gsap.set(
        section.querySelectorAll(
          "[data-about-line], [data-about-pill], [data-about-divider], [data-v2-skill-word], [data-v2-dot]",
        ),
        { opacity: 1, y: 0, x: 0, scale: 1, scaleX: 1 },
      );
      gsap.set(section.querySelector("[data-about-scene]"), { opacity: 1 });
      window.dispatchEvent(new Event("about-scene-enter"));
      return;
    }

    gsap.set(section.querySelector("[data-about-scene]"), { opacity: 0 });

    const tl = gsap.timeline({
      paused: true,
      defaults: { ease: "power4.out", duration: 0.8 },
    });
    entranceTl.current = tl;

    // 3D scene fade in + dispatch scale event to Three.js
    const sceneEl = section.querySelector("[data-about-scene]");
    if (sceneEl) {
      tl.to(sceneEl, {
        opacity: 1, duration: 1, ease: "power2.out",
        onStart: () => { window.dispatchEvent(new Event("about-scene-enter")); },
      });
    }

    // Variant-specific steps (pills, skill words, etc.)
    buildVariantSteps?.(tl, section);

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

  return sectionRef;
}
