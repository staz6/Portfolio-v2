import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useHeadingAnimation, REDUCED_MOTION } from "@/hooks/useHeadingAnimation";

gsap.registerPlugin(ScrollTrigger);

export function useExperienceAnimations() {
  const sectionRef = useRef<HTMLElement>(null);

  useHeadingAnimation(sectionRef, { prefix: "experience" });

  // ── Batched item entrance ──
  useEffect(() => {
    const section = sectionRef.current;
    if (!section || REDUCED_MOTION()) return;

    const items = section.querySelectorAll("[data-exp-item]");
    if (!items.length) return;

    gsap.set(items, { y: 60, opacity: 0 });

    const batch = ScrollTrigger.batch(items, {
      start: "top 85%",
      once: true,
      onEnter: (batch) => {
        gsap.to(batch, {
          y: 0, opacity: 1, duration: 1, stagger: 0.15,
          ease: "power4.out", force3D: true,
        });
      },
    });

    return () => {
      if (Array.isArray(batch)) batch.forEach((t) => t.kill());
    };
  }, []);

  return sectionRef;
}
