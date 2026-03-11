import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useAfterPreloader } from "@/hooks/useAfterPreloader";
import { HeroTitle } from "./HeroTitle";
import { RotatingText } from "./RotatingText";
import { HeroBio } from "./HeroBio";
import { HeroStats } from "./HeroStats";
import { HeroSocials } from "./HeroSocials";
import { HeroCTA } from "./HeroCTA";
import { HeroLocation } from "./HeroLocation";
import { HeroMarquee } from "./HeroMarquee";
import { HeroScene } from "./HeroScene";

gsap.registerPlugin(ScrollTrigger);

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Master entrance timeline — waits for preloader to finish
  const entranceTl = useRef<gsap.core.Timeline>();

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    // Respect reduced motion
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(
        section.querySelectorAll(
          "[data-hero-char], [data-hero-rotating], [data-hero-bio], [data-hero-stat], [data-hero-cta], [data-hero-social], [data-hero-scroll], [data-hero-badge], [data-hero-scene], [data-hero-location], [data-hero-marquee]",
        ),
        { opacity: 1, y: 0, x: 0, scale: 1 },
      );
      return;
    }

    // Hide while preloader is up. Using visibility (not opacity) so
    // gsap.from({ opacity: 0 }) targets remain correct.
    gsap.set(section, { visibility: "hidden" });

    return () => {
      entranceTl.current?.kill();
    };
  }, []);

  useAfterPreloader(() => {
    const section = sectionRef.current;
    if (!section) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsap.set(section, { visibility: "visible" });

    const tl = gsap.timeline({
      defaults: { ease: "power4.out", duration: 0.8 },
    });
    entranceTl.current = tl;

    // 1. Badge
    tl.from("[data-hero-badge]", { y: 20, opacity: 0, duration: 0.5 });

    // 2. 3D scene fades in
    tl.from("[data-hero-scene]", { opacity: 0, duration: 1.5, ease: "power2.inOut" }, "-=0.3");

    // 3. Name characters — slide up from mask
    tl.from(section.querySelectorAll("[data-hero-char]"), {
      y: "110%", duration: 1, ease: "power4.out", stagger: 0.03,
    }, "-=1.2");

    // 4. Rotating title
    tl.from("[data-hero-rotating]", { y: 30, opacity: 0, duration: 0.6 }, "-=0.5");

    // 5. Tech marquee
    tl.from("[data-hero-marquee]", { opacity: 0, duration: 0.6 }, "-=0.3");

    // 6. Bio + Stats (bottom row)
    tl.from("[data-hero-bio]", { y: 30, opacity: 0, duration: 0.6 }, "-=0.3");
    tl.from(section.querySelectorAll("[data-hero-stat]"), {
      y: 30, opacity: 0, duration: 0.5, stagger: 0.1,
    }, "-=0.4");

    // 7. Location badge + CTA
    tl.from("[data-hero-location]", { scale: 0.8, opacity: 0, duration: 0.5, ease: "back.out(1.7)" }, "-=0.3");
    tl.from("[data-hero-cta]", { scale: 0.8, opacity: 0, duration: 0.5, ease: "back.out(1.7)" }, "-=0.3");

    // 8. Socials
    tl.from(section.querySelectorAll("[data-hero-social]"), {
      x: -20, opacity: 0, duration: 0.4, stagger: 0.08,
    }, "-=0.3");

    // 9. Scroll indicator
    tl.from("[data-hero-scroll]", { opacity: 0, duration: 0.5 }, "-=0.1");
  });

  // Scroll parallax — layered depth + horizontal text movement
  useEffect(() => {
    const content = contentRef.current;
    const section = sectionRef.current;
    if (!content || !section) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const isMobile = window.innerWidth < 1024;
    const triggers: ScrollTrigger[] = [];

    // Bravild-style polygon clip + content fade/lift
    triggers.push(
      ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: "bottom top",
        scrub: isMobile ? 1.5 : 0.3,
        onUpdate: (self) => {
          const p = self.progress;
          const tlX = p * 20;
          const trX = 100 - p * 25;
          const brX = 100 - p * 5;
          const blX = p * 2;
          const blY = 100 - p * 12;
          const brY = 100 - p * 4;
          section.style.clipPath = `polygon(${tlX}% 0%, ${trX}% 0%, ${brX}% ${brY}%, ${blX}% ${blY}%)`;
          gsap.set(content, {
            y: p * -100,
            opacity: 1 - p * 0.6,
          });
        },
      }),
    );


    // Badge + rotating text fade out (combined)
    const badge = section.querySelector("[data-hero-badge]");
    const rotating = section.querySelector("[data-hero-rotating]");
    if (badge || rotating) {
      triggers.push(
        ScrollTrigger.create({
          trigger: section,
          start: "top top",
          end: "40% top",
          scrub: isMobile ? 1 : 0.3,
          onUpdate: (self) => {
            const p = self.progress;
            if (badge) {
              const badgeP = Math.min(p / 0.75, 1);
              gsap.set(badge, { opacity: 1 - badgeP, y: badgeP * -30 });
            }
            if (rotating) {
              gsap.set(rotating, { opacity: 1 - p, y: p * -20 });
            }
          },
        }),
      );
    }

    // Stats + location parallax (combined)
    const statsEls = section.querySelectorAll("[data-hero-stat]");
    const location = section.querySelector("[data-hero-location]");
    if (statsEls.length || location) {
      triggers.push(
        ScrollTrigger.create({
          trigger: section,
          start: "top top",
          end: "bottom top",
          scrub: isMobile ? 1.5 : 0.5,
          onUpdate: (self) => {
            const p = self.progress;
            if (statsEls.length) gsap.set(statsEls, { y: p * -40 });
            if (location) gsap.set(location, { scale: 1 - p * 0.15, y: p * -20 });
          },
        }),
      );
    }

    return () => {
      triggers.forEach((t) => t.kill());
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="noise-overlay relative flex min-h-screen items-center overflow-hidden bg-secondary pt-20"
    >
      {/* Radial glow blobs */}
      <div className="pointer-events-none absolute -top-1/4 -left-1/4 h-[60%] w-[60%] rounded-full bg-primary/[0.08] blur-[60px] lg:blur-[120px]" />
      <div className="pointer-events-none absolute -right-1/4 -bottom-1/4 h-[50%] w-[50%] rounded-full bg-primary/[0.06] blur-[50px] lg:blur-[100px]" />
      <div className="pointer-events-none absolute top-1/3 left-1/2 h-[35%] w-[35%] -translate-x-1/2 rounded-full bg-primary/[0.05] blur-[40px] lg:blur-[80px]" />

      {/* 3D wireframe shapes */}
      <HeroScene />

      <div
        ref={contentRef}
        className="relative z-10 mx-auto flex w-full max-w-7xl flex-col gap-6 px-6 lg:gap-8 lg:px-10"
      >
        {/* Top — badge */}
        <div data-hero-badge>
          <span className="inline-flex items-center gap-3 rounded-full border border-primary/20 bg-primary/10 py-1.5 pl-2 pr-5 text-sm font-medium text-foreground shadow-[0_0_20px_rgba(255,107,43,0.15)] backdrop-blur-md">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/20">
              <span className="h-2 w-2 animate-pulse rounded-full bg-primary" />
            </span>
            Available for work
          </span>
        </div>

        {/* Center — massive name */}
        <div className="flex flex-col gap-4">
          <HeroTitle />
          <RotatingText />
        </div>

        {/* Full-width tech marquee — breaks out of container */}
        <div className="relative left-1/2 w-screen -translate-x-1/2">
          <HeroMarquee />
        </div>

        {/* Bottom — bio left, stats right */}
        <div className="flex flex-col justify-between gap-10 lg:flex-row lg:items-end">
          <div className="flex flex-col gap-6">
            <HeroBio />
            <div className="flex items-center gap-6">
              <HeroCTA />
              <HeroSocials />
            </div>
          </div>
          <div className="flex flex-col items-start gap-6 lg:items-end">
            <HeroStats />
            <HeroLocation />
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        data-hero-scroll
        className="absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <span className="text-xs uppercase tracking-widest text-primary/60">
          Scroll
        </span>
        <div className="h-12 w-px bg-gradient-to-b from-primary/50 to-transparent" />
      </motion.div>
    </section>
  );
}
