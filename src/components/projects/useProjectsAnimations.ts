import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useHeadingAnimation, REDUCED_MOTION } from "@/hooks/useHeadingAnimation";

export function useProjectsAnimations() {
  const sectionRef = useRef<HTMLElement>(null);

  useHeadingAnimation(sectionRef, { prefix: "projects", charStagger: 0.1 });

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || REDUCED_MOTION()) return;

    const list = section.querySelector("[data-project-list]");
    if (!list) return;

    gsap.set(list, { opacity: 0, y: 40 });

    const reveal = () => {
      gsap.to(list, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" });
    };

    section.addEventListener("heading-done", reveal, { once: true });

    return () => section.removeEventListener("heading-done", reveal);
  }, []);

  return sectionRef;
}
