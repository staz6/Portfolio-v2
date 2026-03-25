import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useHeadingAnimation, REDUCED_MOTION } from "@/hooks/useHeadingAnimation";

gsap.registerPlugin(ScrollTrigger);

export function useReviewsAnimations() {
  const sectionRef = useRef<HTMLElement>(null);

  useHeadingAnimation(sectionRef, { prefix: "reviews" });

  // ── Content entrance + star pop-in ──
  useEffect(() => {
    const section = sectionRef.current;
    if (!section || REDUCED_MOTION()) return;

    const rows = section.querySelectorAll("[data-reviews-row]");
    if (!rows.length) return;

    const allStars: Element[] = [];
    section.querySelectorAll("[data-review-stars]").forEach((container) => {
      container.querySelectorAll("svg").forEach((star) => allStars.push(star));
    });

    gsap.set(rows, { y: 80, opacity: 0 });
    if (allStars.length) gsap.set(allStars, { scale: 0, opacity: 0 });

    const showAll = () => {
      gsap.set(rows, { y: 0, opacity: 1 });
      if (allStars.length) gsap.set(allStars, { scale: 1, opacity: 1 });
    };

    const trigger = ScrollTrigger.create({
      trigger: section.querySelector("[data-reviews-content]"),
      start: "top 85%",
      once: true,
      onEnter: () => {
        gsap.to(rows, {
          y: 0, opacity: 1, duration: 1.2, stagger: 0.2, ease: "power4.out",
        });
        if (allStars.length) {
          gsap.to(allStars, {
            scale: 1, opacity: 1, duration: 0.4, stagger: 0.05,
            ease: "back.out(1.7)", delay: 0.6,
          });
        }
      },
      onRefresh: (self) => { if (self.progress > 0) showAll(); },
    });

    return () => trigger.kill();
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
          boxShadow: "0 0 20px var(--primary)",
          duration: 2, ease: "sine.inOut",
          repeat: -1, yoyo: true, delay: i * 0.3,
        }),
      );
    });

    return () => tweens.forEach((t) => t.kill());
  }, []);

  return sectionRef;
}
