import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useHeadingAnimation, REDUCED_MOTION } from "@/hooks/useHeadingAnimation";

gsap.registerPlugin(ScrollTrigger);

export function useContactAnimations() {
  const sectionRef = useRef<HTMLElement>(null);

  useHeadingAnimation(sectionRef, { prefix: "contact" });

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || REDUCED_MOTION()) return;

    const content = section.querySelector("[data-contact-content]");
    if (!content) return;

    gsap.set(content, { opacity: 0, y: 40 });

    const reveal = () => {
      gsap.to(content, { opacity: 1, y: 0, duration: 0.3, ease: "power3.out" });
    };

    section.addEventListener("heading-done", reveal, { once: true });

    return () => section.removeEventListener("heading-done", reveal);
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
        gsap.set(badge, { rotation: self.progress * 360, force3D: true });
      },
    });

    return () => trigger.kill();
  }, []);

  return sectionRef;
}
