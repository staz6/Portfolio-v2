import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { AboutLayout } from "./AboutLayout";
import { useAboutAnimations } from "./useAboutAnimations";

gsap.registerPlugin(ScrollTrigger);

/* ── Skill words data ─────────────────────────────────────────────────── */

interface SkillRow {
  items: string[];
}

const SKILL_ROWS: SkillRow[] = [
  { items: ["AI", "Automation"] },
  { items: ["Frontend", "Backend"] },
  { items: ["API Integration"] },
  { items: ["Web Apps", "UI/UX"] },
  { items: ["AI", "Integration"] },
];

/* ── Component ─────────────────────────────────────────────────────────── */

export function AboutV2() {
  const sectionRef = useAboutAnimations((tl, section) => {
    // Skill words slam in
    const words = section.querySelectorAll("[data-v2-skill-word]");
    if (words.length) {
      tl.from(words, {
        y: 80, opacity: 0, duration: 0.7, stagger: 0.06, ease: "power4.out",
      }, "-=0.6");
    }

    // Dots scale in
    const dots = section.querySelectorAll("[data-v2-dot]");
    if (dots.length) {
      tl.from(dots, {
        scale: 0, opacity: 0, duration: 0.4, stagger: 0.05, ease: "back.out(2)",
      }, "-=0.5");
    }
  });

  // Scroll parallax — skill words subtle y drift
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const skillWords = section.querySelectorAll("[data-v2-skill-word]");
    if (!skillWords.length) return;

    const trigger = ScrollTrigger.create({
      trigger: section,
      start: "top bottom",
      end: "bottom top",
      scrub: 2,
      onUpdate: (self) => {
        gsap.set(skillWords, { y: self.progress * -20 });
      },
    });

    return () => trigger.kill();
  }, []);

  // Continuous breathing animations
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const tweens: gsap.core.Tween[] = [];

    // Skill words: gentle float
    section.querySelectorAll("[data-v2-skill-word]").forEach((word, i) => {
      tweens.push(
        gsap.to(word, {
          y: -4, duration: 2.5 + i * 0.2, ease: "sine.inOut",
          repeat: -1, yoyo: true, delay: i * 0.15,
        }),
      );
    });

    // Dots: pulsing scale
    section.querySelectorAll("[data-v2-dot]").forEach((dot, i) => {
      tweens.push(
        gsap.to(dot, {
          scale: 1.3, duration: 1.5, ease: "sine.inOut",
          repeat: -1, yoyo: true, delay: i * 0.4,
        }),
      );
    });

    return () => tweens.forEach((t) => t.kill());
  }, []);

  return (
    <AboutLayout sectionRef={sectionRef} contentGap="lg:gap-16">
      <div className="flex flex-col gap-4 lg:gap-5">
        {SKILL_ROWS.map((row, rowIdx) => (
          <div
            key={rowIdx}
            className="flex flex-wrap items-center justify-center gap-3 lg:justify-start lg:gap-5"
          >
            {row.items.map((word, wordIdx) => (
              <div key={wordIdx} className="flex items-center gap-3 lg:gap-5">
                {wordIdx > 0 && (
                  <span
                    data-v2-dot
                    className="inline-block h-3 w-3 rounded-sm bg-primary lg:h-4 lg:w-4"
                  />
                )}
                <span
                  data-v2-skill-word
                  className="font-heading text-3xl font-black uppercase leading-none tracking-tight text-foreground sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl"
                >
                  {word}
                </span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </AboutLayout>
  );
}
