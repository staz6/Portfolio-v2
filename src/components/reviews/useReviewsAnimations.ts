import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useHeadingAnimation, REDUCED_MOTION } from "@/hooks/useHeadingAnimation";

export function useReviewsAnimations() {
  const sectionRef = useRef<HTMLElement>(null);

  useHeadingAnimation(sectionRef, { prefix: "reviews" });

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || REDUCED_MOTION()) return;

    const content = section.querySelector("[data-reviews-content]");
    if (!content) return;

    gsap.set(content, { opacity: 0 });

    const reveal = () => {
      gsap.to(content, { opacity: 1, duration: 0.2, ease: "power2.out" });
    };

    section.addEventListener("heading-done", reveal, { once: true });

    return () => section.removeEventListener("heading-done", reveal);
  }, []);

  // ── Avatar glow pulse ──
  useEffect(() => {
    const section = sectionRef.current;
    if (!section || REDUCED_MOTION()) return;

    const avatars = section.querySelectorAll<HTMLElement>("[data-review-avatar]");
    if (!avatars.length) return;

    const tweens: gsap.core.Tween[] = [];
    avatars.forEach((avatar, i) => {
      tweens.push(
        gsap.to(avatar, {
          opacity: 0.6,
          scale: 1.05,
          duration: 2, ease: "sine.inOut",
          repeat: -1, yoyo: true, delay: i * 0.3,
          force3D: true,
        }),
      );
    });

    return () => tweens.forEach((t) => t.kill());
  }, []);

  return sectionRef;
}
