import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useHeadingAnimation, REDUCED_MOTION } from "@/hooks/useHeadingAnimation";

export function useExperienceAnimations() {
  const sectionRef = useRef<HTMLElement>(null);

  useHeadingAnimation(sectionRef, { prefix: "experience" });

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || REDUCED_MOTION()) return;

    const content = section.querySelector("[data-exp-content]");
    if (!content) return;

    gsap.set(content, { opacity: 0, y: 40 });

    const reveal = () => {
      gsap.to(content, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" });
    };

    section.addEventListener("heading-done", reveal, { once: true });

    return () => section.removeEventListener("heading-done", reveal);
  }, []);

  return sectionRef;
}
