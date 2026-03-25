import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useHeadingAnimation, REDUCED_MOTION } from "@/hooks/useHeadingAnimation";

gsap.registerPlugin(ScrollTrigger);

export function useContactAnimations() {
  const sectionRef = useRef<HTMLElement>(null);

  useHeadingAnimation(sectionRef, { prefix: "contact", charDuration: 0.8, charStagger: 0.1 });

  // ── Content entrance via IO ──
  useEffect(() => {
    const section = sectionRef.current;
    if (!section || REDUCED_MOTION()) return;

    const items = section.querySelectorAll("[data-contact-reveal]");
    if (!items.length) return;

    gsap.set(items, { y: 50, opacity: 0 });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            observer.unobserve(entry.target);
            gsap.to(entry.target, {
              y: 0, opacity: 1, duration: 0.8,
              ease: "power4.out",
            });
          }
        });
      },
      { threshold: 0.1 },
    );

    items.forEach((item) => observer.observe(item));

    return () => observer.disconnect();
  }, []);

  // ── Rotating badge accelerate on scroll (keep as ScrollTrigger) ──
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
        gsap.set(badge, { rotation: self.progress * 360, force3D: true });
      },
    });

    return () => trigger.kill();
  }, []);

  return sectionRef;
}
