import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

const ROLES = [
  "React / Next.js / Node.js",
  "Full Stack Web Applications",
  "UI/UX Design & Development",
  "Performant & Accessible Code",
];

export function RotatingText() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % ROLES.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div data-hero-rotating className="flex items-center gap-3">
      <span className="h-px w-12 bg-primary/60 shadow-[0_0_8px_rgba(255,107,43,0.4)]" />
      <div className="relative h-8 overflow-hidden md:h-10">
        <AnimatePresence mode="wait">
          <motion.span
            key={ROLES[currentIndex]}
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: "0%", opacity: 1 }}
            exit={{ y: "-100%", opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
            className="absolute text-lg font-medium text-muted-foreground md:text-xl"
          >
            {ROLES[currentIndex]}
          </motion.span>
        </AnimatePresence>
      </div>
    </div>
  );
}
