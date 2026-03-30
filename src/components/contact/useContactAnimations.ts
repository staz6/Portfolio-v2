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

    const content = section.querySelector<HTMLElement>("[data-contact-content]");
    if (!content) return;

    const onHeadingDone = () => {
      gsap.to(content, { opacity: 1, y: 0, duration: 0.4, ease: "power3.out" });
    };

    if ((section as any).__headingDone) { onHeadingDone(); return; }
    section.addEventListener("heading-done", onHeadingDone, { once: true });

    // ── Rotating badge accelerate on scroll ──
    const badge = section.querySelector("[data-contact-badge]");
    let badgeTrigger: ScrollTrigger | undefined;

    if (badge) {
      badgeTrigger = ScrollTrigger.create({
        trigger: section,
        start: "top bottom",
        end: "bottom top",
        scrub: 3,
        onUpdate: (self) => {
          gsap.set(badge, { rotation: self.progress * 360, force3D: true });
        },
      });
    }

    return () => {
      section.removeEventListener("heading-done", onHeadingDone);
      badgeTrigger?.kill();
    };
  }, []);

  return sectionRef;
}
