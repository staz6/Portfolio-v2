import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useHeadingAnimation, REDUCED_MOTION } from "@/hooks/useHeadingAnimation";

export function useReviewsAnimations() {
  const sectionRef = useRef<HTMLElement>(null);

  useHeadingAnimation(sectionRef, { prefix: "reviews" });

  // ── Content entrance via IO ──
  useEffect(() => {
    const section = sectionRef.current;
    if (!section || REDUCED_MOTION()) return;

    const rows = section.querySelectorAll("[data-reviews-row]");
    if (!rows.length) return;

    const allStars: Element[] = [];
    section.querySelectorAll("[data-review-stars]").forEach((container) => {
      container.querySelectorAll("svg").forEach((star) => allStars.push(star));
    });

    gsap.set(rows, { y: 50, opacity: 0 });
    if (allStars.length) gsap.set(allStars, { scale: 0, opacity: 0 });

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          observer.disconnect();

          const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

          tl.to(rows, { y: 0, opacity: 1, duration: 0.8, stagger: 0.1 });

          if (allStars.length) {
            tl.to(allStars, {
              scale: 1, opacity: 1, duration: 0.3, stagger: 0.03,
              ease: "back.out(1.7)",
            }, "-=0.3");
          }
        }
      },
      { threshold: 0.05 },
    );

    observer.observe(section);

    return () => observer.disconnect();
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
