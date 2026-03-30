import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useHeadingAnimation, REDUCED_MOTION } from "@/hooks/useHeadingAnimation";

export function useProjectsAnimations() {
  const sectionRef = useRef<HTMLElement>(null);

  useHeadingAnimation(sectionRef, { prefix: "projects", charStagger: 0.1 });

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || REDUCED_MOTION()) return;

    // Keep grid visible, hide individual cards
    const items = section.querySelectorAll("[data-project-item]");
    if (!items.length) return;

    gsap.set(items, { y: 60, opacity: 0, scale: 0.95 });

    const reveal = () => {
      gsap.to(items, {
        y: 0, opacity: 1, scale: 1,
        duration: 0.5, stagger: 0.1, ease: "power3.out",
      });
    };

    section.addEventListener("heading-done", reveal, { once: true });

    return () => section.removeEventListener("heading-done", reveal);
  }, []);

  return sectionRef;
}
