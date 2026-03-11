import { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExperienceHeading } from "./ExperienceHeading";
import { useExperienceAnimations } from "./useExperienceAnimations";
import { EXPERIENCES } from "./experienceData";
import type { ExperienceData } from "./experienceData";

export function Experience() {
  const sectionRef = useExperienceAnimations();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [mobileExpanded, setMobileExpanded] = useState<number | null>(null);
  const hoverTimeout = useRef<ReturnType<typeof setTimeout>>(undefined);

  const handleEnter = useCallback((i: number) => {
    clearTimeout(hoverTimeout.current);
    setHoveredIndex(i);
  }, []);

  const handleLeave = useCallback(() => {
    clearTimeout(hoverTimeout.current);
    hoverTimeout.current = setTimeout(() => setHoveredIndex(null), 100);
  }, []);

  const handleClick = useCallback((i: number) => {
    if (window.matchMedia("(max-width: 1023px)").matches) {
      setMobileExpanded((prev) => (prev === i ? null : i));
    }
  }, []);

  return (
    <section
      ref={sectionRef}
      id="experience"
      className="relative overflow-hidden bg-background"
    >
      {/* Heading */}
      <div className="relative z-10 mx-auto max-w-7xl px-6 pb-16 pt-24 lg:px-10 lg:pb-24 lg:pt-40">
        <ExperienceHeading />
      </div>

      {/* Experience rows */}
      <div className="relative z-10 mx-auto max-w-7xl px-6 pb-24 lg:px-10">
        <div data-exp-list className="border-t border-border/40">
          {EXPERIENCES.map((exp, i) => (
            <ExperienceRow
              key={exp.companyName}
              experience={exp}
              index={i}
              isHovered={hoveredIndex === i}
              isMobileExpanded={mobileExpanded === i}
              onHoverStart={handleEnter}
              onHoverEnd={handleLeave}
              onClick={handleClick}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function ExperienceRow({
  experience,
  index,
  isHovered,
  isMobileExpanded,
  onHoverStart,
  onHoverEnd,
  onClick,
}: {
  experience: ExperienceData;
  index: number;
  isHovered: boolean;
  isMobileExpanded: boolean;
  onHoverStart: (i: number) => void;
  onHoverEnd: () => void;
  onClick: (i: number) => void;
}) {
  const handleMouseEnter = useCallback(() => {
    onHoverStart(index);
  }, [index, onHoverStart]);

  const handleClick = useCallback(() => {
    onClick(index);
  }, [index, onClick]);

  return (
    <div
      data-exp-item={index}
      data-cursor-scale
      onMouseEnter={handleMouseEnter}
      onMouseLeave={onHoverEnd}
      onClick={handleClick}
      className="group relative border-b border-border/40 transition-colors hover:border-primary/40"
    >
      {/* ── Desktop ── */}
      <div className="hidden lg:block">
        <div className="relative py-12">
          <div className="flex items-center justify-between">
            {/* Left: year + company */}
            <div className="flex items-baseline gap-10">
              <span className="font-heading text-base font-semibold text-muted-foreground transition-colors duration-300 group-hover:text-primary">
                {experience.year}
              </span>
              <h3 className="font-heading text-7xl font-bold text-foreground transition-[translate,color] duration-300 group-hover:translate-x-2 group-hover:text-primary xl:text-8xl">
                {experience.companyName}
              </h3>
            </div>

            {/* Right: role + badge + arrow */}
            <div className="flex items-center gap-6">
              {experience.isCurrent && (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
                  Current
                </span>
              )}
              <span className="text-sm font-medium uppercase tracking-widest text-muted-foreground transition-colors duration-300 group-hover:text-foreground">
                {experience.position}
              </span>
              <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full border border-border transition-all duration-300 group-hover:border-primary group-hover:bg-primary group-hover:text-primary-foreground">
                <svg
                  className="h-5 w-5 -rotate-45 transition-transform duration-300 group-hover:rotate-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M17 7H7M17 7v10" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Detail panel — CSS grid-rows for GPU-friendly height animation */}
        <div
          className="grid transition-[grid-template-rows,opacity] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
          style={{
            gridTemplateRows: isHovered ? "1fr" : "0fr",
            opacity: isHovered ? 1 : 0,
          }}
        >
          <div className="overflow-hidden">
            <div className="rounded-b-2xl border-x border-b border-primary/20 bg-card px-10 pb-8 pt-6 shadow-xl shadow-primary/[0.03]">
              <div className="grid grid-cols-[200px_1fr] gap-12">
                {/* Left: date + position */}
                <div>
                  <p className="font-heading text-lg font-bold text-foreground">
                    {experience.position}
                  </p>
                  <p className="mt-1.5 text-sm tracking-wider text-muted-foreground">
                    {experience.startDate} — {experience.endDate ?? "Present"}
                  </p>
                </div>

                {/* Right: highlights */}
                <div className="space-y-3">
                  {experience.highlights.map((h, j) => (
                    <p
                      key={j}
                      className="flex items-start gap-3 text-base leading-relaxed text-foreground/80"
                    >
                      <span className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-primary" />
                      {h}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Mobile ── */}
      <div className="lg:hidden">
        <div className="flex items-center justify-between py-8">
          <div className="flex items-baseline gap-4">
            <span className="font-heading text-sm font-semibold text-muted-foreground transition-colors duration-300 group-hover:text-primary">
              {experience.year}
            </span>
            <h3 className="font-heading text-2xl font-bold text-foreground transition-colors duration-500 group-hover:text-primary sm:text-3xl md:text-5xl">
              {experience.companyName}
            </h3>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-full border border-border transition-all duration-300 group-hover:border-primary group-hover:bg-primary group-hover:text-primary-foreground">
            <svg
              className={`h-4 w-4 transition-transform duration-300 ${isMobileExpanded ? "rotate-180" : ""}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        <p className="pb-4 text-sm font-medium text-muted-foreground">
          {experience.position}
          {experience.isCurrent && (
            <span className="ml-2 inline-flex items-center gap-1 text-primary">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
              Current
            </span>
          )}
        </p>

        <AnimatePresence initial={false}>
          {isMobileExpanded && (
            <motion.div
              key="mobile-details"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
              className="overflow-hidden"
            >
              <div className="space-y-3 pb-6">
                <p className="text-xs tracking-wider text-muted-foreground/70">
                  {experience.startDate} — {experience.endDate ?? "Present"}
                </p>
                {experience.highlights.map((h, j) => (
                  <p key={j} className="flex items-start gap-2.5 text-sm leading-relaxed text-muted-foreground">
                    <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary/50" />
                    {h}
                  </p>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
