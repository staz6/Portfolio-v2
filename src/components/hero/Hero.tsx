import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { HeroTitle } from "./HeroTitle";
import { RotatingText } from "./RotatingText";
import { HeroBio } from "./HeroBio";
import { HeroStats } from "./HeroStats";
import { HeroSocials } from "./HeroSocials";
import { HeroCTA } from "./HeroCTA";
import { HeroLocation } from "./HeroLocation";
import { HeroScene } from "./HeroScene";

gsap.registerPlugin(ScrollTrigger);

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Master entrance timeline
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    // Respect reduced motion
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(
        section.querySelectorAll(
          "[data-hero-char], [data-hero-rotating], [data-hero-bio], [data-hero-stat], [data-hero-cta], [data-hero-social], [data-hero-scroll], [data-hero-badge], [data-hero-line], [data-hero-scene], [data-hero-location]",
        ),
        { opacity: 1, y: 0, x: 0, scale: 1, scaleX: 1 },
      );
      return;
    }

    const tl = gsap.timeline({
      defaults: { ease: "power4.out", duration: 0.8 },
      delay: 0.6,
    });

    // 1. Badge
    tl.from("[data-hero-badge]", {
      y: 20,
      opacity: 0,
      duration: 0.5,
    });

    // 2. 3D scene fades in
    tl.from(
      "[data-hero-scene]",
      {
        opacity: 0,
        duration: 1.5,
        ease: "power2.inOut",
      },
      "-=0.3",
    );

    // 3. Name characters — slide up from mask
    const chars = section.querySelectorAll("[data-hero-char]");
    tl.from(
      chars,
      {
        y: "110%",
        duration: 1,
        ease: "power4.out",
        stagger: 0.03,
      },
      "-=1.2",
    );

    // 3. Decorative line expands
    tl.from(
      "[data-hero-line]",
      {
        scaleX: 0,
        duration: 0.8,
        ease: "power3.inOut",
      },
      "-=0.6",
    );

    // 4. Rotating title
    tl.from(
      "[data-hero-rotating]",
      {
        y: 30,
        opacity: 0,
        duration: 0.6,
      },
      "-=0.5",
    );

    // 5. Bio + Stats (bottom row)
    tl.from(
      "[data-hero-bio]",
      {
        y: 30,
        opacity: 0,
        duration: 0.6,
      },
      "-=0.3",
    );

    const stats = section.querySelectorAll("[data-hero-stat]");
    tl.from(
      stats,
      {
        y: 30,
        opacity: 0,
        duration: 0.5,
        stagger: 0.1,
      },
      "-=0.4",
    );

    // 6. Location badge
    tl.from(
      "[data-hero-location]",
      {
        scale: 0.8,
        opacity: 0,
        duration: 0.5,
        ease: "back.out(1.7)",
      },
      "-=0.3",
    );

    // 7. CTA
    tl.from(
      "[data-hero-cta]",
      {
        scale: 0.8,
        opacity: 0,
        duration: 0.5,
        ease: "back.out(1.7)",
      },
      "-=0.3",
    );

    // 7. Socials
    const socials = section.querySelectorAll("[data-hero-social]");
    tl.from(
      socials,
      {
        x: -20,
        opacity: 0,
        duration: 0.4,
        stagger: 0.08,
      },
      "-=0.3",
    );

    // 8. Scroll indicator
    tl.from(
      "[data-hero-scroll]",
      {
        opacity: 0,
        duration: 0.5,
      },
      "-=0.1",
    );

    return () => {
      tl.kill();
    };
  }, []);

  // Scroll parallax — content fades and moves up as user scrolls
  useEffect(() => {
    const content = contentRef.current;
    const section = sectionRef.current;
    if (!content || !section) return;

    const trigger = ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: "bottom top",
      scrub: true,
      onUpdate: (self) => {
        gsap.set(content, {
          y: self.progress * -100,
          opacity: 1 - self.progress * 0.6,
        });
      },
    });

    return () => {
      trigger.kill();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative flex min-h-screen items-center overflow-hidden pt-20"
    >
      {/* 3D wireframe shapes */}
      <HeroScene />

      {/* Background gradient blobs */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-1/4 -right-1/4 h-[600px] w-[600px] rounded-full bg-primary/5 blur-[120px]" />
        <div className="absolute -bottom-1/4 -left-1/4 h-[500px] w-[500px] rounded-full bg-primary/5 blur-[100px]" />
      </div>

      <div
        ref={contentRef}
        className="relative z-10 mx-auto flex w-full max-w-7xl flex-col gap-10 px-6 lg:gap-14 lg:px-10"
      >
        {/* Top — badge */}
        <div data-hero-badge>
          <span className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-1.5 text-sm text-muted-foreground">
            <span className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
            Available for work
          </span>
        </div>

        {/* Center — massive name */}
        <div className="flex flex-col gap-4">
          <HeroTitle />
          <div
            data-hero-line
            className="h-px w-full origin-left bg-border"
          />
          <RotatingText />
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
        <span className="text-xs uppercase tracking-widest text-muted-foreground">
          Scroll
        </span>
        <div className="h-12 w-px bg-gradient-to-b from-muted-foreground to-transparent" />
      </motion.div>
    </section>
  );
}
