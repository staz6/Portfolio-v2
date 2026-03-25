import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useHeadingAnimation, REDUCED_MOTION } from "@/hooks/useHeadingAnimation";

gsap.registerPlugin(ScrollTrigger);

export function useContactAnimations() {
  const sectionRef = useRef<HTMLElement>(null);

  useHeadingAnimation(sectionRef, { prefix: "contact", charDuration: 1.2, charStagger: 0.15 });

  // ── Content staggered entrance ──
  useEffect(() => {
    const section = sectionRef.current;
    if (!section || REDUCED_MOTION()) return;

    const items = section.querySelectorAll("[data-contact-reveal]");
    if (!items.length) return;

    gsap.set(items, { y: 80, opacity: 0 });

    const trigger = ScrollTrigger.create({
      trigger: section.querySelector("[data-contact-content]"),
      start: "top 85%",
      once: true,
      onEnter: () => {
        gsap.to(items, {
          y: 0, opacity: 1, duration: 1.2, stagger: 0.2, ease: "power4.out",
        });
      },
      onRefresh: (self) => {
        if (self.progress > 0) gsap.set(items, { y: 0, opacity: 1 });
      },
    });

    return () => trigger.kill();
  }, []);

  // ── Rotating badge accelerate on scroll ──
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

  return sectionRef;
}
