import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useHeadingAnimation, REDUCED_MOTION } from "@/hooks/useHeadingAnimation";

/**
 * About section animations — all entrances via IntersectionObserver.
 */
export function useAboutAnimations(
  buildVariantSteps?: (tl: gsap.core.Timeline, section: HTMLElement) => void,
) {
  const sectionRef = useRef<HTMLElement>(null);
  const entranceTl = useRef<gsap.core.Timeline | null>(null);

  useHeadingAnimation(sectionRef, { prefix: "about", charStagger: 0.1 });

  // ── Scene + variant entrance via IO ──
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
      defaults: { ease: "power4.out", duration: 0.6 },
    });
    entranceTl.current = tl;

    const sceneEl = section.querySelector("[data-about-scene]");
    if (sceneEl) {
      tl.to(sceneEl, {
        opacity: 1, duration: 0.8, ease: "power2.out",
        onStart: () => { window.dispatchEvent(new Event("about-scene-enter")); },
      });
    }

    buildVariantSteps?.(tl, section);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          observer.disconnect();
          tl.play();
        }
      },
      { threshold: 0.1 },
    );

    observer.observe(section);

    return () => {
      observer.disconnect();
      entranceTl.current?.kill();
    };
  }, []);

  return sectionRef;
}
